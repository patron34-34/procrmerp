import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface RecurringTaskUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scope: 'this' | 'all') => void;
}

const RecurringTaskUpdateModal: React.FC<RecurringTaskUpdateModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tekrarlanan Görevi Düzenle">
      <div className="space-y-4">
        <p>Bu, tekrarlanan bir görevin bir örneğidir. Hangi görevleri güncellemek istersiniz?</p>
        <div className="flex flex-col space-y-2">
          <Button onClick={() => onConfirm('this')} variant="secondary" className="w-full justify-start p-4">
            Sadece bu görev
          </Button>
          <Button variant="secondary" className="w-full justify-start p-4" disabled>
            Bu ve sonraki görevler (Yakında)
          </Button>
          <Button onClick={() => onConfirm('all')} variant="secondary" className="w-full justify-start p-4">
            Serideki tüm görevler
          </Button>
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="secondary">İptal</Button>
        </div>
      </div>
    </Modal>
  );
};

export default RecurringTaskUpdateModal;