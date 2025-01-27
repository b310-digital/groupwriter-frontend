import { ReactNode } from 'react';

export default function FixedMenuBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white h-14 border-b border-neutral-200 z-50">
      {children}
    </div>
  );
}
