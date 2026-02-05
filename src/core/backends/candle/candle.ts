import Result from "../../entities/result";
import Model, { ModelConfig } from "../index";
import init, {
  Model as CandleModel,
} from "./candle/candle-wasm-examples/bert/build/m.js";

export default class Candle extends Model {
  private lib: any;
  private labels?: string[];
  private embeddings: any;
  private baseURL: string;
  private searchPrefix?: string = "";
  private documentPrefix?: string = "";

  constructor(config: ModelConfig) {
    super(config);
    this.baseURL = config?.url;
    this.labels = config?.labels;
    this.searchPrefix = config?.searchPrefix;
    this.documentPrefix = config?.documentPrefix;
  }

  async load() {
    await super.load();
    await init();
    const [weightsArrayU8, tokenizerArrayU8, mel_filtersArrayU8] =
      await Promise.all([
        this.fetchArrayBuffer(this.baseURL + "model.safetensors"),
        this.fetchArrayBuffer(this.baseURL + "tokenizer.json"),
        this.fetchArrayBuffer(this.baseURL + "config.json"),
      ]);

    this.lib = new CandleModel(
      weightsArrayU8,
      tokenizerArrayU8,
      mel_filtersArrayU8,
    );
    if (this.labels) {
      this.getLabelsEmbeddings();
    }
    this.status = "READY";
    return true;
  }

  async classify(
    text: string,
    config: { limit: number; id?: any; labels?: string[] },
  ): Promise<Result[]> {
    await super.classify(text, { limit: config?.limit ?? 1 });
    const queryEmbeddings = this.getEmbeddings(text, this.searchPrefix);
    if (config?.labels) {
      this.labels = config.labels;
      this.getLabelsEmbeddings();
    }
    const distances = this.embeddings
      .map((embedding: any, id: any) => ({
        id,
        similarity: this.cosineSimilarity(queryEmbeddings, embedding),
      }))
      .sort((a: any, b: any) => b.similarity - a.similarity)
      .slice(0, config?.limit ?? 10);

    const predictionsArray: any = [];
    distances.forEach((item: any) => {
      predictionsArray.push(
        new Result(
          text,
          this.labels?.[item?.id]!,
          item?.similarity,
          config?.id,
        ),
      );
    });
    this.changeStatus("READY");
    return predictionsArray;
  }

  private async fetchArrayBuffer(url: string) {
    const res = await fetch(url);
    return new Uint8Array(await res.arrayBuffer());
  }

  private getLabelsEmbeddings() {
    this.embeddings = this.labels?.map((label) =>
      this.getEmbeddings(label, this.documentPrefix),
    );
  }

  private getEmbeddings(text: string, prefix = "") {
    const output = this.lib.get_embeddings({
      sentences: [`${prefix}${text}`],
      normalize_embeddings: true,
    });
    return output.data[0];
  }
}
