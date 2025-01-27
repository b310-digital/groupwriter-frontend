import { createContext } from 'react';
import { LocalDocumentUser } from '../utils/localstorage';

export interface UserContextType {
  currentUser: LocalDocumentUser | null;
  storeUserSetting: (user: LocalDocumentUser | null) => void;
}
export const UserContext = createContext<UserContextType>({
  currentUser: null,
  storeUserSetting: () => void {}
});
