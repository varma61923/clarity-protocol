

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Draft, PublishRequest, SiweSession } from '../types';
import Spinner from './Spinner';
import { useI18n } from '../contexts/I18nContext';
import UploadIcon from './icons/UploadIcon';
import MarkdownToolbar from './MarkdownToolbar';
import ShieldIcon from './icons/ShieldIcon';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { apiClient } from '../services/apiClient';


interface PublishViewProps {
  onPublish: (publishRequest: PublishRequest) => void;
  onSaveDraft: (draft: Omit<Draft, 'authorAddress' | 'lastSaved'>) => void;
  draftToEdit: Draft | null;
  session: SiweSession | null;
  onConnectWallet: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const RichTextEditor: React.FC<{ editor: Editor | null }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-light-outline dark:border-dark-outline rounded-lg overflow-hidden bg-light-surface-container dark:bg-dark-surface-container">
      <MarkdownToolbar editor={editor} />
      <EditorContent editor={editor} className="text-light-on-surface dark:text-dark-on-surface" />
    </div>
  );
}


const PublishView: React.FC<PublishViewProps> = ({ onPublish, onSaveDraft, draftToEdit, session, onConnectWallet, showToast }) => {
  const { t } = useI18n();
  const [id, setId] = useState(draftToEdit?.id || `draft-${Date.now()}`);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('Technology');
  const [language, setLanguage] = useState('en');

  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [applyWatermark, setApplyWatermark] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-base lg:prose-lg focus:outline-none w-full max-w-full',
      },
    },
  });

  useEffect(() => {
    if (draftToEdit && editor) {
        setId(draftToEdit.id);
        setTitle(draftToEdit.title);
        editor.commands.setContent(draftToEdit.content);
        setTags(draftToEdit.tags.join(', '));
        setCategory(draftToEdit.category);
        setLanguage(draftToEdit.language);
    } else if (!draftToEdit && editor) {
        // Reset fields for new draft
        setTitle('');
        editor.commands.clearContent();
        setTags('');
        setCategory('Technology');
        setLanguage('en');
    }
  }, [draftToEdit, editor]);

  const handleManualSave = () => {
      if (!session || !editor) return;
      const draftData = { id, title, content: editor.getHTML(), tags: tags.split(',').map(t => t.trim()).filter(Boolean), category, language };
      onSaveDraft(draftData);
  }
  
  const handleConfirmPublish = async () => {
    if (!editor || !title.trim() || editor.isEmpty) {
      showToast(t.errorTitleOrContentEmpty, 'error');
      return;
    }
    if (session) {
      setIsPublishing(true);
      const publishRequest: PublishRequest = {
        authorAddress: session.address,
        title,
        content: editor.getHTML(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        category,
        language,
        applyWatermark,
        fromDraftId: draftToEdit?.id,
      };
      await onPublish(publishRequest);
      setIsPublishing(false);
    }
  };

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-light-surface-container dark:bg-dark-surface-container p-8 rounded-2xl shadow-lg border border-light-outline-variant dark:border-dark-outline-variant">
          <h1 className="text-headline-sm text-light-on-surface dark:text-dark-on-surface mb-4">{t.connectToPublishTitle}</h1>
          <p className="text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-6">{t.connectToPublishDesc}</p>
          <button onClick={onConnectWallet} className="bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-bold py-3 px-6 rounded-full text-label-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            {t.connectWallet}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-light-surface-container dark:bg-dark-surface-container p-4 sm:p-8 rounded-2xl border border-light-outline-variant dark:border-dark-outline-variant">
        <div className="mb-8">
            <h1 className="text-headline-md font-semibold text-light-on-surface dark:text-dark-on-surface mb-2">{draftToEdit ? t.editArticle : t.publishTitle}</h1>
            <p className="text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">{t.publishDesc}</p>
        </div>
        
        <div className="space-y-6 mb-6">
            <div>
              <label htmlFor="title" className="block text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">{t.articleTitle}</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.titlePlaceholder} className="w-full h-12 px-4 bg-light-surface-container-high dark:bg-dark-surface-container-high border border-light-outline dark:border-dark-outline text-body-lg rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors"/>
            </div>
             <div>
              <label htmlFor="tags" className="block text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">{t.tags}</label>
              <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t.tagsPlaceholder} className="w-full h-12 px-4 bg-light-surface-container-high dark:bg-dark-surface-container-high border border-light-outline dark:border-dark-outline text-body-lg rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label htmlFor="category" className="block text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">{t.category}</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-12 px-4 bg-light-surface-container-high dark:bg-dark-surface-container-high border border-light-outline dark:border-dark-outline text-body-lg rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors appearance-none">
                  {apiClient.getConfig().categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="language" className="block text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">{t.language}</label>
              <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full h-12 px-4 bg-light-surface-container-high dark:bg-dark-surface-container-high border border-light-outline dark:border-dark-outline text-body-lg rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors appearance-none">
                  {apiClient.getConfig().supportedLanguages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
           <label className="block text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-2">{t.contentMarkdown}</label>
           <RichTextEditor editor={editor} />
        </div>

        <div className="flex items-center gap-3 bg-light-surface-container-high dark:bg-dark-surface-container-high p-3 rounded-lg my-4">
            <input 
                id="watermark" 
                type="checkbox" 
                checked={applyWatermark}
                onChange={(e) => setApplyWatermark(e.target.checked)}
                className="h-4 w-4 rounded border-light-outline-variant dark:border-dark-outline-variant text-light-primary dark:text-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary"
            />
            <label htmlFor="watermark" className="text-label-lg font-medium text-light-on-surface dark:text-dark-on-surface flex items-center gap-2">
                <ShieldIcon className="h-5 w-5 text-light-primary dark:text-dark-primary"/>
                {t.applyZkWatermark}
            </label>
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8">
            <div className={`text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant transition-opacity duration-300 ${autoSaveStatus !== 'idle' ? 'opacity-100' : 'opacity-0'}`}>
                {autoSaveStatus === 'saving' && t.autosaving}
                {autoSaveStatus === 'saved' && t.draftSaved}
            </div>
            <button type="button" onClick={handleManualSave} className="w-full sm:w-auto h-10 px-6 rounded-full border border-light-outline dark:border-dark-outline text-label-lg font-semibold text-light-primary dark:text-dark-primary hover:bg-light-primary/5 dark:hover:bg-dark-primary/5">
                {t.saveDraft}
            </button>
          <button type="button" onClick={handleConfirmPublish} disabled={!title.trim() || !editor || editor.isEmpty || isPublishing} className="w-full sm:w-auto h-10 px-6 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary text-label-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg">
            {isPublishing ? <><Spinner /> {t.publishingToChain}</> : <>{t.previewAndPublish}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishView;