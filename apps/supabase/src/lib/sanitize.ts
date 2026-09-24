import sanitizeHtml from "sanitize-html";

/** Plain-text limit shared with the TipTap CharacterCount extension. */
export const CONTENT_TEXT_LIMIT = 300;
/** Hard cap on stored HTML (markup + embeds); mirrors the DB check constraint. */
export const CONTENT_HTML_LIMIT = 5000;

const YOUTUBE_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
];

/**
 * Whitelist sanitizer for TipTap-generated post/comment HTML. Removes
 * scripts, event handlers and unknown tags so stored content is safe to
 * render with dangerouslySetInnerHTML.
 */
export function sanitizeContent(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "a", "span", "strong", "em", "s", "code", "div", "iframe", "img"],
    allowedAttributes: {
      a: ["href", "target", "rel", "class"],
      span: ["class", "data-type", "data-id", "data-label"],
      div: ["data-youtube-video", "class"],
      iframe: ["src", "width", "height", "allowfullscreen", "allow", "class", "frameborder"],
      img: ["src", "alt", "class"],
      p: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedIframeHostnames: YOUTUBE_HOSTS,
    allowIframeRelativeUrls: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer nofollow",
        target: "_blank",
      }),
    },
  });
}

/** Visible text length of an HTML fragment (what the editor counts). */
export function textLength(html: string | null | undefined): number {
  if (!html) return 0;
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/g, "_").length;
}

/** Returns an error message if the content is too long, otherwise null. */
export function validateContentLength(html: string): string | null {
  if (textLength(html) > CONTENT_TEXT_LIMIT) {
    return `Content must be at most ${CONTENT_TEXT_LIMIT} characters.`;
  }
  if (html.length > CONTENT_HTML_LIMIT) {
    return "Content is too long.";
  }
  return null;
}
