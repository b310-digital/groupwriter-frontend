import { useEffect, useState } from 'react';

export interface DropdownValue<T> {
  name: string;
  children: React.ReactNode;
  title: string;
  value: T | null;
}

const IconDropdown = <T,>({
  title,
  icon,
  values,
  onSelect
}: {
  title: string;
  icon: React.ReactElement;
  values: DropdownValue<T>[];
  onSelect: (value: DropdownValue<T>) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSelect = (value: DropdownValue<T>) => {
    onSelect(value);

    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClick = () => {
      setIsDropdownOpen(false);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [icon, values]);

  return (
    <>
      <div>
        <button
          title={title}
          onClick={(event) => {
            event.stopPropagation();
            toggleDropdown();
          }}
          className="btn-editor"
          data-testid="icon-dropdown-button"
        >
          {icon}
        </button>
        {isDropdownOpen && (
          <div
            className="absolute z-10 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black/5"
            data-testid="icon-dropdown-menu"
          >
            <div className="py-1">
              {values.map((option) => (
                <div
                  title={option.title}
                  key={option.name}
                  className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSelect(option);
                  }}
                >
                  {option.children}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default IconDropdown;
