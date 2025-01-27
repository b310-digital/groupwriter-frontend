import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

export const FlashMessage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const messageCode =
    (location.state as { messageCode: string })?.messageCode || null;

  // remove old message from history:
  window.history.replaceState({}, '');

  return (
    <>
      {messageCode && (
        <div
          className="bg-red-200 border-l-4 border-red-400 text-red-700 p-4 mb-4 mr-10"
          role="alert"
        >
          {t(`messages.${messageCode}`)}
        </div>
      )}
    </>
  );
};
