import React, { useEffect, useState } from 'react';
import Tiptap from '../components/editor/Tiptap';
import { Navigate } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import { v4 as uuidv4, validate } from 'uuid';
import { generateRandomAwarenessColor } from '../utils/editorSetup';
import { EditorContext } from '../contexts/EditorContext';
import {
  getLocalUserSetting,
  LocalDocumentUser,
  mergeLocalDocument,
  storeLocalUserSetting
} from '../utils/localstorage';
import { useTranslation } from 'react-i18next';

function DocumentPage({ documentId }: { documentId: string | undefined }) {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<LocalDocumentUser | null>(
    null
  );

  const storeUserSetting = (user: LocalDocumentUser | null) => {
    if (!user) return;

    setCurrentUser(user);
    storeLocalUserSetting(user);
  };

  useEffect(() => {
    if (!documentId) return;

    const userSetting = getLocalUserSetting(documentId);
    if (!userSetting) {
      const newUserSetting = {
        userId: uuidv4(),
        name: t('editor.defaultUsername'),
        colorId: generateRandomAwarenessColor().id,
        documentId
      };
      storeUserSetting(newUserSetting);
    } else {
      setCurrentUser(userSetting);
    }
  }, [documentId]);

  const modificationSecret = window.location.hash.substring(1);
  const readOnly = modificationSecret === '';

  if (documentId && validate(documentId)) {
    if (!currentUser) {
      return <></>;
    }

    // The createdAt and updatedAt are set to the current date when the document is accessed.
    // Currently, it does not reflect the server timestamp.
    mergeLocalDocument({
      id: documentId,
      modificationSecret: readOnly ? undefined : modificationSecret,
      lastAccessedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return (
      <div className="absolute top-0 left-0 right-0 flex bg-neutral-100 min-h-screen">
        <UserContext.Provider
          value={{
            currentUser,
            storeUserSetting
          }}
        >
          <EditorContext.Provider
            value={{
              readOnly,
              modificationSecret,
              documentId
            }}
          >
            <Tiptap documentId={documentId} />
          </EditorContext.Provider>
        </UserContext.Provider>
      </div>
    );
  } else {
    return (
      <Navigate
        to={{ pathname: '/' }}
        state={{ messageCode: 'documentIdInvalid' }}
      />
    );
  }
}

export default DocumentPage;
