import { ShareIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import Switch from './Switch';
import Modal from './Modal';
import { CopyButton } from './CopyButton';
import { useTranslation } from 'react-i18next';

const initQrCode = () =>
  new QRCodeStyling({
    width: 300,
    height: 300,
    type: 'svg',
    image: '',
    dotsOptions: {
      color: '#000000',
      type: 'dots'
    },
    cornersSquareOptions: {
      type: 'square'
    },
    cornersDotOptions: {
      type: 'dot'
    },
    backgroundOptions: {
      color: '#fff'
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 20
    }
  });

const urlWithouthHash = (urlHash: string): string => {
  return urlHash.split('#')[0];
};

const url = (readOnly: boolean): string => {
  const href = window.location.href;
  return readOnly ? urlWithouthHash(href) : href;
};

const ShareDocumentButton = () => {
  const { t } = useTranslation();
  const [qrCode] = useState<QRCodeStyling>(initQrCode());
  const qrCodeRef = useRef(null);
  const [locationUrl, setLocationUrl] = useState(url(false));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleReadOnly = () => {
    setReadOnly(!readOnly);
  };

  useEffect(() => {
    setLocationUrl(url(readOnly));
  }, [readOnly, window.location.href]);

  // append qr-code when modal is opened:
  useEffect(() => {
    if (qrCodeRef?.current === null) return;

    qrCode.append(qrCodeRef.current);
  }, [isModalOpen, qrCode]);

  // update the qr-code when readOnly is toggled
  useEffect(() => {
    qrCode.update({
      data: locationUrl
    });
  }, [locationUrl, qrCode]);

  const onDownload = useCallback(() => {
    void qrCode.download({
      extension: 'png'
    });
  }, [qrCode, locationUrl]);

  return (
    <>
      <button
        title={t('menuBar.buttons.share')}
        onClick={toggleModal}
        disabled={false}
        className="btn-editor inline-block"
      >
        <ShareIcon className="size-4" />
      </button>
      {isModalOpen && (
        <Modal
          header={t('modals.share.title')}
          isOpen={isModalOpen}
          onToggle={toggleModal}
        >
          <div className="flex justify-center mb-4">
            <div ref={qrCodeRef} />
          </div>

          <button onClick={onDownload}>
            {t('modals.share.buttons.download')}
          </button>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-600">
              {t('modals.share.readOnly')}
            </label>
            <Switch isOn={readOnly} onToggle={toggleReadOnly} />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={locationUrl}
              className="flex-1 p-2 border rounded-md"
            />
            <CopyButton contentToCopy={locationUrl} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ShareDocumentButton;
