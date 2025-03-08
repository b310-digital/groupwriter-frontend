import { useContext } from 'react';
import Modal from './Modal';
import { EditorContext } from '../contexts/EditorContext';
import { useNavigate } from 'react-router';
import { deleteDocument } from '../utils/serverRequests';
import { useTranslation } from 'react-i18next';
import logo from '/images/logo.svg?url';
import { deleteLocalDocument } from '../utils/localstorage';

export function AboutModal({
  isModalOpen,
  toggleModal
}: {
  isModalOpen: boolean;
  toggleModal: () => void;
}) {
  const { t } = useTranslation();
  const { readOnly, documentId, modificationSecret } =
    useContext(EditorContext);
  const navigate = useNavigate();

  const handleDeleteDocument = async () => {
    const confirmed = confirm(t('modals.about.confirmDelete'));
    if (confirmed) {
      await deleteDocument(documentId, modificationSecret);
      deleteLocalDocument(documentId);
      void navigate('/');
    }
  };
  return (
    <Modal
      header={t('modals.about.title')}
      isOpen={isModalOpen}
      onToggle={toggleModal}
    >
      <div className="mb-4">
        <img src={logo} alt="logo" className="inline float-end m-4 w-20 h-20" />
        {t('modals.about.content')}
        <div className="block flex justify-center">
          <ul className="flex flex-row gap-x-4 mt-4">
            <li>
              <a href="https://github.com/b310-digital/groupwriter/">
                {t('modals.about.linkSourceCode')}
              </a>
            </li>
            {import.meta.env.VITE_PRIVACY_STATEMENT_URL && (
              <li>
                <a href={import.meta.env.VITE_PRIVACY_STATEMENT_URL}>
                  {t('modals.about.linkPrivacy')}
                </a>
              </li>
            )}
            {import.meta.env.VITE_LEGAL_URL && (
              <li>
                <a href={import.meta.env.VITE_LEGAL_URL}>
                  {t('modals.about.linkLegal')}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="flex justify-start">
        <button className="btn-editor" onClick={toggleModal}>
          {t('buttons.close')}
        </button>
        {!readOnly && (
          <button
            className="btn-editor bg-red-600 text-white"
            onClick={() => void handleDeleteDocument()}
          >
            {t('modals.about.buttons.delete')}
          </button>
        )}
      </div>
    </Modal>
  );
}
