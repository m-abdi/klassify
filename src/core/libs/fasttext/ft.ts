import Model, { ModelConfig } from "../index";
import Result from "../../entities/result";
import { FastText as FastTextLib } from "./fasttext.js";

export default class FastText extends Model {
  private readonly lib: any;
  private model: any;

  constructor(config: ModelConfig) {
    super(config);
    this.lib = new FastTextLib();
  }
  async load() {
    this.model = await this.lib.loadModel(this.url);
    this.status = "READY";
    return true;
  }
  async classify(
    text: string,
    config: { limit: number; id?: any; labels?: string[] },
  ): Promise<Result[]> {
    await super.classify(text, { limit: config?.limit ?? 1 });
    const predictions = this.model.predict(text, config?.limit ?? 1);
    const predictionsArray = [];
    for (let i = 0; i < Object.getOwnPropertyNames(predictions)?.length; i++) {
      predictionsArray.push(
        new Result(
          text,
          predictions.get(i)[1]?.replace("__label__", ""),
          predictions?.get(i)[0],
          config?.id,
        ),
      );
    }
    return predictionsArray;
  }
}
