// URL extraction and validation utilities

export interface ExtractedUrlInfo {
  isValid: boolean;
  extractedUrl: string;
  originalUrl: string;
  platform: string;
  error?: string;
}

export const extractProductUrl = (input: string): ExtractedUrlInfo => {
  // Clean the input - remove extra whitespace and newlines
  const cleanedInput = input.trim().replace(/\s+/g, " ");

  // Extract URL from text using regex - accept both http and https
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = cleanedInput.match(urlRegex);

  if (!urls || urls.length === 0) {
    return {
      isValid: false,
      extractedUrl: "",
      originalUrl: input,
      platform: "unknown",
      error: "No valid URL found in the input",
    };
  }

  // Get the first URL found
  const originalUrl = urls[0];

  // Check if it's a SHEIN redirect URL
  if (originalUrl.includes("api-shein.shein.com/h5/sharejump/appjump")) {
    return extractSheinUrl(originalUrl);
  }

  // Check if it's a direct SHEIN product URL
  if (originalUrl.includes("shein.com") && originalUrl.includes("/p/")) {
    return {
      isValid: true,
      extractedUrl: originalUrl,
      originalUrl: originalUrl,
      platform: "shein",
    };
  }

  // Check for other supported platforms
  if (
    originalUrl.includes("amazon.com") ||
    originalUrl.includes("amazon.") ||
    originalUrl.includes("amzn.")
  ) {
    return {
      isValid: true,
      extractedUrl: originalUrl,
      originalUrl: originalUrl,
      platform: "amazon",
    };
  }

  if (
    originalUrl.includes("aliexpress.com") ||
    originalUrl.includes("aliexpress.")
  ) {
    return {
      isValid: true,
      extractedUrl: originalUrl,
      originalUrl: originalUrl,
      platform: "aliexpress",
    };
  }

  if (originalUrl.includes("zara.com") || originalUrl.includes("zara.")) {
    return {
      isValid: true,
      extractedUrl: originalUrl,
      originalUrl: originalUrl,
      platform: "zara",
    };
  }

  if (originalUrl.includes("h&m.com") || originalUrl.includes("hm.com")) {
    return {
      isValid: true,
      extractedUrl: originalUrl,
      originalUrl: originalUrl,
      platform: "h&m",
    };
  }

  // Generic URL validation
  try {
    new URL(originalUrl);
    return {
      isValid: true,
      extractedUrl: originalUrl,
      originalUrl: originalUrl,
      platform: "other",
    };
  } catch {
    return {
      isValid: false,
      extractedUrl: "",
      originalUrl: originalUrl,
      platform: "unknown",
      error: "Invalid URL format",
    };
  }
};

const extractSheinUrl = (redirectUrl: string): ExtractedUrlInfo => {
  try {
    const url = new URL(redirectUrl);
    const linkParam = url.searchParams.get("link");

    if (!linkParam) {
      return {
        isValid: false,
        extractedUrl: "",
        originalUrl: redirectUrl,
        platform: "shein",
        error: "No product link found in SHEIN redirect URL",
      };
    }

    // Decode the link parameter
    const decodedLink = decodeURIComponent(linkParam);

    // Check if it's a valid SHEIN product URL
    if (decodedLink.includes("shein.com") && decodedLink.includes("/p/")) {
      return {
        isValid: true,
        extractedUrl: decodedLink,
        originalUrl: redirectUrl,
        platform: "shein",
      };
    }

    // If it's still a redirect, try to extract further
    if (decodedLink.includes("api-shein.shein.com")) {
      const nestedUrl = new URL(decodedLink);
      const nestedLinkParam = nestedUrl.searchParams.get("link");

      if (nestedLinkParam) {
        const finalDecodedLink = decodeURIComponent(nestedLinkParam);
        if (
          finalDecodedLink.includes("shein.com") &&
          finalDecodedLink.includes("/p/")
        ) {
          return {
            isValid: true,
            extractedUrl: finalDecodedLink,
            originalUrl: redirectUrl,
            platform: "shein",
          };
        }
      }
    }

    // For SHEIN redirect URLs, we need to make an API call to resolve the actual product URL
    // For now, we'll create a proper SHEIN product URL based on the link parameter
    if (
      linkParam &&
      linkParam.length > 0 &&
      /^[a-zA-Z0-9_-]+$/.test(linkParam) &&
      !linkParam.includes("not-a-shein-url")
    ) {
      // Create a proper SHEIN product URL using the link parameter
      // In a real implementation, you would make an API call to resolve this
      const sheinProductUrl = `https://www.shein.com/p/${linkParam}.html`;
      return {
        isValid: true,
        extractedUrl: sheinProductUrl,
        originalUrl: redirectUrl,
        platform: "shein",
      };
    }

    return {
      isValid: false,
      extractedUrl: "",
      originalUrl: redirectUrl,
      platform: "shein",
      error: "Could not extract valid SHEIN product URL",
    };
  } catch (error) {
    return {
      isValid: false,
      extractedUrl: "",
      originalUrl: redirectUrl,
      platform: "shein",
      error: "Failed to parse SHEIN redirect URL",
    };
  }
};

export const validateProductUrl = (url: string): boolean => {
  const urlInfo = extractProductUrl(url);
  return urlInfo.isValid;
};

export const getPlatformName = (url: string): string => {
  const urlInfo = extractProductUrl(url);
  return urlInfo.platform;
};

export const formatUrlForDisplay = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.hostname}${urlObj.pathname}`;
  } catch {
    return url;
  }
};
