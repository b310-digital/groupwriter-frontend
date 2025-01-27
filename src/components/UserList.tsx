import { ReactElement } from 'react';
import { getInitials } from '../utils/editorSetup';
import { LocalDocumentUser } from '../utils/localstorage';
import { getAwarenessColor } from '../utils/userColors';

export const UserList = ({
  users
}: {
  users: Record<string, LocalDocumentUser>;
}) => {
  const renderUserList = (): ReactElement[] => {
    if (!users) return [];

    // we use userId to sort the users because it is unique and stable
    return Object.values(users)
      .sort((userA, userB) => userA.userId.localeCompare(userB.userId))
      .map((user) => {
        const colorAwarenessInfo = getAwarenessColor(user.colorId);
        return (
          <div
            key={user?.userId}
            className={`h-6 w-6 rounded-full text-center inline m-1 font-xs ${colorAwarenessInfo?.bgClass}`}
          >
            {getInitials(user?.name)}
          </div>
        );
      });
  };

  return (
    <div className="fixed bottom-0 left-0 flex items-center z-50 m-2">
      {renderUserList()}
    </div>
  );
};
