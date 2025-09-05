"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ContractHolderContextType {
  isContractHolder: boolean;
  setIsContractHolder: (isHolder: boolean) => void;
}

const ContractHolderContext = createContext<ContractHolderContextType | undefined>(undefined);

export function ContractHolderProvider({ children }: { children: ReactNode }) {
  const [isContractHolder, setIsContractHolder] = useState<boolean>(() => {
    try {
      const item = window.localStorage.getItem('isContractHolder');
      return item ? JSON.parse(item) : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('isContractHolder', JSON.stringify(isContractHolder));
    } catch (error) {
      console.error(error);
    }
  }, [isContractHolder]);

  return (
    <ContractHolderContext.Provider value={{ isContractHolder, setIsContractHolder }}>
      {children}
    </ContractHolderContext.Provider>
  );
}

export function useContractHolder() {
  const context = useContext(ContractHolderContext);
  if (context === undefined) {
    throw new Error('useContractHolder must be used within a ContractHolderProvider');
  }
  return context;
}
