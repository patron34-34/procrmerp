
import React, { useState, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { Employee, EgitimSeviyesi, Cinsiyet, CalismaStatusu, SigortaKolu, MedeniDurum } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { ICONS, SGK_TERMINATION_CODES, SGK_PROFESSION_CODES_SAMPLE, CINSIYET_OPTIONS, CALISMA_STATUSU_OPTIONS, SIGORTA_KOLU_OPTIONS, MEDENI_DURUM_OPTIONS, EGITIM_SEVIYELERI, SGK_INCENTIVE_CODES } from '../../../constants';

const AccordionSection: React.FC<{ title: string, children: ReactNode }> = ({ title, children }) => (
    <details className="border-b dark:border-dark-border last:border-b-0" open>
        <summary className="font-semibold text-lg py-3 cursor-pointer">{title}</summary>
        <div className="pb-4 pt-2 space-y-4">
            {children}
        </div>
    </details>
);

const Employees: React.FC = () => {
    const { employees, addEmployee, updateEmployee, deleteEmployee, hasPermission, roles } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const canManageEmployees = hasPermission('ik:goruntule');

    const today = new Date().toISOString().split('T')[0];
    const initialFormState: Omit<Employee, 'id' | 'avatar' | 'employeeId'> = {
        name: '', department: 'Satış', position: '', email: '', phone: '', hireDate: today, salary: 0,
        role: 'calisan', managerId: undefined, tcKimlikNo: '', sgkSicilNo: '', dogumTarihi: '',
        cinsiyet: 'Erkek', medeniDurum: 'Bekar', bakmaklaYukumluKisiSayisi: 0, esiCalisiyorMu: false,
        adres: '', uyruk: 'Türkiye', egitimSeviyesi: 'Lise', calismaStatusu: 'Tam Zamanlı',
        sigortaKolu: '4A', engellilikOrani: 0, vergiIndirimiVarMi: false, meslekKodu: '', meslekAdi: '',
        istenCikisTarihi: undefined, istenCikisNedeni: undefined, istenCikisKodu: undefined,
        besKesintisiVarMi: false, tesviktenYararlaniyorMu: false, tesvikKodu: undefined,
    };

    const [formData, setFormData] = useState(initialFormState);

    const openModalForNew = () => {
        setEditingEmployee(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const openModalForEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setFormData(employee);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (employeeToDelete) {
            deleteEmployee(employeeToDelete.id);
            setEmployeeToDelete(null);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        const isNumber = ['salary', 'managerId', 'bakmaklaYukumluKisiSayisi', 'engellilikOrani'].includes(name);

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (isNumber ? (parseInt(value) || 0) : value)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email) {
            if (editingEmployee) {
                updateEmployee({ ...editingEmployee, ...formData });
            } else {
                addEmployee(formData);
            }
            setIsModalOpen(false);
        }
    };

    const filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Card
                title="Tüm Çalışanlar"
                action={canManageEmployees && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Çalışan Ekle</span></Button>}
            >
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Çalışan, departman veya pozisyon ara..."
                        className="w-full md:w-1/3 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    {filteredEmployees.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">Çalışan</th><th className="p-3 font-semibold">Pozisyon</th><th className="p-3 font-semibold">Departman</th><th className="p-3 font-semibold">İşe Giriş Tarihi</th>{canManageEmployees && <th className="p-3 font-semibold">Eylemler</th>}
                            </tr></thead>
                            <tbody>
                                {filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 flex items-center gap-3">
                                            <img src={employee.avatar} alt={employee.name} className="h-10 w-10 rounded-full" />
                                            <div>
                                                <Link to={`/hr/employees/${employee.id}`} className="font-medium hover:underline text-primary-600">{employee.name}</Link>
                                                <p className="text-sm text-text-secondary">{employee.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-3">{employee.position}</td><td className="p-3">{employee.department}</td><td className="p-3">{employee.hireDate}</td>
                                        {canManageEmployees && <td className="p-3"><div className="flex items-center gap-2">
                                            <button onClick={() => openModalForEdit(employee)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                                            <button onClick={() => setEmployeeToDelete(employee)} className="text-slate-500 hover:text-red-600">{ICONS.trash}</button>
                                        </div></td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState icon={ICONS.employees} title="Çalışan Bulunamadı" description="Filtrelerinizi değiştirin veya yeni bir çalışan ekleyin." />
                    )}
                </div>
            </Card>

            {isModalOpen && canManageEmployees && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEmployee ? "Çalışanı Düzenle" : "Yeni Çalışan Ekle"} size="4xl">
                    <form onSubmit={handleSubmit}>
                        <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-2">
                             <AccordionSection title="Kişisel Bilgiler">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                     <InputField label="Ad Soyad *" name="name" value={formData.name} onChange={handleInputChange} required />
                                     <InputField label="E-posta *" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                                     <InputField label="Telefon" name="phone" value={formData.phone} onChange={handleInputChange} />
                                     <InputField label="T.C. Kimlik No" name="tcKimlikNo" value={formData.tcKimlikNo || ''} onChange={handleInputChange} />
                                     <InputField label="Doğum Tarihi" name="dogumTarihi" type="date" value={formData.dogumTarihi || ''} onChange={handleInputChange} />
                                     <SelectField label="Cinsiyet" name="cinsiyet" value={formData.cinsiyet} onChange={handleInputChange} options={CINSIYET_OPTIONS} />
                                     <SelectField label="Medeni Durum" name="medeniDurum" value={formData.medeniDurum} onChange={handleInputChange} options={MEDENI_DURUM_OPTIONS} />
                                     <InputField label="Bakmakla Yükümlü Kişi Sayısı" name="bakmaklaYukumluKisiSayisi" type="number" value={formData.bakmaklaYukumluKisiSayisi} onChange={handleInputChange} />
                                     <CheckboxField label="Eşi Çalışıyor mu?" name="esiCalisiyorMu" checked={formData.esiCalisiyorMu} onChange={handleInputChange} />
                                </div>
                             </AccordionSection>
                             <AccordionSection title="İstihdam Bilgileri">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <InputField label="Departman" name="department" value={formData.department} onChange={handleInputChange} />
                                    <InputField label="Pozisyon" name="position" value={formData.position} onChange={handleInputChange} />
                                    <InputField label="İşe Giriş Tarihi" name="hireDate" type="date" value={formData.hireDate} onChange={handleInputChange} />
                                    <SelectField label="Çalışma Statüsü" name="calismaStatusu" value={formData.calismaStatusu} onChange={handleInputChange} options={CALISMA_STATUSU_OPTIONS} />
                                    <SelectField label="Yönetici" name="managerId" value={formData.managerId} onChange={handleInputChange} options={[{id: 0, name: "Yönetici Yok"}, ...employees]} isObject />
                                    <SelectField label="Sistem Rolü" name="role" value={formData.role} onChange={handleInputChange} options={roles} isObject />
                                </div>
                             </AccordionSection>
                            <AccordionSection title="SGK & Bordro Bilgileri">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <InputField label="Brüt Maaş" name="salary" type="number" step="0.01" value={formData.salary} onChange={handleInputChange} />
                                    <SelectField label="Sigorta Kolu" name="sigortaKolu" value={formData.sigortaKolu} onChange={handleInputChange} options={SIGORTA_KOLU_OPTIONS} />
                                    <InputField label="SGK Sicil No" name="sgkSicilNo" value={formData.sgkSicilNo || ''} onChange={handleInputChange} />
                                    <InputField label="SGK Meslek Kodu" name="meslekKodu" value={formData.meslekKodu || ''} onChange={handleInputChange} />
                                    <InputField label="Engellilik Oranı (%)" name="engellilikOrani" type="number" value={formData.engellilikOrani} onChange={handleInputChange} />
                                    <CheckboxField label="Vergi İndirimi" name="vergiIndirimiVarMi" checked={formData.vergiIndirimiVarMi} onChange={handleInputChange} />
                                    <CheckboxField label="BES Kesintisi" name="besKesintisiVarMi" checked={formData.besKesintisiVarMi} onChange={handleInputChange} />
                                </div>
                            </AccordionSection>
                             <AccordionSection title="Teşvik Bilgileri">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <CheckboxField label="Teşvikten Yararlanıyor mu?" name="tesviktenYararlaniyorMu" checked={formData.tesviktenYararlaniyorMu} onChange={handleInputChange} />
                                    <SelectField label="Teşvik Kodu" name="tesvikKodu" value={formData.tesvikKodu} onChange={handleInputChange} options={SGK_INCENTIVE_CODES.map(c => `${c.code} - ${c.description}`)} />
                                </div>
                             </AccordionSection>
                        </div>
                        <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border mt-4">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                            <Button type="submit">{editingEmployee ? "Güncelle" : "Ekle"}</Button>
                        </div>
                    </form>
                </Modal>
            )}

            {canManageEmployees && <ConfirmationModal isOpen={!!employeeToDelete} onClose={() => setEmployeeToDelete(null)} onConfirm={handleDeleteConfirm} title="Çalışanı Sil" message={`'${employeeToDelete?.name}' adlı çalışanı kalıcı olarak silmek istediğinizden emin misiniz?`} />}
        </>
    );
};

// Form Helper Components
const InputField: React.FC<any> = ({ label, ...props }) => (
    <div><label className="block text-sm font-medium">{label}</label><input {...props} className="mt-1 w-full" /></div>
);
const SelectField: React.FC<any> = ({ label, options, isObject, ...props }) => (
    <div><label className="block text-sm font-medium">{label}</label><select {...props} className="mt-1 w-full">
        {isObject ? options.map((opt: any) => <option key={opt.id} value={opt.id}>{opt.name}</option>) : options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select></div>
);
const CheckboxField: React.FC<any> = ({ label, ...props }) => (
    <div className="flex items-center h-full pt-6"><label className="flex items-center gap-2"><input type="checkbox" {...props} /><span>{label}</span></label></div>
);


export default Employees;
