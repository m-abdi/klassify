import Model from "./core/entities/models";
import Result from "./core/entities/result";

export default class Klassify {
  status: "INITIALIZED" | "READY" | "WORKING";
  private loadedModels = 0;
  models: { [key: string]: { [key: string]: { [key: string]: any } } } = {};
  constructor(
    config: {
      models: any;
      labels: { [key: string]: number };
      hasHeaders?: boolean;
    },
    settings: { preload: boolean; onLoad?: () => any },
  ) {
    this.status = "INITIALIZED";
    Object.entries(config).map(([key, value]) => {
      const modelInfo = key.split("_");
      if (modelInfo.length < 3) {
        throw new Error(`Invalid model config argument: ${key}`);
      }
      const modelId = modelInfo[0];
      const modelLang = modelInfo[1];
      const modelName = modelInfo[2];
      if (modelName === "ft") {
        import("./core/entities/models/fasttext/ft").then((res) => {
          const model = new res.default(value as any);
          this.finalizeInitialization(
            modelId,
            modelLang,
            modelName,
            model,
            settings,
            config,
          );
        });
      } else if (modelName === "ca") {
        import("./core/entities/models/candle/ca").then((res) => {
          const model = new res.default({
            url: value?.baseURL,
            labels: value?.labels ?? Object.keys(config?.labels ?? {}),
            documentPrefix: value?.documentPrefix,
            searchPrefix: value?.searchPrefix,
          });
          this.finalizeInitialization(
            modelId,
            modelLang,
            modelName,
            model,
            settings,
            config,
          );
        });
      }
    });
  }

  private finalizeInitialization(
    modelId: string,
    modelLang: string,
    modelName: string,
    model: Model,
    settings: { preload: boolean; onLoad?: () => any },
    config: object,
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
    if (settings?.preload) {
      model?.load().then((resp) => {
        if (resp) {
          this.loadedModels++;
          if (this.loadedModels === Object.keys(config)?.length) {
            this.status = "READY";
            settings?.onLoad?.();
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
    this.status = "WORKING";
    // text = this.normalize(text);
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
      this.status = "READY";
      return results[0];
    } else {
      this.status = "READY";
      return new Error("Language of the text is not supported.");
    }
  }
}
