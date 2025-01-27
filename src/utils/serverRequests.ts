import { serverUrl } from './editorSetup';
import { storeLocalDocument } from './localstorage';
import { LocalDocument } from './localstorage';

export const deleteDocument = async (
  documentId: string,
  modificationSecret: string
): Promise<void> => {
  const response = await fetch(`${serverUrl()}/documents/${documentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: modificationSecret
    }
  });

  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
  }
};

export const createDocument = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${serverUrl()}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    } else {
      const document = (await response.json()) as LocalDocument;
      storeLocalDocument(document);
      return `/document/${document.id}#${document.modificationSecret}`;
    }
  } catch (error) {
    console.error('Error posting data:', error);
  }
  return null;
};

export const uploadImage = async (
  file: File,
  documentId: string,
  modificationSecret: string
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const response = await fetch(
      `${serverUrl()}/documents/${documentId}/images`,
      {
        method: 'POST',
        headers: {
          Authorization: modificationSecret
        },
        body: formData
      }
    );

    if (response.ok) {
      const json = (await response.json()) as { imageUrl: string };
      return json.imageUrl;
    } else {
      console.error(
        `HTTP error while uploading image! Status: ${response.status}`
      );
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
  return null;
};

export const deleteImage = async (
  imageUrl: string,
  modificationSecret: string
): Promise<void> => {
  const response = await fetch(imageUrl, {
    method: 'DELETE',
    headers: {
      Authorization: modificationSecret
    }
  });

  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
  }
};
