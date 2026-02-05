import Result from "../entities/result";

export type Status = "INITIALIZED" | "LOADING" | "READY" | "WORKING";

export type ModelConfig = {
  url: string;
  labels?: string[];
  searchPrefix?: string;
  documentPrefix?: string;
  onChangeStatus?: (newStatus: Status) => any;
};

export default abstract class Model {
  status: Status;
  config: ModelConfig;
  readonly url: string;

  constructor(config: ModelConfig) {
    this.config = config;
    this.status = "INITIALIZED";
    this.url = config.url;
  }

  changeStatus(newStatus: Status) {
    this.status = newStatus;
    this?.config?.onChangeStatus?.(newStatus);
  }

  async load() {
    this.changeStatus("LOADING");
    return true;
  }

  async classify(
    text: string,
    {
      limit,
      id,
      labels,
    }: {
      limit: number;
      id?: any;
      labels?: string[];
    },
  ): Promise<Result[]> {
    if (this.status !== "READY") {
      await this.load();
    }
    this.changeStatus("WORKING");
    return [];
  }

  protected cosineSimilarity(vec1: any[], vec2: any[]) {
    const dot = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
    const a = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
    const b = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
    return dot / (a * b);
  }
}
