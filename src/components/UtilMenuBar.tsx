import {
  ChatBubbleBottomCenterIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import ShareDocumentButton from './ShareDocumentButton';
import AboutButton from './AboutButton';
import { useTranslation } from 'react-i18next';
import { Editor } from '@tiptap/core';
import { LocalDocumentUser } from '../utils/localstorage';

export const UtilMenuBar = ({
  toggleMobileCommentMenu,
  updateUser,
  currentUser,
  editor
}: {
  toggleMobileCommentMenu: () => void;
  updateUser: (user: LocalDocumentUser) => void;
  currentUser: LocalDocumentUser | null;
  editor: Editor;
}) => {
  const { t } = useTranslation();

  return (
    <div className="absolute right-0 top-0 flex items-center">
      <button
        title={t('menuBar.buttons.showComments')}
        className="btn-editor lg:hidden!"
        onClick={toggleMobileCommentMenu}
      >
        <ChatBubbleBottomCenterIcon className="size-4" />
      </button>
      <button
        title={t('menuBar.buttons.changeUsername')}
        onClick={() => {
          const newUsername = window.prompt(t('modals.user.username'));
          if (!newUsername || !currentUser) return;

          updateUser({
            ...currentUser,
            name: newUsername
          });

          editor.commands.commentUsernameUpdate({
            userId: currentUser.userId,
            userName: newUsername
          });
        }}
        disabled={false}
        className="btn-editor"
      >
        <UserIcon className="size-4" />
      </button>
      <ShareDocumentButton />
      <AboutButton />
    </div>
  );
};
