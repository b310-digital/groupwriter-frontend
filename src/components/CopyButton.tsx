import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CopyProps {
  contentToCopy: string;
}

export const CopyButton = ({
  contentToCopy
}: CopyProps): React.ReactElement => {
  const [copied, setCopied] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    setCopied(false);
  }, [contentToCopy]);

  const copyUrl = (): void => {
    navigator.clipboard
      .writeText(contentToCopy)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };

  const copyText = copied
    ? t('modals.share.messages.copied')
    : t('modals.share.buttons.copy');
  return (
    <button
      className="px-3 py-2 text-white bg-secondary rounded-md hover:bg-primary"
      onClick={copyUrl}
    >
      {copyText}
    </button>
  );
};
