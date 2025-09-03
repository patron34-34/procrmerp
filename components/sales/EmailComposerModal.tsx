import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { CommunicationLogType, Customer } from '../../types';

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
}

const EmailComposerModal: React.FC<EmailComposerModalProps> = ({ isOpen, onClose, customer }) => {
    const { addCommunicationLog } = useApp();
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSend = () => {
        const emailContent = `Konu: ${subject}\n\n${body}`;
        addCommunicationLog(customer.id, CommunicationLogType.Email, emailContent);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="E-posta Gönder">
            <div className="space-y-4">
                <input value={`Alıcı: ${customer.email}`} readOnly className="w-full bg-slate-100 dark:bg-slate-800 p-2 rounded-md" />
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Konu" className="w-full" />
                <textarea value={body} onChange={e => setBody(e.target.value)} rows={8} className="w-full" />
                <div className="flex justify-end gap-2"><Button variant="secondary" onClick={onClose}>İptal</Button><Button onClick={handleSend}>Gönder</Button></div>
            </div>
        </Modal>
    );
};
export default EmailComposerModal;
