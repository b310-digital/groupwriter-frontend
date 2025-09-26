import {
  Bars3CenterLeftIcon,
  H1Icon,
  H2Icon,
  H3Icon
} from '@heroicons/react/24/outline';
import { Editor } from '@tiptap/core';
import IconDropdown, { DropdownValue } from './IconDropdown';
import { Level } from '@tiptap/extension-heading';
import { useTranslation } from 'react-i18next';

const TextHeadingDropdown = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();
  const availableHeadings: DropdownValue<Level>[] = [
    {
      name: 'paragraph',
      children: <Bars3CenterLeftIcon className="size-4" />,
      value: null,
      title: t('menuBar.buttons.heading.paragraph')
    },
    {
      name: 'h1',
      children: <H1Icon className="size-4" />,
      value: 1,
      title: t('menuBar.buttons.heading.h1')
    },
    {
      name: 'h2',
      children: <H2Icon className="size-4" />,
      value: 2,
      title: t('menuBar.buttons.heading.h2')
    },
    {
      name: 'h3',
      children: <H3Icon className="size-4" />,
      value: 3,
      title: t('menuBar.buttons.heading.h3')
    }
  ];

  const handleSelect = (dropdownValue: DropdownValue<Level>) => {
    if (!editor) return;

    if (dropdownValue.value === null) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: dropdownValue.value })
        .run();
    }
  };

  const textHeadingIcon = (
    <H1Icon className="size-4" data-testid="text-heading-icon" />
  );

  return (
    <IconDropdown
      title={t('menuBar.buttons.heading.title')}
      icon={textHeadingIcon}
      values={availableHeadings}
      onSelect={handleSelect}
    ></IconDropdown>
  );
};

export default TextHeadingDropdown;
