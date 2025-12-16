"use client";

// import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
// import MenuBar from "./menu-bar";
import Placeholder from "@tiptap/extension-placeholder";
import Paragraph from "@tiptap/extension-paragraph";
import Mention from "@tiptap/extension-mention";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
// import Heading from "@tiptap/extension-heading"
import CharacterCount from "@tiptap/extension-character-count";
// import Youtube from '@tiptap/extension-youtube'
import Link from "@tiptap/extension-link";
// import FileHandler from "@tiptap-pro/extension-file-handler";

// Limit character
const limit = 300;

/**
 * Make a custom link to add href in textNode of "Link extension"
 *    reference: https://tiptap.dev/docs/editor/guide/custom-extensions#paste-rules
 */
export const CustomLink = (href: string) => {
  return Link.extend({
    addNodeView() {
      return () => {
        const link = document.createElement("a");
        link.innerText = `${href}`;
        return {
          dom: link,
        };
      };
    },
  });
};

// export

export const tiptapExtensions = [
  Document,
  Paragraph,
  CharacterCount.configure({
    limit,
  }),
  Text,
  Mention.configure({
    HTMLAttributes: {
      class: "mention",
    },
    // suggestion,
  }),
  Placeholder.configure({
    placeholder: "Hãy nêu cảm nghĩ của bạn ở đây...",
  }),
  Image.configure({
    inline: true,
    // allowBase64: true,
    HTMLAttributes: {
      // class: 'border-2 border-orange-200 my-4 w-1/2 h-auto mx-auto',
      class: "hidden",
    },
  }),
  // Youtube.configure({
  //   inline: false,
  // }),
  // Link.configure({
  //   openOnClick: true,
  //   // linkOnPaste: true,
  //   autolink: true,
  //   HTMLAttributes: {
  //     class: 'text-blue-500'
  //   }
  // })
];
