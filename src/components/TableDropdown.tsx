import { TableCellsIcon } from '@heroicons/react/24/solid';
import { Editor } from '@tiptap/core';
import IconDropdown, { DropdownValue } from './IconDropdown';
import { useTranslation } from 'react-i18next';
import tablerColumnInsert from '../assets/tablerColumnInsert.svg';
import tablerColumnRemove from '../assets/tablerColumnRemove.svg';
import tablerRowInsert from '../assets/tablerRowInsert.svg';
import tablerRowRemove from '../assets/tablerRowRemove.svg';
import tablerTablePlus from '../assets/tablerTablePlus.svg';

const TableDropdown = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();
  const availableActions = [
    {
      name: 'insertTable',
      children: (
        <img src={tablerTablePlus} alt="Insert Table" width={16} height={16} />
      ),
      value: 'insertTable',
      title: t('menuBar.buttons.table.insertTable')
    },
    {
      name: 'addColumnAfter',
      children: (
        <img
          src={tablerColumnInsert}
          alt="Insert Table"
          width={16}
          height={16}
        />
      ),
      value: 'addColumnAfter',
      title: t('menuBar.buttons.table.addColumnAfter')
    },
    {
      name: 'deleteColumn',
      children: (
        <img
          src={tablerColumnRemove}
          alt="Insert Table"
          width={16}
          height={16}
        />
      ),
      value: 'deleteColumn',
      title: t('menuBar.buttons.table.deleteColumn')
    },
    {
      name: 'addRowAfter',
      children: (
        <img src={tablerRowInsert} alt="Insert Table" width={16} height={16} />
      ),
      value: 'addRowAfter',
      title: t('menuBar.buttons.table.addRowAfter')
    },
    {
      name: 'deleteRow',
      children: (
        <img src={tablerRowRemove} alt="Insert Table" width={16} height={16} />
      ),
      value: 'deleteRow',
      title: t('menuBar.buttons.table.deleteRow')
    }
  ];

  const handleSelect = (dropdownValue: DropdownValue<string>) => {
    if (!editor) return;

    if (dropdownValue.name === 'addColumnAfter') {
      editor.chain().focus().addColumnAfter().run();
    } else if (dropdownValue.name === 'deleteColumn') {
      editor.chain().focus().deleteColumn().run();
    } else if (dropdownValue.name === 'addRowAfter') {
      editor.chain().focus().addRowAfter().run();
    } else if (dropdownValue.name === 'deleteRow') {
      editor.chain().focus().deleteRow().run();
    } else if (dropdownValue.name === 'insertTable') {
      editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
    }
  };

  const tableIcon = (
    <TableCellsIcon className="size-4" data-testid="text-table-icon" />
  );

  return (
    <IconDropdown
      title={t('menuBar.buttons.table.title')}
      icon={tableIcon}
      values={availableActions}
      onSelect={handleSelect}
    ></IconDropdown>
  );
};

export default TableDropdown;
