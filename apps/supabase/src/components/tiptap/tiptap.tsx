"use client";

import { useEditor, EditorContent, Editor, EditorOptions } from "@tiptap/react";

import "@/components/tiptap/Tiptap.css";
import { memo, useEffect } from "react";
import { CustomLink, tiptapExtensions } from "./tiptap-config";
import FileHandler from "@tiptap-pro/extension-file-handler";
import { EditorProps, EditorView } from "@tiptap/pm/view";
import { useContentTiptap } from "./providers/content-provider";
import { useCountCharacters } from "./providers/count-character-provider";

type TiptapProps = {
  handleValidateImageFiles: (files: File[]) => void;
};

const Tiptap = memo((props: TiptapProps) => {
  // props passed from "ContentForm"
  const { handleValidateImageFiles } = props;
  const { content, setContent } = useContentTiptap();
  const { countCharacters, setCountCharacters } = useCountCharacters();

  /**
   * Handle image file for tiptap when copy and paste
   */
  function fileHandlerForTiptap() {
    return FileHandler.configure({
      onDrop: (currentEditor, files, pos) => {
        handleValidateImageFiles(files);
      },

      onPaste: (currentEditor, files, htmlContent) => {
        if (htmlContent) {
          htmlContent = "";
          return false;
        }
        handleValidateImageFiles(files);
      },
    });
  }

  /**
   * tiptap config
   */
  let tiptapConfig: Partial<EditorOptions> = {
    // @ts-ignore
    extensions: [...tiptapExtensions, fileHandlerForTiptap()],
    autofocus: true,
    content: content,
  };

  /**
   * editor props
   */
  const tiptapProps: EditorProps<Editor> = {
    handleDOMEvents: {
      keydown(this, view, event) {
        // check ctrl + V
        // check delete content in editor
        // check countCharacters > 300
        const isOk =
          countCharacters >= 300 &&
          event.code != "KeyV" &&
          event.code != "Backspace" &&
          !event.ctrlKey;
        if (isOk) {
          event.preventDefault();
        }
      },
    },
  };

  /**
   * Init editor with tiptap
   */
  const editor = useEditor(tiptapConfig);

  // dependencies
  const dependencies = [editor?.storage.characterCount.characters()];

  /**
   * Update countCharacters and content
   */
  useEffect(() => {
    if (editor) {
      editor.commands.focus();
      editor.on("update", () => {
        const href = editor.getAttributes("link").href;
        editor.setOptions({
          extensions: [
            ...tiptapExtensions,
            fileHandlerForTiptap(),
            CustomLink(href),
          ],
          editorProps: tiptapProps,
        });
        setContent(editor.getHTML()); // set content in tiptap
        setCountCharacters(editor.storage.characterCount.characters()); // count
      });
    }
  }, [...dependencies]);

  if (!editor) {
    return null;
  }

  return (
    <EditorContent
      editor={editor}
      className="custom-editor w-full whitespace-pre-wrap break-all"
    />
  );
});

export { Tiptap };
