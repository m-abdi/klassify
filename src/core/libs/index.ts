import Result from "../entities/result";

export default abstract class Model {
  status: "READY" | "INITIALIZED";
  readonly url: string;
  constructor(url: string) {
    this.status = "INITIALIZED";
    this.url = url;
  }
  async load() {
    return true;
  }
  async classify(
    text: string,
    {
      limit,
    }: {
      limit: number;
      id?: any;
    },
  ): Promise<Result[]> {
    if (this.status !== "READY") {
      await this.load();
    }
    return [];
  }
}
