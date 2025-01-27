import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  CommentItem,
  MarkWithPos
} from '@packages/tiptap-extension-comment-collaboration';
import { Editor } from '@tiptap/core';
import CommentCard from './CommentCard';
import { UserContext } from '../contexts/UserContext';

interface CommentCardMargins {
  absoluteTop: number;
  key: string;
}

const COLLAPSED_CARD_HEIGHT = 150;
const COLLAPSED_CARD_MARGIN = 5;

const EditorComments = ({
  comments,
  markPos,
  editor,
  activatedComment
}: {
  comments: Record<string, CommentItem>;
  markPos: Record<string, MarkWithPos>;
  editor: Editor | null;
  activatedComment: string | null;
}) => {
  const { currentUser } = useContext(UserContext);
  const [lastClickedCommentId, setLastClickedCommentId] = useState<
    string | null
  >(null);

  // Recently added comments have priority so the user can fill them out
  useEffect(() => {
    if (!comments) return;

    const toBeEditedComments = Object.values(comments).filter(
      (comment) =>
        comment?.text === null && currentUser?.userId === comment?.user?.id
    );

    if (toBeEditedComments.length > 0) {
      setLastClickedCommentId(toBeEditedComments[0].commentId);
    }
  }, [comments, currentUser]);

  const calculateMargins = useCallback(
    (
      comments: Record<string, CommentItem>,
      markPos: Record<string, MarkWithPos>
    ): CommentCardMargins[] | undefined => {
      if (!comments || !markPos) {
        return;
      }
      // Positional entries of comment marks inside the editor
      const markPosEntries = Object.entries(markPos);
      return markPosEntries.reduce((acc, [key, value], index) => {
        // Absolute distance from the comment mark inside the editor to the top of the editor
        const currentAbsTop = value?.coords?.top ?? 0;
        const prevAbsTop = acc.at(acc.length - 1)?.absoluteTop ?? 0;

        const newAbsTop = Math.max(
          currentAbsTop,
          prevAbsTop +
            (index > 0 ? COLLAPSED_CARD_HEIGHT + COLLAPSED_CARD_MARGIN : 0),
          0
        );

        acc.push({
          key,
          absoluteTop: newAbsTop
        });
        return acc;
      }, new Array<CommentCardMargins>(markPosEntries.length));
    },
    []
  );

  const renderComments = (): ReactElement[] => {
    const margins = calculateMargins(comments, markPos) ?? [];
    return margins.map(({ key, absoluteTop }) => {
      const comment = comments?.[key];
      if (!comment) return <div key={key}></div>;
      return (
        <CommentCard
          editor={editor}
          comment={comment}
          key={key}
          absoluteTop={absoluteTop}
          setLastClickedCommentId={setLastClickedCommentId}
          toBeEdited={
            comment.text === null && currentUser?.userId === comment.user.id
          }
          isLastClicked={lastClickedCommentId === key}
          activated={activatedComment === key}
        />
      );
    });
  };
  return <div className="static">{renderComments()}</div>;
};

export default EditorComments;
