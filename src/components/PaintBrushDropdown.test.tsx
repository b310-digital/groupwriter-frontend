import { render, screen } from '@testing-library/react';
import PaintBrushDropdown from './PaintBrushDropdown';
import { Editor } from '@tiptap/core';

vi.mock('@tiptap/core');

describe('PaintBrushDropdown', () => {
  const editorMock = new Editor();

  it('does not add a colored background by default', () => {
    const mockGetAttributes = vi.fn().mockReturnValue({});
    editorMock.getAttributes = mockGetAttributes;

    render(<PaintBrushDropdown editor={editorMock} />);

    // By default, there is no color added to the icon:
    const icon = screen.getByTestId('paint-brush-icon');
    expect(icon).toHaveClass('size-4', { exact: true });
  });

  it('adds a colored background by default', () => {
    const mockGetAttributes = vi
      .fn()
      .mockReturnValue({ colorClass: 'text-yellow-300' });
    editorMock.getAttributes = mockGetAttributes;

    render(<PaintBrushDropdown editor={editorMock} />);

    // the color is added to the icon since the colorClass was provided in the mock:
    const icon = screen.getByTestId('paint-brush-icon');
    expect(icon).toHaveClass('size-4 text-yellow-300', { exact: true });
  });
});
