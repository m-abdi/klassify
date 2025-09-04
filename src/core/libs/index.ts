import Result from "../entities/result";

export type ModelConfig = {
  url: string;
  labels?: string[];
  searchPrefix?: string;
  documentPrefix?: string;
};

export default abstract class Model {
  status: "READY" | "INITIALIZED";
  readonly url: string;

  constructor(config: ModelConfig) {
    this.status = "INITIALIZED";
    this.url = config.url;
  }
  async load() {
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
    return [];
  }
}
