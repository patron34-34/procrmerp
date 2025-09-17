
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose, lead }) => {
    const { addLead, employees } = useApp();
    const [formData, setFormData] = useState({
        name: '', company: '', email: '', phone: '', status: LeadStatus.New, source: 'Website', assignedToId: employees[0]?.id || 0
    });

    useEffect(() => {
        if (lead) setFormData(lead);
        else setFormData({ name: '', company: '', email: '', phone: '', status: LeadStatus.New, source: 'Website', assignedToId: employees[0]?.id || 0 });
    }, [lead, isOpen, employees]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addLead(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Potansiyel Müşteri Ekle/Düzenle">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="İsim" required className="w-full" />
                <input name="company" value={formData.company} onChange={handleChange} placeholder="Şirket" className="w-full" />
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="E-posta" className="w-full" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon" className="w-full" />
                <select name="status" value={formData.status} onChange={handleChange} className="w-full">
                    {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onClose}>İptal</Button><Button type="submit">Kaydet</Button></div>
            </form>
        </Modal>
    );
};

export default LeadFormModal;
