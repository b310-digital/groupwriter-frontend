import {
  ChatBubbleBottomCenterIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentCheckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Editor } from '@tiptap/core';
import { CommentItem } from '@packages/tiptap-extension-comment-collaboration';
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { EditorContext } from '../contexts/EditorContext';
import { useTranslation } from 'react-i18next';

const CommentCard = ({
  editor,
  comment,
  setLastClickedCommentId,
  activated,
  isLastClicked,
  absoluteTop,
  toBeEdited
}: {
  editor: Editor | null;
  comment: CommentItem;
  setLastClickedCommentId: (commentId: string | null) => void;
  activated: boolean;
  isLastClicked: boolean;
  absoluteTop: number;
  toBeEdited: boolean;
}) => {
  const { currentUser } = useContext(UserContext);
  const { readOnly } = useContext(EditorContext);

  const [isOpened, setIsOpened] = useState(toBeEdited ?? false);
  const [isEditing, setIsEditing] = useState(toBeEdited ?? false);
  const [commentText, setCommentText] = useState(comment?.text);

  const { t } = useTranslation();

  useEffect(() => {
    const handleClick = () => {
      if (
        comment &&
        comment.text === null &&
        editor &&
        currentUser &&
        comment.user?.id === currentUser?.userId
      ) {
        editor.commands.commentRemove({ commentId: comment.commentId });
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [comment, editor, currentUser]);

  const onCardClick = (): void => {
    if (!isOpened) setLastClickedCommentId(comment.commentId);
    setIsOpened(!isOpened);
    setIsEditing(false);
  };

  const onDeleteClick = (): void => {
    if (readOnly) return;
    if (editor) editor.commands.commentRemove({ commentId: comment.commentId });
  };

  const onCommentEdit = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    if (readOnly) return;

    if (isEditing && isOpened) {
      setIsOpened(false);
      setIsEditing(false);
    } else if (isOpened && !isEditing) {
      setIsEditing(true);
    } else {
      setIsEditing(true);
      setIsOpened(true);
    }
  };

  const onCommentAbortEdit = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.stopPropagation();

    if (readOnly) return;

    setIsOpened(false);
    setIsEditing(false);
    if (comment.text === null && editor) {
      editor.commands.commentRemove({ commentId: comment.commentId });
    }
  };

  const onCommentSave = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();

    if (readOnly) return;

    setIsOpened(false);
    setIsEditing(false);
    setLastClickedCommentId(null);
    if (editor && currentUser) {
      // Comments are instantly created, so only an non defined text reveals a new comment
      const isCommentUpdate = !!comment.text;
      const commentUser = isCommentUpdate
        ? { id: currentUser.userId, username: currentUser.name }
        : null;
      editor.commands.commentUpdate({
        commentId: comment.commentId,
        text: commentText ?? '',
        user: commentUser
      });
    }
  };

  const onCommentAcceptProposal = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.stopPropagation();

    if (readOnly) return;

    if (editor)
      editor.commands.commentAcceptProposal({
        commentId: comment.commentId
      });
  };

  const handleEmptyText = (text: string | null): string => {
    if (text === null) return '...';

    return text !== '' ? text : '(delete)';
  };

  const formatDate = (date: number | undefined): string => {
    if (typeof date === 'number') return new Date(date).toLocaleString();
    return '';
  };

  if (!comment) return <></>;

  return (
    <div
      style={{
        top: absoluteTop
      }}
      className={`comment-card${activated ? ' comment-card-activated' : ''}${isLastClicked ? ' comment-card-last-clicked' : ''}${isEditing ? ' comment-card-editing' : ''}`}
      onClick={() => onCardClick()}
    >
      <div className="comment-card-header flex flex-row">
        <div className="flex justify-start items-start flex-col">
          <div className="flex flex-row items-center">
            {comment.commentType === 'suggestion' && (
              <DocumentCheckIcon className="size-4 me-2" />
            )}
            {comment.commentType === 'comment' && (
              <ChatBubbleBottomCenterIcon className="size-4 me-2" />
            )}
            <div className="font-bold text-sm">{comment.user?.username}</div>
          </div>
          <div className="text-xs">{formatDate(comment.createdAt)}</div>
        </div>
        <div className="flex grow justify-end">
          <span>
            {!readOnly && (
              <>
                {comment.commentType === 'suggestion' && (
                  <button
                    title={t('commentCard.buttons.acceptProposal')}
                    onClick={(event) => onCommentAcceptProposal(event)}
                    className="border-none p-0 ms-2"
                  >
                    <CheckIcon className="size-4" />
                  </button>
                )}
                <button
                  title={t('commentCard.buttons.edit')}
                  onClick={(event) => onCommentEdit(event)}
                  className="border-none p-0 ms-2"
                >
                  <PencilIcon className="size-4" />
                </button>
                <button
                  title={t('commentCard.buttons.delete')}
                  onClick={() => onDeleteClick()}
                  className="border-none p-0 ms-2"
                >
                  <XCircleIcon className="size-4" />
                </button>
              </>
            )}
          </span>
        </div>
      </div>
      <div
        className={`comment-card-content${isOpened ? ' comment-card-content-opened' : ''}`}
      >
        {isEditing ? (
          <div>
            <div className="flex justify-start block w-full">
              <textarea
                autoFocus
                defaultValue={comment.text ?? ''}
                onChange={(e) => setCommentText(e.target.value)}
                className="focus:outline rounded-sm text-sm p-2 outline-neutral-300 border-neutral-300 border-solid border w-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <p className="flex justify-start mt-2">
              <button
                onClick={(event) => onCommentSave(event)}
                className="p-2 me-2"
              >
                {t('buttons.save')}
              </button>
              <button
                onClick={(event) => onCommentAbortEdit(event)}
                className="p-2"
              >
                {t('buttons.abort')}
              </button>
            </p>
          </div>
        ) : (
          <div>
            {comment.commentType === 'suggestion' && (
              <blockquote className="text-left text-sm p-4 border-s-4 border-neutral-300 bg-neutral-50">
                {handleEmptyText(comment.text)}
              </blockquote>
            )}
            {comment.commentType !== 'suggestion' && (
              <div className="text-left text-sm">{comment.text}</div>
            )}
            {comment.updatedBy && typeof comment.updatedAt === 'number' && (
              <div className="text-xs italic text-left">
                Last updated by {comment.updatedBy?.username} at{' '}
                {formatDate(comment.updatedAt)}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="comment-card-footer flex justify-center z-50">
        {isOpened && <ChevronUpIcon className="size-4" />}
        {!isOpened && <ChevronDownIcon className="size-4" />}
      </div>
    </div>
  );
};

export default CommentCard;
