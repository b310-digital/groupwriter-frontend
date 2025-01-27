import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  test('if component is loading', () => {
    render(<CopyButton contentToCopy="Content to copy"></CopyButton>);
    expect(screen.getByText(/Copy/i)).toBeDefined();
  });

  test('if button is clicked', async () => {
    // Mock the clipboard API
    const writeTextMock = vi.fn(() => Promise.resolve());
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: writeTextMock
      }
    });

    const textToCopy = 'text to copy';

    render(<CopyButton contentToCopy={textToCopy}></CopyButton>);

    fireEvent.click(screen.getByText('modals.share.buttons.copy'));

    await waitFor(() => {
      expect(screen.getByText(/Copied/i)).toBeDefined();
    });

    expect(writeTextMock).toHaveBeenCalledWith(textToCopy);
  });
});
