import { Map as YMap, Doc } from 'yjs';
import { Range } from '@tiptap/core';

export interface MarkWithPos {
  commentId: string;
  range: Range;
  coords?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

export type CommentType = 'comment' | 'comment-reply' | 'suggestion';

export interface CommentUser {
  id: string | null;
  username: string;
}

export interface CommentItem {
  commentId: string;
  commentType: CommentType;
  text: string | null;
  draft: boolean;
  resolved: boolean;
  parentId: string | null;
  colorClass: string | null;
  user: CommentUser;
  updatedBy: CommentUser | null;
  createdAt: number;
  updatedAt: number;
}

export interface CommentStorage {
  comments: YMap<CommentItem> | null;
}

export interface CommentOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>;
  // Callback for when comments positions are updated
  onCommentsPosUpdated: (marks: Record<string, MarkWithPos>) => void;
  // Callback for when comments data is updated
  onCommentsDataUpdated: (comments: YMap<CommentItem> | null) => void;
  // Callback for when a comment is activated (e.g. clicked on inside the editor)
  onCommentActivated: (commentId: string | null) => void;
  // The document to observe
  document: Doc | null;
  // The default color for comments
  defaultColorClass: string | null;
  // Controls if comment actions should be added to history
  addToHistory: boolean | null;
  // Controls if comment markings should be removed from paste
  removeFromPaste: boolean | null;
}