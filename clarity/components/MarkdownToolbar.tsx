import React from 'react';
import BoldIcon from './icons/BoldIcon';
import ItalicIcon from './icons/ItalicIcon';
import HeadingIcon from './icons/HeadingIcon';
import QuoteIcon from './icons/QuoteIcon';
import ListOrderedIcon from './icons/ListOrderedIcon';
import ListUnorderedIcon from './icons/ListUnorderedIcon';
import { useI18n } from '../contexts/I18nContext';
import { Editor } from '@tiptap/react';

interface MarkdownToolbarProps {
  editor: any;
}

const ToolbarButton: React.FC<{ title: string; onClick: () => void; isActive?: boolean; disabled?: boolean; children: React.ReactNode }> = ({ title, onClick, isActive, disabled = false, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
      isActive
        ? 'bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container'
        : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-highest dark:hover:bg-dark-surface-container-highest'
    }`}
  >
    {children}
  </button>
);

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ editor }) => {
  const { t } = useI18n();

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-light-surface-container-high dark:bg-dark-surface-container-high p-2 flex items-center gap-1 border-b border-light-outline-variant dark:border-dark-outline-variant">
      <ToolbarButton title={t.markdownToolbar.heading} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
        <HeadingIcon className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton title={t.markdownToolbar.bold} onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
        <BoldIcon className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton title={t.markdownToolbar.italic} onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
        <ItalicIcon className="h-5 w-5" />
      </ToolbarButton>
      <div className="w-[1px] h-6 bg-light-outline-variant dark:bg-dark-outline-variant mx-2" />
      <ToolbarButton title={t.markdownToolbar.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
        <QuoteIcon className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton title={t.markdownToolbar.listUnordered} onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
        <ListUnorderedIcon className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton title={t.markdownToolbar.listOrdered} onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
        <ListOrderedIcon className="h-5 w-5" />
      </ToolbarButton>
    </div>
  );
};

export default MarkdownToolbar;