import { Mark } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';
import { Plugin } from '@tiptap/pm/state';
import { CommentItem, CommentOptions, CommentStorage, CommentUser } from './types.js';
import { createComment, createReply, debouncedUpdateCommentsPos } from './utils.js';
import { DEFAULT_COLOR_CLASS, Y_MAP_COMMENT_KEY } from './constants.js';

/**
 * Extends the Commands interface to add comment-related commands
 * Hint: set and unset are kept in the exiting editor command api,
 * The rest of the commands are prefixed with comment to make it clear that they are related to comments
 */
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comment: {
      /**
       * Sets and adds a comment to a selection
       */
      setComment: (attributes: Partial<CommentItem>) => ReturnType;
      /**
       * Unsets and removes a comment
       */
      unsetComment: () => ReturnType;
      /**
       * Accepts a proposal from a comment
       */
      commentAcceptProposal: (attributes: {
        commentId: string;
      }) => ReturnType;
      /**
       * Add a reply to a comment
       */
      commentAddReply: (attributes: Partial<CommentItem>) => ReturnType;
      /**
       * Removes a comment by id
       */
      commentRemove: (attributes: { commentId: string }) => ReturnType;
      /**
       * Updates a comment by id
       */
      commentUpdate: (attributes: {
        commentId: string;
        text: string;
        user: CommentUser | null;
      }) => ReturnType;
      /**
       * Changes the username of a user in all comments
       */
      commentUsernameUpdate: (attributes: {
        userId: string;
        userName: string;
      }) => ReturnType;
    };
  }
}

export const commentRemoveRegex =
  /<span[^>]*data-comment-id="[^"]*"[^>]*>(.*?)<\/span>/g;

/* See documentaiton on tiptap extensions https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing
* Hint: Comments are currently exluded from history, despite removing text and redoing the insertion which also adds back the previously deleted comment.

* Note on comment persistence:
* - When text with a comment is deleted, the comment remains in storage
* - This allows for proper undo/redo functionality
* - Without this, redoing a deletion would fail since the comment would be missing
* 
* If a comment is deleted with the commentRemove command, the comment is removed from the storage as well as from the editor.
* 
* Alternative approach could be (on editor content changes):
* 1. Remove comments from editor that don't exist in storage
* 2. Then remove comments from storage that don't exist in editor
* However this would break undo/redo functionality
*/
export const CollaborationCommentsExtension = Mark.create<
  CommentOptions,
  CommentStorage
>({
  name: 'comment',

  addProseMirrorPlugins() {
    return this.options.removeFromPaste
      ? [
          // This plugin is used to remove comments from pasted text
          new Plugin({
            props: {
              transformPastedHTML: (html) =>
                html.replace(commentRemoveRegex, '$1')
            }
          })
        ]
      : [];
  },

  onCreate() {
    if (this.options.document) {
      this.storage.comments =
        this.options.document.getMap<CommentItem>(Y_MAP_COMMENT_KEY);
      this.storage.comments.observe(() => {
        if (this.storage.comments) {
          this.options.onCommentsDataUpdated(this.storage.comments);
        }
      });
    }
  },

  addOptions() {
    return {
      HTMLAttributes: {},
      onCommentsPosUpdated: () => void {},
      onCommentsDataUpdated: () => void {},
      onCommentActivated: () => void {},
      document: null,
      defaultColorClass: DEFAULT_COLOR_CLASS,
      addToHistory: false,
      removeFromPaste: true
    };
  },

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: (el) =>
          (el as HTMLSpanElement).getAttribute('data-comment-id'),
        renderHTML: (attrs) => ({
          'data-comment-id': typeof(attrs.commentId) === 'string' ? attrs.commentId : ''
        })
      },
      colorClass: {
        default: this.options.defaultColorClass,
        parseHTML: (el) => (el as HTMLSpanElement).getAttribute('data-color-class'),
        renderHTML: (attrs) => {
          const colorClass = typeof(attrs.colorClass) === 'string' ? attrs.colorClass : '';
          return { 'data-color-class': colorClass, class: `${colorClass} text-inherit` }
        }
      }
    };
  },

  onUpdate() {
    debouncedUpdateCommentsPos(this.editor, this.storage, this.options);
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-comment-id]'
      }
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    const colorClass = typeof(HTMLAttributes['data-color-class']) === 'string' ? HTMLAttributes['data-color-class'] : '';
    const commentId = typeof(HTMLAttributes['data-comment-id']) === 'string' ? HTMLAttributes['data-comment-id'] : '';

    return [
      'span',
      {
        'data-color-class': colorClass,
        'data-comment-id': commentId,
        'class': `${colorClass} text-inherit`
      }
    ];
  },

  addStorage() {
    return {
      comments: null
    };
  },

  onSelectionUpdate() {
    if (!this.editor?.state?.selection || !this.options) return;

    const selection = this.editor?.state?.selection;
    if (!('$from' in selection)) return;

    const marks = selection.$from.marks();
    if (!marks.length) {
      this.options.onCommentActivated(null);
      return;
    }

    const activeCommentMark = marks.find(
      (mark) => mark.type.name === 'comment'
    );
    if (!activeCommentMark) {
      this.options.onCommentActivated(null);
      return;
    }

    this.options.onCommentActivated(
      (activeCommentMark?.attrs?.commentId as string) ?? null
    );
  },

  addCommands() {
    return {
      setComment:
        (attributes) =>
        ({ commands }) => {
          const commentId = attributes?.commentId ?? uuidv4();
          const commentText = attributes?.text ?? null;
          const colorClass =
            attributes?.colorClass ?? this.options.defaultColorClass ?? DEFAULT_COLOR_CLASS;

          if (!attributes?.user) {
            console.error('Set comment: User is required');
            return false;
          }

          const comment = createComment(commentId, attributes.commentType, attributes.user, commentText, colorClass);            

          this.storage.comments?.set(commentId, comment);
          commands.setMeta('addToHistory', this.options.addToHistory);
          // the commentId is optional and potentially generated in this method, so we need to pass it along
          return commands.setMark('comment', {
            ...attributes,
            commentId,
            colorClass
          });
        },
      unsetComment:
      () =>
      ({ commands }) => {
        return commands.unsetMark(this.name);
      },
      commentAcceptProposal:
        ({ commentId }) =>
        ({ dispatch, state, tr }) => {
          const comment = this.storage.comments?.get(commentId);
          if (!comment) return false;
          if (comment.commentType !== 'suggestion') {
            console.error('Accept proposal: Comment is not a suggestion');
            return false;
          }

          let replaced = false;

          tr.doc.descendants((node, pos) => {
            const commentMarks = node.marks.filter(
              (mark) =>
                mark.type.name === 'comment' &&
                mark.attrs.commentId === commentId
            );
            const from = pos;
            const to = pos + node.nodeSize;

            commentMarks.forEach(() => {
              // only replace the first match
              if (!replaced) {
                const mappedFrom = tr.mapping.map(from);
                const mappedTo = tr.mapping.map(to);
                if (comment?.text && comment.text !== '') {
                  tr.replaceWith(
                    mappedFrom,
                    mappedTo,
                    state.schema.text(comment.text)
                  );
                } else {
                  tr.delete(mappedFrom, mappedTo);
                }
                replaced = true;
              } else {
                tr.delete(tr.mapping.map(from), tr.mapping.map(to));
              }
            });
          });

          dispatch?.(tr);

          return replaced;
        },
      // this does not set or unset any marks, it just adds a replying comment to the storage
      commentAddReply: (attributes) => () => {
        const commentId = attributes?.commentId ?? uuidv4();
        const commentText = attributes?.text ?? null;

        if (!attributes?.parentId) {
          console.error('Add reply: Parent comment id is required');
          return false;
        }

        if (!attributes?.user) {
          console.error('Add reply: User is required');
          return false;
        }

        const reply = createReply(commentId, attributes.parentId, attributes.user, commentText);

        this.storage.comments?.set(commentId, reply);
        return true;
      },
      commentRemove:
        (attributes) =>
        ({ dispatch, state }) => {
          const commentId = attributes?.commentId;
          if (!commentId) return false;

          state.doc.descendants((node, pos) => {
            const commentMarks = node.marks.filter(
              (mark) =>
                mark.type.name === 'comment' &&
                mark.attrs.commentId === commentId
            );
            commentMarks.forEach((mark) => {
              const from = pos;
              const to = pos + node.nodeSize;
              dispatch?.(
                state.tr
                  .setMeta('addToHistory', this.options.addToHistory)
                  .removeMark(from, to, mark.type)
              );
            });
          });
          this.storage.comments?.delete(commentId);
          return true;
        },
      commentUpdate:
        ({ commentId, text, user }) =>
        () => {
          const comment = this.storage.comments?.get(commentId);
          if (!comment) return false;
          this.storage.comments?.set(commentId, {
            ...comment,
            text,
            updatedAt: Date.now(),
            updatedBy: user ?? null
          });
          return true;
        },
      commentUsernameUpdate:
        ({ userId, userName }) =>
        () => {
          const comments = this.storage.comments?.entries();
          if (typeof comments !== 'object') return false;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for (const [_key, comment] of comments) {
            const isCommentCreator = comment.user.id === userId;
            const isCommentUpdater = comment.updatedBy?.id === userId;
            if (!isCommentCreator && !isCommentUpdater) continue;

            const newUser = isCommentCreator ? { ...comment.user, username: userName } : comment.user;
            const newCommentUpdater = isCommentUpdater && comment.updatedBy ?  { ...comment.updatedBy, username: userName } : comment.updatedBy;
            this.storage.comments?.set(comment.commentId, { ...comment, user: newUser, updatedBy: newCommentUpdater });
          };
          return true;
        }
    };
  }
});
