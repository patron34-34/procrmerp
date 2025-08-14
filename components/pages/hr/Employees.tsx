

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { Employee, EgitimSeviyesi, Cinsiyet, CalismaStatusu, SigortaKolu, MedeniDurum } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { ICONS, SGK_TERMINATION_CODES, SGK_PROFESSION_CODES_SAMPLE, CINSIYET_OPTIONS, CALISMA_STATUSU_OPTIONS, SIGORTA_KOLU_OPTIONS, MEDENI_DURUM_OPTIONS, EGITIM_SEVIYELERI } from '../../../constants';

const Employees: React.FC = () => {
    const { employees, addEmployee, updateEmployee, deleteEmployee, hasPermission, roles } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isTerminated, setIsTerminated] = useState(false);
    const [selectedProfession, setSelectedProfession] = useState<{ code: string; description: string } | null>(null);

    const canManageUsers = hasPermission('kullanici:yonet');
    const canViewSalaries = hasPermission('ik:maas-goruntule');

    const initialFormState: Omit<Employee, 'id' | 'avatar' | 'employeeId'> = {
        name: '', department: '', position: '', email: '', phone: '',
        hireDate: new Date().toISOString().split('T')[0],
        salary: 0,
        role: roles.find(r => r.name === 'Satış')?.id || (roles[0]?.id || ''),
        tcKimlikNo: '', sgkSicilNo: '', dogumTarihi: '', cinsiyet: 'Erkek',
        medeniDurum: 'Bekar', bakmaklaYukumluKisiSayisi: 0, esiCalisiyorMu: false,
        adres: '', uyruk: 'T.C.',
        egitimSeviyesi: 'Lisans', calismaStatusu: 'Tam Zamanlı', sigortaKolu: '4A',
        engellilikOrani: 0, vergiIndirimiVarMi: false,
        meslekKodu: '', meslekAdi: '', istenCikisTarihi: undefined,
        istenCikisNedeni: undefined, istenCikisKodu: undefined, besKesintisiVarMi: true,
    };
    const [formData, setFormData] = useState<Omit<Employee, 'id' | 'avatar' | 'employeeId'>>(initialFormState);

    useEffect(() => {
        if (editingEmployee) {
            setFormData({ ...initialFormState, ...editingEmployee });
            setIsTerminated(!!editingEmployee.istenCikisTarihi);
            const profession = SGK_PROFESSION_CODES_SAMPLE.find(p => p.code === editingEmployee.meslekKodu);
            setSelectedProfession(profession || null);
        } else {
            setFormData(initialFormState);
            setIsTerminated(false);
            setSelectedProfession(null);
        }
    }, [editingEmployee, isModalOpen]);

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingEmployee(null);
        setIsTerminated(false);
        setSelectedProfession(null);
    };

    const openModalForNew = () => {
        if (!canManageUsers) return;
        resetForm();
        setIsModalOpen(true);
    };

    const openModalForEdit = (employee: Employee) => {
        if (!canManageUsers) return;
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }

        if (name === 'meslekKodu') {
            const profession = SGK_PROFESSION_CODES_SAMPLE.find(p => p.code === value || p.description.toLowerCase().includes(value.toLowerCase()));
            setSelectedProfession(profession || null);
            setFormData(prev => ({ ...prev, meslekKodu: value, meslekAdi: profession?.description || '' }));
            
            const validCode = SGK_PROFESSION_CODES_SAMPLE.find(p => p.code === value);
            if (validCode) {
                 setFormData(prev => ({ ...prev, meslekKodu: validCode.code, meslekAdi: validCode.description }));
                 setSelectedProfession(validCode);
            }

        } else {
            const isNumber = ['salary', 'engellilikOrani', 'bakmaklaYukumluKisiSayisi'].includes(name);
            setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
        }
    };

    const handleTerminationCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        const reason = SGK_TERMINATION_CODES.find(c => c.code === code)?.description || '';
        setFormData(prev => ({ ...prev, istenCikisKodu: code, istenCikisNedeni: reason }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.department && formData.position) {
            let finalData = { ...formData };
            if (!isTerminated) {
                finalData.istenCikisTarihi = undefined;
                finalData.istenCikisNedeni = undefined;
                finalData.istenCikisKodu = undefined;
            }

            if (editingEmployee) {
                updateEmployee({ ...editingEmployee, ...finalData });
            } else {
                addEmployee(finalData);
            }
            setIsModalOpen(false);
            resetForm();
        } else {
            alert("Lütfen tüm zorunlu alanları doldurun.");
        }
    };
    
    const handleDeleteConfirm = () => {
        if(employeeToDelete) {
            deleteEmployee(employeeToDelete.id);
            setEmployeeToDelete(null);
        }
    };

    const filteredEmployees = employees.filter(e => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Card
                title="Tüm Çalışanlar"
                action={canManageUsers && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Çalışan</span></Button>}
            >
                <div className="mb-4">
                    <input 
                        type="text"
                        placeholder="Çalışan ara (İsim, ID, Departman...)"
                        className="w-full md:w-1/3 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:border-dark-border dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    {filteredEmployees.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 dark:border-dark-border">
                                <tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-4 font-semibold">Çalışan</th>
                                    <th className="p-4 font-semibold">Departman</th>
                                    <th className="p-4 font-semibold">Pozisyon</th>
                                    {canViewSalaries && <th className="p-4 font-semibold">Maaş</th>}
                                    <th className="p-4 font-semibold">Durum</th>
                                    {canManageUsers && <th className="p-4 font-semibold">Eylemler</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                        <td className="p-4 flex items-center">
                                            <img src={employee.avatar} alt={employee.name} className="h-10 w-10 rounded-full mr-4" />
                                            <div>
                                                <Link to={`/hr/employees/${employee.id}`} className="font-medium hover:text-primary-600 dark:hover:text-primary-400">{employee.name}</Link>
                                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{employee.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{employee.department}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{employee.position}</td>
                                        {canViewSalaries && <td className="p-4 font-semibold text-text-main dark:text-dark-text-main">${employee.salary.toLocaleString()}</td>}
                                        <td className="p-4">
                                            {employee.istenCikisTarihi ? 
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Ayrıldı</span> : 
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Aktif</span>}
                                        </td>
                                        {canManageUsers && <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => openModalForEdit(employee)} className="text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">{ICONS.edit}</button>
                                                <button onClick={() => setEmployeeToDelete(employee)} className="text-slate-500 hover:text-red-600 dark:hover:text-red-500">{ICONS.trash}</button>
                                            </div>
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.employees}
                            title="Henüz Çalışan Yok"
                            description="İlk çalışanınızı ekleyerek başlayın."
                            action={canManageUsers ? <Button onClick={openModalForNew}>Çalışan Ekle</Button> : undefined}
                        />
                    )}
                </div>
            </Card>

            {canManageUsers && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEmployee ? "Çalışanı Düzenle" : "Yeni Çalışan Ekle"}>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <details open>
                        <summary className="font-semibold text-lg py-2 border-b dark:border-dark-border">Kişisel Bilgiler</summary>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                            <InputField label="Ad Soyad *" name="name" value={formData.name} onChange={handleInputChange} required />
                            <InputField label="TC Kimlik No" name="tcKimlikNo" value={formData.tcKimlikNo} onChange={handleInputChange} />
                            <InputField label="Doğum Tarihi" name="dogumTarihi" value={formData.dogumTarihi} onChange={handleInputChange} type="date" />
                            <SelectField label="Cinsiyet" name="cinsiyet" value={formData.cinsiyet} onChange={handleInputChange} options={CINSIYET_OPTIONS} />
                            <SelectField label="Medeni Durum" name="medeniDurum" value={formData.medeniDurum} onChange={handleInputChange} options={MEDENI_DURUM_OPTIONS} />
                            {formData.medeniDurum === 'Evli' && (
                                <CheckboxField label="Eşi Çalışıyor mu?" name="esiCalisiyorMu" checked={formData.esiCalisiyorMu} onChange={handleInputChange} className="flex items-end pb-2" />
                            )}
                            <InputField label="Bakmakla Yükümlü Kişi Sayısı" name="bakmaklaYukumluKisiSayisi" value={formData.bakmaklaYukumluKisiSayisi} onChange={handleInputChange} type="number" />
                            <InputField label="Uyruk" name="uyruk" value={formData.uyruk} onChange={handleInputChange} />
                            <SelectField label="Eğitim Seviyesi" name="egitimSeviyesi" value={formData.egitimSeviyesi} onChange={handleInputChange} options={EGITIM_SEVIYELERI} />
                            <InputField label="E-posta *" name="email" value={formData.email} onChange={handleInputChange} type="email" required />
                            <InputField label="Telefon" name="phone" value={formData.phone} onChange={handleInputChange} />
                            <div className="lg:col-span-3">
                                <label className="block text-sm font-medium">Adres</label>
                                <textarea name="adres" value={formData.adres} onChange={handleInputChange} rows={2} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                            </div>
                        </div>
                    </details>
                    
                    <details open>
                        <summary className="font-semibold text-lg py-2 border-b dark:border-dark-border">İstihdam & SGK Bilgileri</summary>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                            <InputField label="Departman *" name="department" value={formData.department} onChange={handleInputChange} required />
                            <InputField label="Pozisyon *" name="position" value={formData.position} onChange={handleInputChange} required />
                            <InputField label="İşe Giriş Tarihi *" name="hireDate" value={formData.hireDate} onChange={handleInputChange} type="date" required />
                            <InputField label="SGK Sicil Numarası" name="sgkSicilNo" value={formData.sgkSicilNo} onChange={handleInputChange} />
                            <SelectField label="Çalışma Statüsü" name="calismaStatusu" value={formData.calismaStatusu} onChange={handleInputChange} options={CALISMA_STATUSU_OPTIONS} />
                            <SelectField label="Sigorta Kolu" name="sigortaKolu" value={formData.sigortaKolu} onChange={handleInputChange} options={SIGORTA_KOLU_OPTIONS} />
                            {canViewSalaries && <InputField label="Maaş" name="salary" value={formData.salary} onChange={handleInputChange} type="number" />}
                            <div>
                                <label className="block text-sm font-medium">SGK Meslek Kodu</label>
                                <input list="profession-codes" name="meslekKodu" value={formData.meslekKodu || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" placeholder="Kod/isim ile ara..." />
                                <datalist id="profession-codes">
                                    {SGK_PROFESSION_CODES_SAMPLE.map(p => <option key={p.code} value={p.code}>{p.description}</option>)}
                                </datalist>
                                {selectedProfession && <p className="text-xs text-slate-500 mt-1">{selectedProfession.description}</p>}
                            </div>
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 gap-4">
                                <InputField label="Engellilik Oranı (%)" name="engellilikOrani" value={formData.engellilikOrani} onChange={handleInputChange} type="number" />
                                <div className="flex items-end pb-2">
                                    <CheckboxField label="Vergi İndirimi" name="vergiIndirimiVarMi" checked={formData.vergiIndirimiVarMi} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                    </details>
                    
                    <details>
                        <summary className="font-semibold text-lg py-2 border-b dark:border-dark-border">Diğer Ayarlar</summary>
                         <div className="pt-4 flex flex-col gap-4">
                            <CheckboxField label="Otomatik BES Kesintisi Uygula" name="besKesintisiVarMi" checked={formData.besKesintisiVarMi} onChange={handleInputChange} />
                            <div>
                                <label className="flex items-center">
                                    <input type="checkbox" checked={isTerminated} onChange={(e) => setIsTerminated(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
                                    <span className="ml-2">Çalışanın işten ayrılışını işle</span>
                                </label>
                            </div>
                            {isTerminated && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50 dark:border-dark-border">
                                    <InputField label="İşten Çıkış Tarihi" name="istenCikisTarihi" value={formData.istenCikisTarihi || ''} onChange={handleInputChange} type="date" />
                                    <div>
                                        <label className="block text-sm font-medium">SGK İşten Çıkış Kodu</label>
                                        <select value={formData.istenCikisKodu || ''} onChange={handleTerminationCodeChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                                            <option value="">Seçiniz...</option>
                                            {SGK_TERMINATION_CODES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.description}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium">İşten Çıkış Nedeni</label>
                                        <input type="text" value={formData.istenCikisNedeni || ''} readOnly className="mt-1 w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-700 dark:border-dark-border"/>
                                    </div>
                                </div>
                            )}
                         </div>
                    </details>

                    <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                        <Button type="submit">{editingEmployee ? "Güncelle" : "Ekle"}</Button>
                    </div>
                </form>
            </Modal>}

            {canManageUsers && <ConfirmationModal 
                isOpen={!!employeeToDelete}
                onClose={() => setEmployeeToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Çalışanı Sil"
                message={`'${employeeToDelete?.name}' adlı çalışanı kalıcı olarak silmek istediğinizden emin misiniz?`}
            />}
        </>
    );
};

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <input {...props} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
    </div>
);

const SelectField: React.FC<any> = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <select {...props} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const CheckboxField: React.FC<any> = ({ label, className = '', ...props }) => (
    <label className={`flex items-center ${className}`}>
        <input type="checkbox" {...props} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
        <span className="ml-2">{label}</span>
    </label>
);

export default Employees;
