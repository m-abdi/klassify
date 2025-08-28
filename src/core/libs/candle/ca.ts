import Result from "../../entities/result";
import Model from "../index";
import init, {
  Model as CandleModel,
} from "./candle/candle-wasm-examples/bert/build/m.js";

export default class Candle extends Model {
  private lib: any;
  private labels: string[];
  private embeddings: any;
  private baseURL: string;
  private searchPrefix?: string = "";
  private documentPrefix?: string = "";

  constructor(config: {
    url: string;
    labels: string[];
    searchPrefix?: string;
    documentPrefix?: string;
  }) {
    super(config?.url);
    this.baseURL = config?.url;
    this.labels = config?.labels;
    this.searchPrefix = config?.searchPrefix;
    this.documentPrefix = config?.documentPrefix;
  }

  private async fetchArrayBuffer(url: string) {
    const cacheName = "klassify-ca-cache";
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
      const data = await cachedResponse.arrayBuffer();
      return new Uint8Array(data);
    }
    const res = await fetch(url, { cache: "force-cache" });
    cache.put(url, res.clone());
    return new Uint8Array(await res.arrayBuffer());
  }

  async load() {
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
    this.embeddings = this.labels?.map((label) =>
      this.getEmbeddings(label, this.documentPrefix),
    );
    this.status = "READY";
    return true;
  }

  private cosineSimilarity(vec1: any[], vec2: any[]) {
    const dot = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
    const a = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
    const b = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
    return dot / (a * b);
  }

  private getEmbeddings(text: string, prefix = "") {
    const output = this.lib.get_embeddings({
      sentences: [`${prefix}${text}`],
      normalize_embeddings: true,
    });
    return output.data[0];
  }
  async classify(
    text: string,
    config: { limit: number; id?: any },
  ): Promise<Result[]> {
    await super.classify(text, { limit: config?.limit ?? 1 });
    const queryEmbeddings = this.getEmbeddings(text, this.searchPrefix);

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
        new Result(text, this.labels?.[item?.id], item?.similarity, config?.id),
      );
    });
    return predictionsArray;
  }
}
