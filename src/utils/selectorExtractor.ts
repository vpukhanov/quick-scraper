import { isUrlString } from "is-url-online";
import URL from "url";
import type { AttributeOutputs } from "../types/QuickScraperType";

type SelectorExtractor = {
  attrs?: Record<string, true>;
  data: cheerio.Cheerio;
  href?: boolean;
  text?: boolean;
  url?: string;
};

export const selectorExtractor = ({
  attrs,
  data,
  href,
  text,
  url,
}: SelectorExtractor): AttributeOutputs => {
  const $ = data;
  if (!$) {
    throw new Error("e");
  }

  const output: AttributeOutputs = {};
  if (text) {
    output.text = data.text();
  }

  if (href) {
    let href = data.prop("href");

    const urlString = isUrlString(href);
    if (!urlString) {
      const { href: absoluteUrl } = new URL.URL(href, url);

      href = absoluteUrl;
    }

    output.href = href;
  }

  if (attrs) {
    const keys = Object.keys(attrs);
    const customAttributes: Record<string, string> = {};
    keys.forEach((key) => {
      const attribute = data.attr(key);
      if (key && attribute) {
        customAttributes[key] = attribute;
      }
    });
    if (Object.keys(customAttributes).length > 0) {
      output.customAttributes = customAttributes;
    }
  }

  if (!text) {
    delete output.text;
  }

  return output;
};
