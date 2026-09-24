"use client";

import { EditorContent, useEditor } from "@tiptap/react";

import "@/components/tiptap/Tiptap.css";
import { memo } from "react";
import { tiptapExtensions } from "./tiptap-config";

import { useContentTiptap } from "./providers/content-provider";
import { useCountCharacters } from "./providers/count-character-provider";

type TiptapProps = {
  handleValidateImageFiles: (files: File[]) => void;
};

const Tiptap = memo((_props: TiptapProps) => {
  const { content, setContent } = useContentTiptap();
  const { setCountCharacters } = useCountCharacters();

  /**
   * The CharacterCount extension enforces the character limit, so no manual
   * keydown handling is needed. `onUpdate` is registered once by useEditor
   * (no listener leak on re-render).
   */
  const editor = useEditor({
    extensions: tiptapExtensions,
    autofocus: true,
    content,
    // Rendered inside a client-only modal; avoid SSR hydration mismatches.
    immediatelyRender: false,
    onCreate: ({ editor }) => {
      setCountCharacters(editor.storage.characterCount.characters());
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      setCountCharacters(editor.storage.characterCount.characters());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <EditorContent
      editor={editor}
      className="custom-editor w-full whitespace-pre-wrap break-all"
      data-testid="post-editor"
    />
  );
});

Tiptap.displayName = "Tiptap";

export { Tiptap };
