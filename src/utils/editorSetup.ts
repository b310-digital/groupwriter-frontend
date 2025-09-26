import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
import {
  awarenessColors,
  ColorAwarenessInfo,
  getAwarenessColor
} from './userColors';
import CollaborationCommentsExtension, {
  CommentItem,
  MarkWithPos
} from '@packages/tiptap-extension-comment-collaboration';
import { LocalDocumentUser } from './localstorage';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import ImageDeleteCallback from '@packages/tiptap-extension-image-delete-callback';
import { TextStyle } from '@tiptap/extension-text-style';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';
import Placeholder from '@tiptap/extension-placeholder';
import { deleteImage } from './serverRequests';
import ColorWithClasses from '@packages/tiptap-extension-color-with-classes';
import { TFunction } from 'i18next';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';

// Create server url for a host using the subdomain groupwriter.host.tld for the editor.
const createServerUrl = (targetSubdomain: string, postFix?: string): string => {
  const hostArray = window.location.host.split('.');
  const protocol = `${window.location.protocol}//`;
  if (hostArray.length === 1) {
    console.warn('localhost does not work for URL_PART_NAME variables');
  }

  const subdomain = hostArray[0].replace('write', targetSubdomain);

  return `${protocol}${subdomain}.${hostArray
    .slice(1, hostArray.length)
    .join('.')}${postFix ?? ''}`;
};

export const serverUrl = (): string => {
  return import.meta.env.VITE_HOCUSPOCUS_SUBDOMAIN
    ? createServerUrl(import.meta.env.VITE_HOCUSPOCUS_SUBDOMAIN)
    : import.meta.env.VITE_HOCUSPOCUS_SERVER_URL;
};

export const createProvider = (
  documentId: string,
  ydoc: Y.Doc,
  modificationSecret: string
) => {
  return new HocuspocusProvider({
    url: serverUrl(),
    name: documentId,
    document: ydoc,
    token: modificationSecret || 'readOnly'
  });
};

export const createExtensions = (
  ydoc: Y.Doc,
  t: TFunction,
  provider: HocuspocusProvider,
  modificationSecret: string,
  onCommentsPosUpdated: (marks: Record<string, MarkWithPos>) => void,
  onCommentsDataUpdated: (comments: Y.Map<CommentItem> | null) => void,
  onCommentActivated: (commentId: string | null) => void,
  user: LocalDocumentUser | null
) => [
  TextStyle,
  ColorWithClasses.configure({ types: [TextStyle.name] }),
  Placeholder.configure({
    placeholder: t('editor.placeholder')
  }),
  Image,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  ImageDeleteCallback.configure({
    url: serverUrl(),
    deleteCallback: (url: string) => void deleteImage(url, modificationSecret)
  }),
  StarterKit.configure({
    undoRedo: false,
    bulletList: {
      keepMarks: true,
      keepAttributes: true
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: true
    }
  }),
  CollaborationCommentsExtension.configure({
    document: ydoc,
    onCommentsPosUpdated,
    onCommentsDataUpdated,
    onCommentActivated
  }),
  Collaboration.configure({
    document: ydoc
  }),
  CollaborationCaret.configure({
    provider,
    selectionRender: selectionRender,
    render: cursorRender,
    user: { ...user }
  })
];

const selectionRender = (user: LocalDocumentUser) => {
  const colorAwarenessInfo = getAwarenessColor(user.colorId);
  return {
    nodeName: 'span',
    class: `collaboration-cursor__selection ${colorAwarenessInfo?.bgSelectionClass}`,
    'data-user': user.name
  };
};

const cursorRender = (user: LocalDocumentUser) => {
  const cursor = document.createElement('span');
  cursor.classList.add('collaboration-cursor__caret');

  const label = document.createElement('div');
  label.classList.add('collaboration-cursor__label');
  label.classList.add(getAwarenessColor(user.colorId)?.bgClass ?? '');
  label.insertBefore(document.createTextNode(user.name), null);
  cursor.insertBefore(label, null);
  return cursor;
};

export const generateRandomAwarenessColor = (): ColorAwarenessInfo => {
  const randomIndex = Math.floor(Math.random() * awarenessColors.length);
  return awarenessColors[randomIndex];
};

export const getInitials = (name: string): string => {
  const nameParts = name.split(' ');
  return nameParts.map((part) => part[0].toUpperCase()).join('');
};

export const debounce = (fn: (...args: unknown[]) => void, timeout = 300) => {
  let timer: NodeJS.Timeout;

  return function (...args: unknown[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
};
