import Model from "./core/entities/models";
import FastText from "./core/entities/models/fasttext";
import Result from "./core/entities/result";

export default class Klassify {
  status: "INITIALIZED" | "READY" | "WORKING";
  models: { [key: string]: { [key: string]: { [key: string]: any } } } = {};
  constructor(
    config: object,
    settings: { preload: boolean; onLoad?: () => any },
  ) {
    this.status = "INITIALIZED";
    let loadedModels = 0;
    Object.entries(config).map(([key, value]) => {
      const modelInfo = key.split("_");
      if (modelInfo?.length !== 3) {
        return new Error(`Invalid config record: ${key}`);
      }
      const modelId = modelInfo[0];
      const modelLang = modelInfo[1];
      const modelName = modelInfo[2];
      let model: Model;
      if (modelName === "fasttext") {
        model = new FastText(value);
      }
      model = new FastText(value);
      this.models = {
        ...this.models,
        [modelId]: {
          [modelLang]: {
            ...this?.models?.[modelId]?.[modelLang],
            [modelName]: model,
          },
        },
      };
      if (settings?.preload) {
        model?.load().then((resp) => {
          if (resp) {
            loadedModels++;
            if (loadedModels === Object.keys(config)?.length) {
              this.status = "READY";
              settings?.onLoad?.();
            }
          }
        });
      }
    });
  }

  async classify(text: string, modelId: string) {
    if (!this.models?.[modelId]) {
      return new Error("Invalid Model ID!");
    }
    this.status = "WORKING";
    // implemnt this later!
    let lang = "fa";
    if (this.models?.[modelId]?.[lang]) {
      let results: Result[] = [];
      const relatedModels = Object.entries(this.models?.[modelId]?.[lang]);
      for (let i = 0; i < relatedModels?.length; i++) {
        const classificationResult = await relatedModels[i][1].classify(text, {
          limit: 1,
        });
        results = [...results, ...classificationResult];
      }
      // implement combination of results later!
      this.status = "READY";
      return results[0];
    }
    this.status = "READY";
    return null;
  }
}
