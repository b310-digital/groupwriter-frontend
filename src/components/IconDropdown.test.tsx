import { render, screen, fireEvent } from '@testing-library/react';
import { PaintBrushIcon } from '@heroicons/react/24/outline';
import IconDropdown from './IconDropdown';

describe('IconDropdown', () => {
  const mockOnSelect = vi.fn();
  const values = [
    { name: 'a', value: 'a', children: <div>a</div>, title: 'a' }
  ];

  it('toggles the visibility', () => {
    render(
      <IconDropdown
        title="test"
        icon={<PaintBrushIcon />}
        onSelect={mockOnSelect}
        values={values}
      />
    );
    const button = screen.getByTestId('icon-dropdown-button');

    // initially, it's hidden:
    expect(screen.queryByTestId('icon-dropdown-menu')).not.toBeInTheDocument();

    // it becomes visible after a click on button:
    fireEvent.click(button);
    expect(screen.queryByTestId('icon-dropdown-menu')).toBeVisible();

    // and does not get removed again after another click:
    fireEvent.click(button);
    expect(screen.queryByTestId('icon-dropdown-menu')).not.toBeInTheDocument();
  });

  it('calls the onSelect method with the correct value', () => {
    render(
      <IconDropdown
        title="test"
        icon={<PaintBrushIcon />}
        onSelect={mockOnSelect}
        values={values}
      />
    );

    const button = screen.getByTestId('icon-dropdown-button');
    fireEvent.click(button);

    const dropdownMenu = screen.getByTestId('icon-dropdown-menu');
    expect(dropdownMenu).toBeVisible();

    fireEvent.click(screen.getByText('a'));
    expect(mockOnSelect).toHaveBeenCalledWith(values[0]);
  });
});
