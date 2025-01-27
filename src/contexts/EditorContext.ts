import { createContext } from 'react';

export interface EditorContextType {
  modificationSecret: string;
  readOnly: boolean;
  documentId: string;
}
export const EditorContext = createContext<EditorContextType>({
  modificationSecret: '',
  readOnly: false,
  documentId: ''
});
