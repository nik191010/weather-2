import { createContext } from 'react';

interface MyContextType {
  darkMode: boolean;
}

export const MyContext = createContext<MyContextType | null>(null);
