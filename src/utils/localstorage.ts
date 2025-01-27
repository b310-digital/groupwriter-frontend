export interface LocalDocument {
  id: string;
  modificationSecret?: string;
  createdAt?: string;
  updatedAt?: string;
  lastAccessedAt: string;
}

export interface LocalDocumentUser {
  userId: string;
  documentId: string;
  name: string;
  colorId: string;
}

export const storeLocalUserSetting = (userEntry: LocalDocumentUser): void => {
  const newDocumentsUsersSettings = JSON.parse(
    localStorage.getItem('documentsUsersSettings') ?? '{}'
  ) as Record<string, LocalDocumentUser>;
  newDocumentsUsersSettings[userEntry.documentId] = userEntry;
  localStorage.setItem(
    'documentsUsersSettings',
    JSON.stringify(newDocumentsUsersSettings)
  );
};

export const getLocalUserSetting = (
  documentId: string
): LocalDocumentUser | undefined => {
  const documentsUsersSettings = JSON.parse(
    localStorage.getItem('documentsUsersSettings') ?? '{}'
  ) as Record<string, LocalDocumentUser>;
  return documentsUsersSettings[documentId];
};

export const storeLocalDocument = (document: LocalDocument): void => {
  const newDocuments = JSON.parse(
    localStorage.getItem('documents') ?? '{}'
  ) as Record<string, LocalDocument>;
  newDocuments[document.id] = document;
  localStorage.setItem('documents', JSON.stringify(newDocuments));
};

export const mergeLocalDocument = (document: LocalDocument): void => {
  const newDocuments = getLocalDocuments();
  const existingDocument = newDocuments?.[document.id];
  newDocuments[document.id] = { ...(existingDocument ?? {}), ...document };
  localStorage.setItem('documents', JSON.stringify(newDocuments));
};

export const getLocalDocuments = (): Record<string, LocalDocument> => {
  return JSON.parse(localStorage.getItem('documents') ?? '{}') as Record<
    string,
    LocalDocument
  >;
};

export const getLocalUserSettings = (): Record<string, LocalDocumentUser> => {
  return JSON.parse(
    localStorage.getItem('documentsUsersSettings') ?? '{}'
  ) as Record<string, LocalDocumentUser>;
};

export const getLocalMostRecentThreeDocuments = (): LocalDocument[] => {
  const documents = getLocalDocuments();

  return Object.values(documents)
    .sort(
      (a, b) =>
        new Date(b?.lastAccessedAt).getTime() -
        new Date(a?.lastAccessedAt).getTime()
    )
    .slice(0, 3);
};

export const deleteLocalDocument = (documentId: string) => {
  const updatedDocuments = getLocalDocuments();
  delete updatedDocuments[documentId];

  const updatedUserSettings = getLocalUserSettings();
  delete updatedUserSettings[documentId];

  localStorage.setItem('documents', JSON.stringify(updatedDocuments));
  localStorage.setItem(
    'documentsUsersSettings',
    JSON.stringify(updatedUserSettings)
  );
};
