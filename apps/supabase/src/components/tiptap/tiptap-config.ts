"use client";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Youtube from "@tiptap/extension-youtube";
import { CharacterCount, Placeholder } from "@tiptap/extensions";

/** Maximum number of plain-text characters in a post or comment. */
export const CONTENT_CHARACTER_LIMIT = 300;

export const tiptapExtensions = [
  Document,
  Paragraph,
  Text,
  CharacterCount.configure({
    limit: CONTENT_CHARACTER_LIMIT,
  }),
  Mention.configure({
    HTMLAttributes: {
      class: "mention",
    },
  }),
  Placeholder.configure({
    placeholder: "Share your thoughts here...",
  }),
  Image.configure({
    inline: true,
    HTMLAttributes: {
      // Images are uploaded separately (feed_images); hide inline copies.
      class: "hidden",
    },
  }),
  // Pasting a YouTube URL embeds the video in the post.
  Youtube.configure({
    inline: false,
    nocookie: true,
    HTMLAttributes: {
      class: "aspect-video w-full rounded-lg",
    },
  }),
  // Autolink typed/pasted URLs so posts can show link previews.
  Link.configure({
    autolink: true,
    linkOnPaste: true,
    openOnClick: false,
    defaultProtocol: "https",
    HTMLAttributes: {
      class: "text-blue-500 underline",
      rel: "noopener noreferrer nofollow",
      target: "_blank",
    },
  }),
];
