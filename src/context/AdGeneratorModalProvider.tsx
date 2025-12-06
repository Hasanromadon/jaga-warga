'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import AdGeneratorModal from '@/components/AdGeneratorModal';

interface AdGeneratorModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AdGeneratorModalContext = createContext<
  AdGeneratorModalContextType | undefined
>(undefined);

export const useAdGeneratorModal = () => {
  const context = useContext(AdGeneratorModalContext);
  if (!context) {
    throw new Error(
      'useAdGeneratorModal must be used within an AdGeneratorModalProvider',
    );
  }
  return context;
};

export const AdGeneratorModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <AdGeneratorModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <AdGeneratorModal isOpen={isOpen} onClose={closeModal} />
    </AdGeneratorModalContext.Provider>
  );
};
