import { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { AboutModal } from './AboutModal';

const AboutButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <button
        title={t('menuBar.buttons.about')}
        onClick={toggleModal}
        disabled={false}
        className="btn-editor inline-block"
      >
        <InformationCircleIcon className="size-4" />
      </button>
      {isModalOpen && (
        <AboutModal isModalOpen={isModalOpen} toggleModal={toggleModal} />
      )}
    </>
  );
};

export default AboutButton;
