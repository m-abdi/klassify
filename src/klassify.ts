import Model from "./core/libs";
import Result from "./core/entities/result";

type Status = "INITIALIZED" | "READY" | "WORKING";

type Config = {
  models: {
    [key: string]:
      | string
      | {
          baseURL: string;
          searchPrefix?: string;
          documentPrefix?: string;
        };
  };
  labels: {
    [key: string]: number;
  };
  hasHeaders?: boolean;
  preload?: boolean;
  nomalize?: boolean;
  onLoad?: () => any;
};

export default class Klassify {
  status?: Status;
  config: Config;
  private loadedModels = 0;
  models: { [key: string]: { [key: string]: { [key: string]: any } } } = {};

  constructor(config: Config) {
    this.config = config;
    this.changeStatus("INITIALIZED");
    Object.entries(config?.models).map(([key, value]) => {
      const modelInfo = key.split("_");
      if (modelInfo.length < 3) {
        throw new Error(`Invalid model config argument: ${key}`);
      }
      const modelId = modelInfo[0];
      const modelLang = modelInfo[1];
      const modelName = modelInfo[2];

      if (modelName === "ft") {
        import("./core/libs/fasttext/ft").then((res) => {
          const model = new res.default(value as any);
          this.finalizeInitialization(modelId, modelLang, modelName, model);
        });
      } else if (modelName === "ca" && typeof value !== "string") {
        import("./core/libs/candle/ca").then((res) => {
          const model = new res.default({
            url: value?.baseURL,
            labels: Object.keys(config?.labels ?? {}),
            documentPrefix: value?.documentPrefix,
            searchPrefix: value?.searchPrefix,
          });
          this.finalizeInitialization(modelId, modelLang, modelName, model);
        });
      }
    });
  }

  private changeStatus(newStatus: Status) {
    this.status = newStatus;
  }

  private finalizeInitialization(
    modelId: string,
    modelLang: string,
    modelName: string,
    model: Model,
  ) {
    this.models = {
      ...this.models,
      [modelId]: {
        ...this.models?.[modelId],
        [modelLang]: {
          ...this?.models?.[modelId]?.[modelLang],
          [modelName]: model,
        },
      },
    };

    if (this.config?.preload) {
      model?.load().then((resp: boolean) => {
        if (resp) {
          this.loadedModels++;
          if (this.loadedModels === Object.keys(this.config?.models)?.length) {
            this.changeStatus("READY");
            this.config?.onLoad?.();
          }
        }
      });
    }
  }

  private detectLanguage(text: string) {
    const persianRegex = /[\u0600-\u06FF\u06F0-\u06F9]/g; // Persian/Arabic Unicode block
    const englishRegex = /[A-Za-z0-9]/g; // English letters

    const persianMatches = text.match(persianRegex) || [];
    const englishMatches = text.match(englishRegex) || [];

    if (persianMatches.length > englishMatches.length) {
      return "fa";
    } else if (englishMatches.length > persianMatches.length) {
      return "en";
    }
  }

  private camelCaseToNormal(text: string): string {
    // Insert space before capital letters and trim
    const result = text
      // Add space before uppercase letters that are after lowercase letters or digits
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      // Add space between consecutive uppercase letters followed by lowercase letters (e.g., "IDNumber" -> "ID Number")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .trim();

    return result;
  }

  private normalize(input: string) {
    return this.camelCaseToNormal(input.replace(/_/g, " ")).toLowerCase();
  }

  async classify(text: string, modelId: string, id?: any) {
    if (!this.models?.[modelId]) {
      return new Error("Invalid Model ID!");
    }
    this.changeStatus("WORKING");
    if (this.config?.nomalize) {
      text = this.normalize(text);
    }
    let lang = this.detectLanguage(text) || "xx";
    const targetModel =
      this.models?.[modelId]?.[lang] || this.models?.[modelId]?.["xx"];
    if (lang && targetModel) {
      let results: Result[] = [];
      const relatedModels = Object.entries(targetModel);
      for (let i = 0; i < relatedModels?.length; i++) {
        const classificationResult = await relatedModels[i][1].classify(text, {
          limit: 1,
          id,
        });
        results = [...results, ...classificationResult];
      }
      // implement combination of results later!
      this.changeStatus("READY");
      return results[0];
    } else {
      this.changeStatus("READY");
      return new Error("Language of the text is not supported.");
    }
  }
}
