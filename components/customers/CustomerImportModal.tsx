import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface CustomerImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MappedCustomer = Omit<Customer, 'id' | 'avatar'>;

const CustomerImportModal: React.FC<CustomerImportModalProps> = ({ isOpen, onClose }) => {
  const { importCustomers, employees } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  
  const customerFields: (keyof MappedCustomer)[] = ['name', 'company', 'email', 'phone', 'status', 'industry', 'tags', 'assignedToId', 'lastContact', 'leadSource'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        const headerRow = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const dataRows = rows.slice(1).map(row => row.split(',').map(d => d.trim().replace(/"/g, '')));
        
        setHeaders(headerRow);
        setData(dataRows);
        setStep(2);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleMappingChange = (header: string, field: string) => {
    setMapping(prev => ({ ...prev, [header]: field }));
  };
  
  const handleImport = () => {
    const defaultAssigneeId = employees[0]?.id || 0;
    const newCustomers: MappedCustomer[] = data.map(row => {
        const customer: Partial<MappedCustomer> = {};
        headers.forEach((header, index) => {
            const mappedField = mapping[header] as keyof MappedCustomer;
            if (mappedField) {
                 const value = row[index];
                 if (value) {
                     if (mappedField === 'tags') {
                         (customer[mappedField] as string[]) = value.split(';').map(t => t.trim());
                     } else if (mappedField === 'assignedToId') {
                         (customer[mappedField] as number) = parseInt(value) || defaultAssigneeId;
                     } else if (mappedField === 'status') {
                         const s = value.toLowerCase();
                         if (s === 'aktif' || s === 'kaybedilmiş' || s === 'potensiyel') {
                            customer[mappedField] = s;
                         }
                     } else {
                        (customer as any)[mappedField] = value;
                     }
                 }
            }
        });

        // Add defaults for required fields if missing
        customer.name = customer.name || customer.company || 'İsimsiz Müşteri';
        customer.company = customer.company || customer.name || 'Bilinmeyen Şirket';
        customer.email = customer.email || `no-email-${Date.now() + Math.random()}@example.com`;
        customer.status = customer.status || 'potensiyel';
        customer.assignedToId = customer.assignedToId || defaultAssigneeId;
        customer.tags = customer.tags || [];
        customer.lastContact = customer.lastContact || new Date().toISOString().split('T')[0];
        customer.phone = customer.phone || '';
        customer.industry = customer.industry || 'Bilinmiyor';
        customer.leadSource = customer.leadSource || 'İçe Aktarma';
        customer.billingAddress = customer.billingAddress || { country: 'Türkiye', city: '', district: '', streetAddress: '', postalCode: '', email: '', phone: '' };
        customer.shippingAddress = customer.shippingAddress || customer.billingAddress;


        return customer as MappedCustomer;
    });

    importCustomers(newCustomers);
    onClose();
    resetState();
  };

  const resetState = () => {
      setFile(null);
      setHeaders([]);
      setData([]);
      setMapping({});
      setStep(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); resetState(); }} title="Müşterileri İçeri Aktar">
      {step === 1 && (
        <div>
          <p className="mb-4 text-text-secondary dark:text-dark-text-secondary">Lütfen içeri aktarmak için bir CSV dosyası seçin.</p>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
            <h3 className="font-semibold">Sütunları Eşleştir</h3>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">CSV dosyanızdaki sütunları sistemdeki müşteri alanlarıyla eşleştirin.</p>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {headers.map(header => (
                <div key={header} className="grid grid-cols-2 gap-4 items-center">
                    <span className="font-medium truncate" title={header}>{header}</span>
                    <select 
                        onChange={(e) => handleMappingChange(header, e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border"
                        defaultValue=""
                    >
                        <option value="">Eşleştirme...</option>
                        {customerFields.map(field => (
                           <option key={field} value={field}>{field}</option>
                        ))}
                    </select>
                </div>
            ))}
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" onClick={resetState}>İptal</Button>
                <Button onClick={handleImport}>İçeri Aktar</Button>
            </div>
        </div>
      )}
    </Modal>
  );
};

export default CustomerImportModal;