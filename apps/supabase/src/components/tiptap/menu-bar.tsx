

import React, { Fragment } from 'react'
import MenuItem from './menu-items'

import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  CodeIcon,
  PenLineIcon,
  Heading1Icon,
  Heading2Icon,
  PilcrowIcon,
  ListCollapseIcon,
  ListChecksIcon,
  BoxIcon,
  MessageSquareCodeIcon,
  MinusIcon,
  WrapTextIcon,
  RemoveFormattingIcon,
  UndoIcon,
  RedoIcon
} from 'lucide-react'

const styles = {
  editorHeader: {
    display: 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center',
    gap: '4px',
  },
}

export default ({ editor }: { editor: any }) => {
  const items = [
    {
      icon: BoldIcon,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      icon: ItalicIcon,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      icon: StrikethroughIcon,
      title: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
    },
    {
      icon: CodeIcon,
      title: 'Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
    },
    {
      icon: PenLineIcon,
      title: 'Highlight',
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive('highlight'),
    },
    {
      icon: Heading1Icon,
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
    },
    {
      icon: Heading2Icon,
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    {
      icon: PilcrowIcon,
      title: 'Paragraph',
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive('paragraph'),
    },
    {
      icon: ListCollapseIcon,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      icon: ListCollapseIcon,
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      icon: ListChecksIcon,
      title: 'Task List',
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive('taskList'),
    },
    {
      icon: BoxIcon,
      title: 'Code Block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock'),
    },
    {
      icon: MessageSquareCodeIcon,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
    {
      icon: MinusIcon,
      title: 'Horizontal Rule',
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },

    {
      icon: WrapTextIcon,
      title: 'Hard Break',
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      icon: RemoveFormattingIcon,
      title: 'Clear Format',
      action: () => editor.chain().focus().clearNodes().unsetAllMarks()
        .run(),
    },
    {
      icon: UndoIcon,
      title: 'Undo',
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: RedoIcon,
      title: 'Redo',
      action: () => editor.chain().focus().redo().run(),
    },
  ]

  return (
    <div style={styles.editorHeader}>
      {items.map((item, index) => (
        <Fragment key={index}>
          {<MenuItem {...item} />}
        </Fragment>
      ))}
    </div>
  )
}