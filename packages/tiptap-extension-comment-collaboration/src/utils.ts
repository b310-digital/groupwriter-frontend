import { Editor } from "@tiptap/core";
import { CommentItem, CommentOptions, CommentStorage, CommentType, CommentUser, MarkWithPos } from "./types.js";
import { DEFAULT_COMMENT_OPTIONS } from "./constants.js";

export const debounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  timeout = 300
): ((...args: T) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: T) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
};

export const createReply = (commentId: string, parentId: string, user: CommentUser, text: string | null): CommentItem => {
  return {
    commentType: 'comment-reply',
    commentId: commentId,
    user: user,
    text: text === undefined ? null : text,
    draft: false,
    resolved: false,
    parentId: parentId,
    colorClass: null,
    createdAt: Date.now(),
    updatedBy: null,
    updatedAt: Date.now()
  }
};

export const createComment = (commentId: string, commentType: CommentType | undefined, user: CommentUser, text: string | null, colorClass: string | null): CommentItem => {
return {
  ...DEFAULT_COMMENT_OPTIONS,
  ...{
    commentId: commentId,
    commentType: commentType ?? 'comment',
    text: text === undefined ? null : text,
    colorClass: colorClass,
    user: user,
    createdAt: Date.now(),
    updatedBy: null,
    updatedAt: Date.now()
  }
}
};

/**
 * Attaches an event listener to all images in the editor.
 * This listener triggers an update of the comments positions when an image is loaded.
 */
export const attachImageLoadedCallback = (
  editor: Editor,
  storage: CommentStorage,
  options: CommentOptions
) => {
  const images = editor.view.dom.getElementsByTagName('img');

  Array.from(images).forEach((img) => {
    if (!img.hasAttribute('data-loading-handled')) {
      img.setAttribute('data-loading-handled', 'true');
      img.addEventListener('load', () => {
        updateCommentsPos(editor, storage, options);
      });
    }
  });
};

/**
 * Calculates absolute positions of comments within the editor.
 * These positions are used to render comments in the UI outside the editor.
 */
export const updateCommentsPos = (
  editor: Editor,
  _storage: CommentStorage,
  options: CommentOptions
) => {
  if(editor.isDestroyed) return;

  const marks: Record<string, MarkWithPos> = {};
  editor.state.doc.descendants((node, pos) => {
    const commentMark = node.marks.find((mark) => mark.type.name === 'comment');
    if (commentMark) {
      // calculate the positions of comments in relation to the editor
      const key = commentMark.attrs.commentId as string;
      const coordsAtPos = editor.view.coordsAtPos(pos);
      const editorBoundingRect = editor.view.dom.getBoundingClientRect();
      const editorPosY = editorBoundingRect.y;
      const editorPosX = editorBoundingRect.x;

      // prioritize old positions of comments
      if (!marks[key])
        marks[key] = {
          commentId: key,
          range: { from: pos, to: pos + node.nodeSize },
          coords: {
            top: coordsAtPos.top - editorPosY,
            left: coordsAtPos.left - editorPosX,
            bottom: coordsAtPos.bottom - editorPosY,
            right: coordsAtPos.right - editorPosX
          }
        };
    }
  });

  options.onCommentsPosUpdated(marks);
};

/**
 * Debounces the update of comments positions to prevent excessive re-renders.
 */
export const debouncedUpdateCommentsPos = debounce(
  (editor: Editor, storage: CommentStorage, options: CommentOptions) => {
    attachImageLoadedCallback(editor, storage, options);
    updateCommentsPos(editor, storage, options);
  },
  100
);