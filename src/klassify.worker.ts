import { Status } from "./core/backends";

let klassifyInstance: any;
export interface Message {
  action: "init" | "classify";
  payload: {
    config?: object;
    text?: string;
    modelId?: string;
    id?: any;
    labels?: string[];
  };
}

self.onmessage = async (e: { data: Message }) => {
  const Klassify = (await import("./klassify")).default;

  const { action, payload } = e.data;
  switch (action) {
    case "init":
      klassifyInstance = new Klassify({
        ...(payload?.config as any),
        onChangeStatus(newStatus: Status) {
          self.postMessage({ status: newStatus });
        },
      });
      break;

    case "classify":
      if (!klassifyInstance) {
        self.postMessage({ error: "Klassify not initialized" });
        return;
      }
      const { text, modelId, id, labels } = payload;
      const result = await klassifyInstance.classify(text, modelId, id, labels);
      self.postMessage({ result });
      break;

    default:
      self.postMessage({ error: "Unknown action" });
  }
};
