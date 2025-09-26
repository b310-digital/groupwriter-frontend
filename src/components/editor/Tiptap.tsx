import './styles.scss';

import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';

import * as Y from 'yjs';
import { onAwarenessUpdateParameters, StatesArray } from '@hocuspocus/provider';

import {
  createExtensions,
  createProvider,
  debounce
} from '../../utils/editorSetup';
import EditorMenuBar, { renderCommentButtons } from '../EditorMenuBar';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import CollaborationCommentsExtension from '@packages/tiptap-extension-comment-collaboration';
import {
  CommentItem,
  MarkWithPos
} from '@packages/tiptap-extension-comment-collaboration';
import CommentsList from '../CommentsList';

import { UserContext } from '../../contexts/UserContext';
import { UserList } from '../UserList';
import { EditorContext } from '../../contexts/EditorContext';
import { UtilMenuBar } from '../UtilMenuBar';
import { useTranslation } from 'react-i18next';
import { LocalDocumentUser } from '../../utils/localstorage';
import { ConnectionClosedModal } from '../ConnectionClosedModal';

const Tiptap = ({ documentId }: { documentId: string }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState<Record<string, CommentItem>>({});
  const [markPos, setMarkPos] = useState<Record<string, MarkWithPos>>({});
  const [activatedComment, setActivatedComment] = useState<string | null>(null);
  const { currentUser, storeUserSetting } = useContext(UserContext);
  const { readOnly, modificationSecret } = useContext(EditorContext);
  const [users, setUsers] = useState<Record<string, LocalDocumentUser>>({});
  const [connectionClosed, setConnectionClosed] = useState<boolean>(false);
  const [mobileCommentMenuOpen, setMobileCommentMenuOpen] =
    useState<boolean>(false);

  useEffect(() => {
    editor?.destroy();
  }, [documentId]);

  // Sets current users from awareness states
  const setAwarenessUsers = (states: StatesArray) => {
    const awarenessUsers = Object.values(states).reduce<
      Record<string, LocalDocumentUser>
    >((acc, state) => {
      const user = state.user as LocalDocumentUser;
      if (!user?.userId) return acc;

      acc[user.userId] = user;
      return acc;
    }, {});
    setUsers(awarenessUsers);
  };

  const debouncedSetUsers = debounce((states: unknown) => {
    setAwarenessUsers(states as StatesArray);
  });

  const ydoc = useMemo(() => new Y.Doc(), [documentId]);

  const provider = useMemo(
    () => createProvider(documentId, ydoc, modificationSecret),
    [documentId, ydoc, modificationSecret]
  );

  useEffect(() => {
    if (provider) {
      provider.on(
        'awarenessUpdate',
        ({ states }: onAwarenessUpdateParameters) => {
          debouncedSetUsers(states);
        }
      );

      provider.on('connect', () => {
        setConnectionClosed(false);
      });

      provider.on('close', () => {
        setConnectionClosed(true);
      });
    }
  }, [provider]);

  const handleCommentsPosUpdated = useCallback(
    (marks: Record<string, MarkWithPos>) => {
      setMarkPos(marks);
    },
    [setMarkPos]
  );

  const handleCommentActivated = useCallback(
    (commentId: string | null) => setActivatedComment(commentId),
    []
  );

  const handleCommentsDataUpdated = useCallback(
    (comments: Y.Map<CommentItem> | null) => {
      setComments(comments?.toJSON() ?? {});
    },
    [setComments]
  );
  const editor = useEditor({
    injectCSS: false,
    shouldRerenderOnTransaction: true,
    enablePasteRules: [CollaborationCommentsExtension],
    immediatelyRender: false,
    editable: !readOnly,
    extensions: createExtensions(
      ydoc,
      t,
      provider,
      modificationSecret,
      handleCommentsPosUpdated,
      handleCommentsDataUpdated,
      handleCommentActivated,
      currentUser
    ),
    editorProps: {
      attributes: {
        class:
          'h-full bg-white border border-neutral-200 rounded-lg text-left p-8'
      }
    }
  });

  const updateUser = useCallback(
    (user: LocalDocumentUser) => {
      editor?.commands.updateUser(user);
      storeUserSetting(user);
    },
    [editor, storeUserSetting]
  );

  const toggleMobileCommentMenu = () => {
    setMobileCommentMenuOpen(!mobileCommentMenuOpen);
  };

  return (
    <>
      {editor && (
        <>
          <UserList users={users} />
          <EditorMenuBar
            editor={editor}
            documentId={documentId}
            modificationSecret={modificationSecret}
            currentUser={currentUser}
            setMobileCommentMenuOpen={setMobileCommentMenuOpen}
          >
            <ConnectionClosedModal isModalOpen={connectionClosed} />
            <UtilMenuBar
              toggleMobileCommentMenu={toggleMobileCommentMenu}
              updateUser={updateUser}
              currentUser={currentUser}
              editor={editor}
            />
          </EditorMenuBar>
        </>
      )}

      <div className="mt-20 mb-8 flex flex-grow justify-center bg-neutral-100">
        <div className="container flex flex-grow">
          <div className="flex flex-grow grid grid-cols-3 lg:grid-cols-4 grid-rows-1 content-start grid-rows-editor">
            <div className="row-start-2 col-start-1 col-span-3 row-span-1">
              {editor && (
                <EditorContent editor={editor} className="h-full">
                  <BubbleMenu
                    editor={editor}
                    options={{ placement: 'bottom' }}
                    className="flex flex-row bg-white rounded-md border border-neutral-200"
                  >
                    {editor &&
                      renderCommentButtons(
                        editor,
                        currentUser,
                        setMobileCommentMenuOpen,
                        t,
                        {
                          className: 'inline-block'
                        }
                      )}
                  </BubbleMenu>
                </EditorContent>
              )}
            </div>
            <div
              className={`absolute ${mobileCommentMenuOpen ? 'block' : 'hidden'} top-20 right-0 lg:left-0 bottom-0 w-80 bg-neutral-100 mb-8 border-2 border-neutral-200 rounded-lg lg:w-auto lg:bg-transparent lg:border-0 lg:mb-0 lg:relative lg:top-0 lg:row-start-2 lg:col-start-4 lg:col-span-1 lg:row-span-1 lg:block overflow-y-auto`}
            >
              <CommentsList
                comments={comments}
                markPos={markPos}
                editor={editor}
                activatedComment={activatedComment}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tiptap;
