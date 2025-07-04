import Model from "../index.js";
import Result from "../../result.js";
import { FastText as FastTextLib } from "./fasttext.js";

export default class FastText extends Model {
  private readonly lib: any;
  private model: any;

  constructor(url: string) {
    super(url);
    this.lib = new FastTextLib();
  }
  async load() {
    this.model = await this.lib.loadModel(this.url);
    this.status = "READY";
    return true;
  }
  async classify(text: string, { limit = 1 }): Promise<Result[]> {
    await super.classify(text, { limit });
    const predictions = this.model.predict(text, limit);
    const predictionsArray = [];
    for (let i = 0; i < Object.getOwnPropertyNames(predictions)?.length; i++) {
      predictionsArray.push(
        new Result(
          predictions.get(i)[1]?.replace("__label__", ""),
          predictions?.get(i)[0],
        ),
      );
    }
    return predictionsArray;
  }
}
