import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Editor } from '@tiptap/core';
import IconDropdown, { DropdownValue } from './IconDropdown';
import { Level } from '@tiptap/extension-heading';
import { useTranslation } from 'react-i18next';
import tablerHtml from '../assets/tablerHtml.svg';
import tablerPdf from '../assets/tablerPdf.svg';
import { exportedHTMLLink, exportedPDFLink } from '../utils/editorExport';

const handlePDFExport = async (editor: Editor) => {
  if (editor) {
    const link = await exportedPDFLink(editor);
    const linkElement = document.createElement('a');

    linkElement.href = link;
    linkElement.download = 'download.pdf';
    linkElement.click();
  }
};

const handleHTMLExport = (editor: Editor) => {
  if (editor) {
    const link = exportedHTMLLink(editor);
    const linkElement = document.createElement('a');

    linkElement.href = link;
    linkElement.download = 'download.html';
    linkElement.click();
  }
};

const DownloadDropdown = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();
  const availableHeadings: DropdownValue<Level>[] = [
    {
      name: 'html',
      children: (
        <img src={tablerHtml} alt="Insert Table" width={16} height={16} />
      ),
      value: null,
      title: t('menuBar.buttons.download.html')
    },
    {
      name: 'pdf',
      children: (
        <img src={tablerPdf} alt="Insert Table" width={16} height={16} />
      ),
      value: null,
      title: t('menuBar.buttons.download.pdf')
    }
  ];

  const handleSelect = (dropdownValue: DropdownValue<Level>) => {
    if (!editor) return;

    if (dropdownValue.name === 'html') {
      handleHTMLExport(editor);
    } else {
      void handlePDFExport(editor);
    }
  };

  const textHeadingIcon = (
    <ArrowDownTrayIcon className="size-4" data-testid="text-heading-icon" />
  );

  return (
    <IconDropdown
      title={t('menuBar.buttons.download.title')}
      icon={textHeadingIcon}
      values={availableHeadings}
      onSelect={handleSelect}
    ></IconDropdown>
  );
};

export default DownloadDropdown;
