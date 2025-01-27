import { Editor } from '@tiptap/core';
import jsPDF from 'jspdf';
import exportHTML from '../assets/exportTemplate.html?raw';
import exportHTMLPdf from '../assets/exportTemplatePdf.html?raw';
import { commentRemoveRegex } from '@packages/tiptap-extension-comment-collaboration';
export const setEditorContentFromFile = async (
  editor: Editor,
  file: File | undefined
) => {
  if (editor && file) {
    editor.commands.setContent(
      (await file.text()).replace(commentRemoveRegex, '$1')
    );
  }
};

export const exportedHTMLLink = (editor: Editor): string => {
  if (!editor) return '';

  const parser = new DOMParser();
  const template = parser.parseFromString(exportHTML, 'text/html');
  const htmlWithoutComments = editor
    .getHTML()
    .replace(commentRemoveRegex, '$1');
  template.body.innerHTML = htmlWithoutComments;

  const blob = new Blob([template.documentElement.outerHTML], {
    type: 'text/html'
  });
  return URL.createObjectURL(blob);
};

export const exportedPDFLink = async (editor: Editor): Promise<string> => {
  if (!editor) return '';

  const parser = new DOMParser();
  // HTML2Canvas is buggy, therefore we need hacky workarounds and thus a different template
  const template = parser.parseFromString(exportHTMLPdf, 'text/html');

  const htmlWithoutComments = editor
    .getHTML()
    .replace(commentRemoveRegex, '$1');

  const pdfDoc = new jsPDF('p', 'px', 'letter');
  template.body = parser.parseFromString(htmlWithoutComments, 'text/html').body;

  // Note: Adding the wrapping div directly in the template does not work
  const wrappedHTML = `<div style="page-break-inside: avoid; font-size:8px; width:430px; word-break: break-all;">${template.documentElement.outerHTML}</div>`;

  await pdfDoc.html(wrappedHTML, {
    margin: 10
  });

  const blob = new Blob([pdfDoc.output('blob')], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};
