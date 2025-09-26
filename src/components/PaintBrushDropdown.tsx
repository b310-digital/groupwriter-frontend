import { PaintBrushIcon } from '@heroicons/react/24/outline';
import { Editor } from '@tiptap/core';
import IconDropdown, { DropdownValue } from './IconDropdown';
import { useTranslation } from 'react-i18next';

const PaintBrushDropdown = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();

  const renderDropdownValue = (
    className: string,
    previewClassName: string,
    value: string
  ) => {
    return (
      <div className={`${className} flex items-center`}>
        <div
          className={`h-4 w-4 inline-block rounded-sm ${previewClassName} border`}
        ></div>
        <span className="hidden lg:block ml-3 text-gray-700 font-medium ">
          {value}
        </span>
      </div>
    );
  };

  const availableColors: DropdownValue<string>[] = [
    {
      name: 'black',
      value: 'text-black',
      children: renderDropdownValue(
        'text-black',
        'bg-black',
        t('colors.black')
      ),
      title: t('colors.black')
    },
    {
      name: 'red',
      value: 'text-red-500',
      children: renderDropdownValue(
        'text-red-500',
        'bg-red-500',
        t('colors.red')
      ),
      title: t('colors.red')
    },
    {
      name: 'blue',
      value: 'text-blue-800',
      children: renderDropdownValue(
        'text-blue-800',
        'bg-blue-800',
        t('colors.blue')
      ),
      title: t('colors.blue')
    },
    {
      name: 'green',
      value: 'text-green-800',
      children: renderDropdownValue(
        'text-green-800',
        'bg-green-800',
        t('colors.green')
      ),
      title: t('colors.green')
    },
    {
      name: 'yellow',
      value: 'text-yellow-400',
      children: renderDropdownValue(
        'text-yellow-400',
        'bg-yellow-400',
        t('colors.yellow')
      ),
      title: t('colors.yellow')
    }
  ];

  const applyColor = (color: string): void => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
  };

  const unsetColor = (): void => {
    if (!editor) return;
    editor.chain().focus().unsetColor().run();
  };

  const currentColor = (): string => {
    return (editor.getAttributes('textStyle').colorClass as string) || '';
  };

  const handleSelect = (color: DropdownValue<string>) => {
    if (color && color.value !== '') {
      if (color.name == 'black') {
        unsetColor();
      } else {
        applyColor(color.value ?? '');
      }
    } else {
      unsetColor();
    }
  };

  const paintBrushIcon = (
    <PaintBrushIcon
      className={`size-4 ${currentColor() != '' ? currentColor() : ''}`}
      data-testid="paint-brush-icon"
    />
  );

  return (
    <IconDropdown
      title={t('menuBar.buttons.textColor')}
      icon={paintBrushIcon}
      values={availableColors}
      onSelect={handleSelect}
    ></IconDropdown>
  );
};

export default PaintBrushDropdown;
