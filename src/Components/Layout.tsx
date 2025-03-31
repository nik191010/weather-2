import React, { ReactNode, useContext } from 'react';
import { MyContext } from '../MyContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const context = useContext(MyContext);

  // check whether the context is here
  if (!context) {
    return <div className="min-h-screen bg-gray-100">Loading...</div>;
  }

  // Dark mode for the whole page
  const { darkMode } = context;

  return (
    <div
      className={`${!darkMode ? 'bg-(image:--blue-gradient)' : ''}
       dark:bg-neutral-900 text-white dark:text-(--dark-text) min-h-screen leading-[1] transition-colors duration-500`}
    >
      <div className="mx-auto w-[700px] max-w-full">
        <div className="container min-h-screen">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
