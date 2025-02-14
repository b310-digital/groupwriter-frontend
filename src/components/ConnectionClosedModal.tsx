import Modal from './Modal';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export function ConnectionClosedModal({
  isModalOpen
}: {
  isModalOpen: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Modal header={t('modals.connectionClosed.title')} isOpen={isModalOpen}>
      <div className="mb-4">{t('modals.connectionClosed.content')}</div>
      <div className="flex justify-start">
        <button className="btn-editor" onClick={() => void navigate('/')}>
          {t('modals.connectionClosed.buttons.home')}
        </button>
      </div>
    </Modal>
  );
}
