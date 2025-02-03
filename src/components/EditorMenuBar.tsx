import {
  ArrowUpTrayIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Bars3Icon,
  BoldIcon,
  ChatBubbleBottomCenterIcon,
  CodeBracketIcon,
  DocumentCheckIcon,
  DocumentPlusIcon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
  PhotoIcon,
  StrikethroughIcon,
  UnderlineIcon
} from '@heroicons/react/24/outline';
import { Editor } from '@tiptap/react';
import React, {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { EditorContext } from '../contexts/EditorContext';
import FixedMenuBar from './FixedMenuBar';
import { serverUrl } from '../utils/editorSetup';
import PaintBrushDropdown from './PaintBrushDropdown';
import { createDocument, uploadImage } from '../utils/serverRequests';
import TextHeadingDropdown from './TextHeadingDropdown';
import DownloadDropdown from './DownloadDropdown';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { LocalDocumentUser } from '../utils/localstorage';
import { getAwarenessColor } from '../utils/userColors';
import { setEditorContentFromFile } from '../utils/editorExport';
import TableDropdown from './TableDropdown';

const handleImageUpload = async (
  editor: Editor,
  documentId: string,
  modificationSecret: string,
  file: File
) => {
  const imageUrl = await uploadImage(file, documentId, modificationSecret);
  if (imageUrl) {
    editor
      .chain()
      .focus()
      .setImage({ src: `${serverUrl()}/${imageUrl}` })
      .run();
  }
};

export const renderCommentButtons = (
  editor: Editor,
  currentUser: LocalDocumentUser | null,
  setMobileCommentMenuOpen: (state: boolean) => void,
  t: TFunction,
  options?: {
    className?: string;
  }
): ReactElement[] => {
  return [
    <button
      title={t('menuBar.buttons.comment')}
      key="btn-comment"
      onClick={(event) => {
        if (!currentUser) {
          return;
        }
        setMobileCommentMenuOpen(true);
        // Needed to prevent the new comment from being directly removed when clicking on the menu bar
        event.stopPropagation();
        if (editor.isActive('comment')) {
          editor.chain().focus().unsetComment().run();
        } else {
          const colorAwarenessInfo = getAwarenessColor(currentUser.colorId);
          editor?.commands.setComment({
            colorClass: colorAwarenessInfo?.bgClass,
            user: {
              id: currentUser.userId,
              username: currentUser.name
            }
          });
        }
      }}
      disabled={editor.state.selection?.empty}
      className={[
        editor.isActive('comment') ? 'is-active' : '',
        'btn-editor',
        options?.className ?? ''
      ].join(' ')}
    >
      <ChatBubbleBottomCenterIcon className="size-4" />
    </button>,
    <button
      title={t('menuBar.buttons.suggestion')}
      key="btn-suggestion"
      onClick={(event) => {
        if (!currentUser) {
          return;
        }
        setMobileCommentMenuOpen(true);
        // Needed to prevent the new comment from being directly removed when clicking on the menu bar
        event.stopPropagation();
        if (editor.isActive('comment')) {
          editor.chain().focus().unsetComment().run();
        } else {
          const colorAwarenessInfo = getAwarenessColor(currentUser.colorId);
          editor?.commands.setComment({
            commentType: 'suggestion',
            colorClass: colorAwarenessInfo?.bgClass,
            user: {
              id: currentUser.userId,
              username: currentUser.name
            }
          });
        }
      }}
      disabled={editor.state.selection?.empty}
      className={[
        editor.isActive('comment') ? 'is-active' : '',
        'btn-editor',
        options?.className ?? ''
      ].join(' ')}
    >
      <DocumentCheckIcon className="size-4" />
    </button>
  ];
};

export default function MenuBar({
  editor,
  documentId,
  modificationSecret,
  currentUser,
  children,
  setMobileCommentMenuOpen
}: {
  editor: Editor;
  documentId: string;
  modificationSecret: string;
  currentUser: LocalDocumentUser | null;
  children: ReactNode;
  setMobileCommentMenuOpen: (state: boolean) => void;
}) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { readOnly } = useContext(EditorContext);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleClick = () => {
      setMobileMenuOpen(false);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [editor, documentId, modificationSecret]);

  if (!editor) {
    return null;
  }

  if (readOnly) {
    return <FixedMenuBar>{children}</FixedMenuBar>;
  } else {
    return (
      <>
        <FixedMenuBar>
          <div className="flex items-center ms-2 lg:hidden">
            <button
              title={t('menuBar.buttons.mobileMenu')}
              onClick={(event) => {
                event.stopPropagation();
                toggleMobileMenu();
              }}
              className="btn-editor"
            >
              <Bars3Icon className="size-4"></Bars3Icon>
            </button>
          </div>
          <div
            className={`absolute ${mobileMenuOpen ? 'block' : 'hidden'} lg:flex lg:static overflow-y-auto max-h-screen top-0`}
          >
            <ul className="flex flex-col lg:flex-row justify-center bg-white border lg:border-0 rounded-sm list-none border-gray-200">
              <li key="btn-new" className="lg:inline-block">
                <button
                  title={t('menuBar.buttons.new')}
                  onClick={() => {
                    void (async () => {
                      const link = await createDocument();
                      if (link) window.open(link, '_blank');
                    })();
                  }}
                  className={['btn-editor'].join(' ')}
                >
                  <DocumentPlusIcon className="size-4" />
                </button>
              </li>
              <li key="btn-bold" className="lg:inline-block">
                <button
                  title={t('menuBar.buttons.bold')}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                  className={[
                    editor.isActive('bold') ? 'is-active' : '',
                    'btn-editor'
                  ].join(' ')}
                >
                  <BoldIcon className="size-4" />
                </button>
              </li>
              <li key="btn-italic" className="lg:inline-block">
                <button
                  title={t('menuBar.buttons.italic')}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
                  className={[
                    editor.isActive('italic') ? 'is-active' : '',
                    'btn-editor'
                  ].join(' ')}
                >
                  <ItalicIcon className="size-4" />
                </button>
              </li>
              <li key="btn-underline" className="lg:inline-block">
                <button
                  title={t('menuBar.buttons.underline')}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  disabled={
                    !editor.can().chain().focus().toggleUnderline().run()
                  }
                  className={[
                    editor.isActive('underline') ? 'is-active' : '',
                    'btn-editor'
                  ].join(' ')}
                >
                  <UnderlineIcon className="size-4" />
                </button>
              </li>
              <li key="btn-strike" className="lg:inline-block">
                <button
                  title={t('menuBar.buttons.strike')}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  disabled={!editor.can().chain().focus().toggleStrike().run()}
                  className={[
                    editor.isActive('strike') ? 'is-active' : '',
                    'btn-editor'
                  ].join(' ')}
                >
                  <StrikethroughIcon className="size-4" />
                </button>
              </li>
              <li key="btn-heading-picker" className="lg:inline-block">
                <TextHeadingDropdown editor={editor} />
              </li>
              <li key="btn-bullet-list" className="lg:inline-block">
                <button
                  title={t('menuBar.buttons.bulletList')}
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={[
                    editor.isActive('bulletList') ? 'is-active' : '',
                    'btn-editor'
                  ].join(' ')}
                >
                  <ListBulletIcon className="size-4" />
                </button>
              </li>
              <li key="btn-ordered-list" className="lg:inline-block">
                <button
                  title={t('menuBar.buttons.orderedList')}
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className={[
                    editor.isActive('orderedList') ? 'is-active' : '',
                    'btn-editor'
                  ].join(' ')}
                >
                  <NumberedListIcon className="size-4" />
                </button>
              </li>
              <li key="btn-table" className="lg:inline-block">
                <TableDropdown editor={editor} />
              </li>
              <li key="btn-link" className="lg:inline-block">
                <button
                  title={t('menuBar.buttons.link.title')}
                  onClick={() => {
                    if (editor.isActive('link')) {
                      editor.chain().focus().unsetLink().run();
                    } else {
                      const link = prompt(t('menuBar.buttons.link.prompt'));
                      if (link?.startsWith('http')) {
                        editor.chain().focus().setLink({ href: link }).run();
                      }
                    }
                  }}
                  className={[
                    editor.isActive('link') ? 'is-active' : '',
                    'btn-editor'
                  ].join(' ')}
                >
                  <LinkIcon className="size-4" />
                </button>
              </li>
              <li key="btn-color-picker" className="lg:inline-block">
                <PaintBrushDropdown editor={editor} />
              </li>
              <li key="btn-undo" className="lg:inline-block">
                <button
                  title={t('menuBar.buttons.undo')}
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().chain().focus().undo().run()}
                  className={['btn-editor'].join(' ')}
                >
                  <ArrowUturnLeftIcon className="size-4" />
                </button>
              </li>
              <li key="btn-redo" className="lg:inline-block">
                <button
                  title={t('menuBar.buttons.redo')}
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().chain().focus().redo().run()}
                  className={['btn-editor'].join(' ')}
                >
                  <ArrowUturnRightIcon className="size-4" />
                </button>
              </li>
              <li key="btn-quote" className="lg:inline-block">
                <button
                  title={t('menuBar.buttons.quote')}
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  disabled={
                    !editor.can().chain().focus().toggleBlockquote().run()
                  }
                  className={[
                    editor.isActive('blockquote') ? 'is-active' : '',
                    'btn-editor'
                  ].join(' ')}
                >
                  <span className="block leading-none w-4">"</span>
                </button>
              </li>
              <li key="btn-code" className="lg:inline-block">
                <button
                  title={t('menuBar.buttons.code')}
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  disabled={!editor.can().chain().focus().toggleCode().run()}
                  className={[
                    editor.isActive('code') ? 'is-active' : '',
                    'btn-editor'
                  ].join(' ')}
                >
                  <CodeBracketIcon className="size-4" />
                </button>
              </li>
              {renderCommentButtons(
                editor,
                currentUser,
                setMobileCommentMenuOpen,
                t
              ).map((e) => (
                <li key={`li-${e.key}`} className="lg:inline-block">
                  {e}
                </li>
              ))}
              <li key="btn-image-upload" className="lg:inline-block">
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  id="file-input-upload"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files?.[0]) {
                      void handleImageUpload(
                        editor,
                        documentId,
                        modificationSecret,
                        e.target.files?.[0]
                      );
                    }
                    e.target.value = '';
                  }}
                  disabled={false}
                  className="hidden"
                />
                <label
                  title={t('menuBar.buttons.imageUpload')}
                  htmlFor="file-input-upload"
                  className="block btn-editor cursor-pointer p-2 content-start"
                >
                  <PhotoIcon className="size-4" />
                </label>
              </li>
              <li key="btn-export" className="lg:inline-block">
                <DownloadDropdown editor={editor} />
              </li>
              <li key="btn-import" className="lg:inline-block">
                <input
                  type="file"
                  accept=".html"
                  id="file-input"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    void setEditorContentFromFile(editor, e.target.files?.[0]);
                  }}
                  disabled={false}
                  className="hidden"
                />
                <label
                  title={t('menuBar.buttons.import')}
                  htmlFor="file-input"
                  className="block btn-editor cursor-pointer p-2 content-start"
                >
                  <ArrowUpTrayIcon className="size-4" />
                </label>
              </li>
            </ul>
          </div>
          {children}
        </FixedMenuBar>
      </>
    );
  }
}
