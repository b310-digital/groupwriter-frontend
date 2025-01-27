import { Extension } from '@tiptap/core'

interface ImageDeleteCallbackOptions {
  url: string;
  deleteCallback: (url: string) => void;
}

interface YSyncMeta {
  isChangeOrigin: boolean;
  isUndoRedoOperation: boolean;
}

export const ImageDeleteCallback = Extension.create<ImageDeleteCallbackOptions>({
  name: 'imageDeleteCallback',

  addOptions() {
    return {
      url: '',
      deleteCallback: () => void {}
    }
  },

  onTransaction({transaction}) {
    const srcs = new Set();
    transaction.doc.forEach((node) => {
      if (node.attrs.src && node.type.name === 'image') {
        srcs.add(node.attrs.src);
      }
    });
    transaction.before.forEach((node) => {
      const src = node?.attrs?.src as string | undefined
      if (src && node.type.name === 'image' && !srcs.has(src)) {
        // Only use the callback for local changes, ignore changes from the origin server
        const ySyncUpdate = transaction.getMeta('y-sync$') as YSyncMeta | undefined
        if (src?.startsWith(this.options.url) && !ySyncUpdate?.isChangeOrigin) {
          console.info('ImageDeleteCallback: Deleting image ', src)
          this.options.deleteCallback(src)
        }
      }
    });
  }
})
