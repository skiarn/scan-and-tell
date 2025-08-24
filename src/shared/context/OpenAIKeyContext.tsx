import React, { createContext, useContext, useState, ReactNode } from 'react';

type OpenAIKeyContextType = {
  openaiKey: string;
  setOpenaiKey: (key: string) => void;
};

const OpenAIKeyContext = createContext<OpenAIKeyContextType | undefined>(undefined);

export const OpenAIKeyProvider = ({ children }: { children: ReactNode }) => {
  const [openaiKey, setOpenaiKey] = useState('');

  return (
    <OpenAIKeyContext.Provider value={{ openaiKey, setOpenaiKey }}>
      {children}
    </OpenAIKeyContext.Provider>
  );
};

export const useOpenAIKey = () => {
  const context = useContext(OpenAIKeyContext);
  if (!context) {
    throw new Error('useOpenAIKey must be used within an OpenAIKeyProvider');
  }
  return context;
};
