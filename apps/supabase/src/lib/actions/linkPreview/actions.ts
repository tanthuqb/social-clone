"use server";

import dns from "node:dns/promises";
import net from "node:net";
import { getLinkPreview } from "link-preview-js";

export type LinkPreviewData = {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
};

/** True for loopback, private, link-local and other non-public addresses. */
function isPrivateAddress(address: string): boolean {
  if (net.isIPv4(address)) {
    const [a, b] = address.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }
  const v6 = address.toLowerCase();
  return (
    v6 === "::1" ||
    v6 === "::" ||
    v6.startsWith("fc") ||
    v6.startsWith("fd") ||
    v6.startsWith("fe80") ||
    v6.startsWith("::ffff:")
  );
}

/**
 * Fetches Open Graph metadata for a link shown in a post. Runs on the server
 * (avoids browser CORS) with SSRF protection: only http(s), public addresses,
 * no redirects, short timeout. Returns null when no preview is available.
 */
export async function getLinkPreviewAction(
  rawUrl: string,
): Promise<LinkPreviewData | null> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  try {
    const preview = await getLinkPreview(url.toString(), {
      timeout: 3000,
      followRedirects: "error",
      headers: { "user-agent": "SuzuLinkPreviewBot/1.0" },
      resolveDNSHost: async (target: string) => {
        const { address } = await dns.lookup(new URL(target).hostname);
        if (isPrivateAddress(address)) {
          throw new Error("Refusing to preview a private address");
        }
        return address;
      },
    });
    if (!("title" in preview)) return null;
    return {
      url: preview.url,
      title: preview.title ?? null,
      description: preview.description ?? null,
      image: preview.images?.[0] ?? null,
      siteName: preview.siteName ?? null,
    };
  } catch {
    return null;
  }
}
