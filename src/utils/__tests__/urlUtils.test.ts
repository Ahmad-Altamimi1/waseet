import {
  extractProductUrl,
  validateProductUrl,
  getPlatformName,
  formatUrlForDisplay,
  ExtractedUrlInfo,
} from "../urlUtils";

describe("urlUtils", () => {
  describe("extractProductUrl", () => {
    it("should extract SHEIN redirect URLs correctly", () => {
      const input = `SHEIN Tween Girls Casual Solid Color Ruched Waist Hem Short Sleeve T-Shirt Top, Versatile, Spring/Summer
I discovered amazing products on SHEIN.com, come check them out!
http://api-shein.shein.com/h5/sharejump/appjump?link=l4EWUh4InsA_8_1&localcountry=JO`;

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("shein");
      expect(result.originalUrl).toBe(
        "http://api-shein.shein.com/h5/sharejump/appjump?link=l4EWUh4InsA_8_1&localcountry=JO"
      );
      expect(result.extractedUrl).toContain("shein.com");
      expect(result.extractedUrl).toContain("/p/");
      expect(result.extractedUrl).toBe(
        "https://www.shein.com/p/l4EWUh4InsA_8_1.html"
      );
    });

    it("should handle direct SHEIN product URLs", () => {
      const input =
        "https://www.shein.com/p/tween-girls-casual-solid-color-ruched-waist-hem-short-sleeve-t-shirt-top-123456.html";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("shein");
      expect(result.extractedUrl).toBe(input);
      expect(result.originalUrl).toBe(input);
    });

    it("should handle Amazon URLs", () => {
      const input = "https://www.amazon.com/dp/B08N5WRWNW";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("amazon");
      expect(result.extractedUrl).toBe(input);
    });

    it("should handle AliExpress URLs", () => {
      const input = "https://www.aliexpress.com/item/1234567890.html";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("aliexpress");
      expect(result.extractedUrl).toBe(input);
    });

    it("should handle Zara URLs", () => {
      const input = "https://www.zara.com/us/en/product/123456.html";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("zara");
      expect(result.extractedUrl).toBe(input);
    });

    it("should handle H&M URLs", () => {
      const input = "https://www2.hm.com/en_us/productpage.123456.html";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("h&m");
      expect(result.extractedUrl).toBe(input);
    });

    it("should handle generic URLs", () => {
      const input = "https://www.example.com/product/123";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("other");
      expect(result.extractedUrl).toBe(input);
    });

    it("should return error for invalid URLs", () => {
      const input = "not-a-valid-url";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(false);
      expect(result.platform).toBe("unknown");
      expect(result.error).toBe("No valid URL found in the input");
    });

    it("should return error for malformed SHEIN redirect URLs", () => {
      const input =
        "http://api-shein.shein.com/h5/sharejump/appjump?invalid=param";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(false);
      expect(result.platform).toBe("shein");
      expect(result.error).toBe("No product link found in SHEIN redirect URL");
    });

    it("should handle nested SHEIN redirects", () => {
      const input =
        "http://api-shein.shein.com/h5/sharejump/appjump?link=http%3A%2F%2Fapi-shein.shein.com%2Fh5%2Fsharejump%2Fappjump%3Flink%3Dhttps%253A%252F%252Fwww.shein.com%252Fp%252Ftest-product-123.html";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("shein");
      expect(result.extractedUrl).toContain("shein.com");
      expect(result.extractedUrl).toContain("/p/");
    });

    it("should extract first URL from multiple URLs", () => {
      const input =
        "Check this: https://www.shein.com/p/first-product.html and also https://www.amazon.com/dp/second-product";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("shein");
      expect(result.extractedUrl).toBe(
        "https://www.shein.com/p/first-product.html"
      );
    });

    it("should handle URLs with extra whitespace and newlines", () => {
      const input = `   https://www.shein.com/p/test-product.html   
      
      `;

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("shein");
      expect(result.extractedUrl).toBe(
        "https://www.shein.com/p/test-product.html"
      );
    });

    it("should handle empty input", () => {
      const input = "";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(false);
      expect(result.platform).toBe("unknown");
      expect(result.error).toBe("No valid URL found in the input");
    });

    it("should handle text without URLs", () => {
      const input = "This is just some text without any URLs";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(false);
      expect(result.platform).toBe("unknown");
      expect(result.error).toBe("No valid URL found in the input");
    });
  });

  describe("validateProductUrl", () => {
    it("should return true for valid URLs", () => {
      expect(validateProductUrl("https://www.shein.com/p/test.html")).toBe(
        true
      );
      expect(validateProductUrl("https://www.amazon.com/dp/test")).toBe(true);
      expect(validateProductUrl("https://www.example.com/product")).toBe(true);
    });

    it("should return false for invalid URLs", () => {
      expect(validateProductUrl("not-a-url")).toBe(false);
      expect(validateProductUrl("")).toBe(false);
      expect(validateProductUrl("ftp://invalid-protocol.com")).toBe(false);
    });
  });

  describe("getPlatformName", () => {
    it("should return correct platform names", () => {
      expect(getPlatformName("https://www.shein.com/p/test.html")).toBe(
        "shein"
      );
      expect(getPlatformName("https://www.amazon.com/dp/test")).toBe("amazon");
      expect(getPlatformName("https://www.aliexpress.com/item/test.html")).toBe(
        "aliexpress"
      );
      expect(getPlatformName("https://www.zara.com/product/test.html")).toBe(
        "zara"
      );
      expect(getPlatformName("https://www2.hm.com/product/test.html")).toBe(
        "h&m"
      );
      expect(getPlatformName("https://www.example.com/product")).toBe("other");
    });

    it("should return unknown for invalid URLs", () => {
      expect(getPlatformName("not-a-url")).toBe("unknown");
      expect(getPlatformName("")).toBe("unknown");
    });
  });

  describe("formatUrlForDisplay", () => {
    it("should format URLs correctly", () => {
      expect(
        formatUrlForDisplay(
          "https://www.shein.com/p/test-product.html?color=red&size=m"
        )
      ).toBe("www.shein.com/p/test-product.html");
      expect(
        formatUrlForDisplay("https://www.amazon.com/dp/B08N5WRWNW?ref=sr_1_1")
      ).toBe("www.amazon.com/dp/B08N5WRWNW");
    });

    it("should return original string for invalid URLs", () => {
      expect(formatUrlForDisplay("not-a-url")).toBe("not-a-url");
      expect(formatUrlForDisplay("")).toBe("");
    });
  });

  describe("SHEIN redirect URL edge cases", () => {
    it("should handle SHEIN redirect with encoded URL", () => {
      const input =
        "http://api-shein.shein.com/h5/sharejump/appjump?link=https%3A%2F%2Fwww.shein.com%2Fp%2Ftest-product-123.html";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("shein");
      expect(result.extractedUrl).toBe(
        "https://www.shein.com/p/test-product-123.html"
      );
    });

    it("should handle SHEIN redirect with query parameters", () => {
      const input =
        "http://api-shein.shein.com/h5/sharejump/appjump?link=https%3A%2F%2Fwww.shein.com%2Fp%2Ftest-product-123.html%3Fcolor%3Dred%26size%3Dm&localcountry=JO";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("shein");
      expect(result.extractedUrl).toContain(
        "https://www.shein.com/p/test-product-123.html"
      );
    });

    it("should handle malformed SHEIN redirect URLs", () => {
      const input = "http://api-shein.shein.com/h5/sharejump/appjump";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(false);
      expect(result.platform).toBe("shein");
      expect(result.error).toBe("No product link found in SHEIN redirect URL");
    });

    it("should handle SHEIN redirect with invalid link parameter", () => {
      const input =
        "http://api-shein.shein.com/h5/sharejump/appjump?link=not-a-shein-url";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(false);
      expect(result.platform).toBe("shein");
      expect(result.error).toBe("Could not extract valid SHEIN product URL");
    });
  });

  describe("URL regex edge cases", () => {
    it("should handle URLs with special characters", () => {
      const input =
        "https://www.shein.com/p/test-product-123.html?color=red&size=m&ref=search";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("shein");
      expect(result.extractedUrl).toBe(input);
    });

    it("should handle URLs with fragments", () => {
      const input = "https://www.shein.com/p/test-product-123.html#reviews";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("shein");
      expect(result.extractedUrl).toBe(input);
    });

    it("should handle URLs with ports", () => {
      const input = "https://www.shein.com:8080/p/test-product-123.html";

      const result = extractProductUrl(input);

      expect(result.isValid).toBe(true);
      expect(result.platform).toBe("shein");
      expect(result.extractedUrl).toBe(input);
    });
  });
});
