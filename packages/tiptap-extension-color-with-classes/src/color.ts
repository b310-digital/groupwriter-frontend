import '@tiptap/extension-text-style'

import { Extension } from '@tiptap/core'

export interface ColorWithClassesOptions {
  /**
   * The types where the color can be applied
   * @default ['textStyle']
   * @example ['heading', 'paragraph']
  */
  types: string[],
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    color: {
      /**
       * Set the text color
       * @param colorClass The color to set
       * @example editor.commands.setColor('red')
       */
      setColor: (colorClass: string) => ReturnType,

      /**
       * Unset the text color
       * @example editor.commands.unsetColor()
       */
      unsetColor: () => ReturnType,
    }
  }
}

/**
 * This extension allows you to color your text.
 * @see https://tiptap.dev/api/extensions/color
 */
export const ColorWithClasses = Extension.create<ColorWithClassesOptions>({
  name: 'colorWithClasses',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          colorClass: {
            default: null,
            renderHTML: attributes => {
              if (!attributes.colorClass) {
                return {}
              }

              return {
                class: `${attributes.colorClass}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setColor: colorClass => ({ chain }) => {
        return chain()
          .setMark('textStyle', { colorClass })
          .run()
      },
      unsetColor: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { colorClass: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})