import React, { memo } from 'react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = memo(({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div>
        <p className="text-text-secondary dark:text-dark-text-secondary">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            İptal
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Sil
          </Button>
        </div>
      </div>
    </Modal>
  );
});

export default ConfirmationModal;
