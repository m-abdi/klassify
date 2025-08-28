import Klassify from "./klassify";

describe("Klassify private methods", () => {
  let instance: Klassify;

  beforeEach(() => {
    // minimal config to instantiate
    instance = new Klassify({ preload: false } as any);
  });

  describe("detectLanguage", () => {
    it("should detect English text", () => {
      // @ts-ignore
      const result = instance.detectLanguage("Hello world");
      expect(result).toBe("en");
    });

    it("should detect Persian text", () => {
      // @ts-ignore
      const result = instance.detectLanguage("سلام دنیا");
      expect(result).toBe("fa");
    });

    it("should return undefined for mixed or empty text", () => {
      // @ts-ignore
      expect(instance.detectLanguage("")).toBeUndefined();
      // @ts-ignore
      expect(instance.detectLanguage("1234")).toBeUndefined();
    });
  });

  describe("camelCaseToNormal", () => {
    it("should split camelCase words", () => {
      // @ts-ignore
      const result = instance.camelCaseToNormal("mobileNo");
      expect(result).toBe("mobile No");

      // @ts-ignore
      expect(instance.camelCaseToNormal("CustomerID")).toBe("Customer ID");
      // @ts-ignore
      expect(instance.camelCaseToNormal("prodNameShort")).toBe(
        "prod Name Short",
      );
    });
  });

  describe("normalize", () => {
    it("should replace underscores and convert camelCase to normal", () => {
      // @ts-ignore
      expect(instance.normalize("mobile_No")).toBe("mobile no");
      // @ts-ignore
      expect(instance.normalize("Customer_ID")).toBe("customer id");
      // @ts-ignore
      expect(instance.normalize("orderDate")).toBe("order date");
    });
  });
});
