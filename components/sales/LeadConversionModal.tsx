
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Lead } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface LeadConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}

const LeadConversionModal: React.FC<LeadConversionModalProps> = ({ isOpen, onClose, lead }) => {
    const { convertLead } = useApp();

    const handleConvert = () => {
        convertLead(lead.id);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${lead.name} kişisini dönüştür`}>
            <p>Bu işlem aşağıdaki kayıtları oluşturacaktır:</p>
            <ul className="list-disc list-inside my-4">
                <li><strong>Müşteri:</strong> {lead.company || lead.name}</li>
                <li><strong>İlgili Kişi:</strong> {lead.name}</li>
                <li><strong>Anlaşma:</strong> {lead.company || lead.name} Anlaşması</li>
            </ul>
            <p>Devam etmek istediğinizden emin misiniz?</p>
            <div className="flex justify-end gap-2 mt-4"><Button variant="secondary" onClick={onClose}>İptal</Button><Button onClick={handleConvert}>Dönüştür</Button></div>
        </Modal>
    );
};

export default LeadConversionModal;
