import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import DocumentPage from './DocumentPage';
import { randomUUID } from 'crypto';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

describe('DocumentPage', () => {
  it('editor is enabled with modificationSecret', () => {
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      hash: randomUUID()
    });

    const { container } = render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <DocumentPage documentId={randomUUID()} />
        </I18nextProvider>
      </MemoryRouter>
    );

    const element = container.querySelector('.tiptap');
    expect(element?.getAttribute('contenteditable')).toBeTruthy();
  });

  it('editor is disabled without modificationSecret', () => {
    const { container } = render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <DocumentPage documentId={randomUUID()} />
        </I18nextProvider>
      </MemoryRouter>
    );

    const element = container.querySelector('.tiptap');
    expect(element?.getAttribute('contenteditable')).toEqual('false');
  });

  it('navigates to / when the documentId is invalid', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/document/invalid']}>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route
              path="/document/invalid"
              element={<DocumentPage documentId="invalid" />}
            />
            <Route path="/" element={<div>Landing Page</div>} />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(container.textContent).toBe('Landing Page');
  });

  it('stays on the document page when the documentId is valid', () => {
    const uuid = randomUUID();
    const validLocation = `/document/${uuid}`;

    const { container } = render(
      <MemoryRouter initialEntries={[validLocation]}>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route
              path={validLocation}
              element={<DocumentPage documentId={uuid} />}
            />
            <Route path="/" element={<div>Landing Page</div>} />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(container.textContent).not.toBe('Landing Page');
    const element = container.querySelector('.tiptap');
    expect(element).toBeVisible();
  });
});
