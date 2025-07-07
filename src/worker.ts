// klassify.worker.js
let klassifyInstance: any;
export interface Message {
  action: "init" | "classify";
  payload: {
    config?: object;
    settings?: any;
    text?: string;
    modelId?: string;
    id?: any;
  };
}

self.onmessage = async (e: { data: Message }) => {
  const Klassify = (
    await import(new URL("./klassify.js", import.meta.url).toString())
  ).default;

  const { action, payload } = e.data;
  switch (action) {
    case "init":
      klassifyInstance = new Klassify(payload?.config as object, {
        ...payload?.settings,
        onLoad() {
          self.postMessage({ status: klassifyInstance.status });
        },
      });
      self.postMessage({ status: klassifyInstance.status });
      break;

    case "classify":
      if (!klassifyInstance) {
        self.postMessage({ error: "Klassify not initialized" });
        return;
      }
      self.postMessage({ status: "WORKING" });
      const { text, modelId, id } = payload;
      const result = await klassifyInstance.classify(text, modelId, id);
      self.postMessage({ result });
      self.postMessage({ status: klassifyInstance.status });
      break;

    default:
      self.postMessage({ error: "Unknown action" });
  }
};
