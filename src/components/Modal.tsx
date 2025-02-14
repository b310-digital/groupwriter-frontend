import { XMarkIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';

const Modal = ({
  header,
  isOpen,
  onToggle,
  children
}: {
  header: string;
  isOpen: boolean;
  onToggle?: () => void;
  children: ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{header}</h2>
          {onToggle && (
            <button
              onClick={onToggle}
              className="text-neutral-500 hover:text-neutral-700 border-none bg-transparent"
            >
              <XMarkIcon className="size-5" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
