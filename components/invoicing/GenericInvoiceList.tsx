

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, Bill, Customer, Supplier, InvoiceStatus, BillStatus } from '../../types';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { exportInvoicesToCSV, exportInvoicesToXML } from '../../utils/invoiceExporter';
import InvoicePreviewModal from './InvoicePreviewModal';
import PrintableInvoiceList from './PrintableInvoiceList';
import FilterPopover from '../ui/FilterPopover';
import Card from '../ui/Card';

type Entity = Customer | Supplier;

interface GenericInvoiceListProps {
    title: string;
    invoices: (Invoice | Bill)[];
    entities: Entity[];
    entityType: 'customer' | 'supplier';
    entityLabel: string;
    bulkActions?: { label: string; handler: (selectedIds: number[]) => void; variant?: 'primary' | 'secondary' | 'danger' }[];
    showSelectAll?: boolean;
}

const GenericInvoiceList: React.FC<GenericInvoiceListProps> = ({ title, invoices, entities, entityType, entityLabel, bulkActions = [], showSelectAll = false }) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [previewingInvoice, setPreviewingInvoice] = useState<Invoice | Bill | null>(null);
    const [invoicesToPrint, setInvoicesToPrint] = useState<(Invoice|Bill)[] | null>(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [advancedFilters, setAdvancedFilters] = useState({
        minAmount: '',
        maxAmount: '',
        entityId: 'all',
        invoiceType: 'all',
        eInvoiceScenario: 'all',
    });

    const isAnyAdvancedFilterActive = useMemo(() => {
        return advancedFilters.minAmount !== '' ||
               advancedFilters.maxAmount !== '' ||
               advancedFilters.entityId !== 'all';
    }, [advancedFilters]);

    const filteredAndSortedInvoices = useMemo(() => {
        return invoices
            .filter(inv => {
                const entityName = 'customerId' in inv ? inv.customerName : inv.supplierName;
                const invoiceNumber = 'invoiceNumber' in inv ? inv.invoiceNumber : inv.billNumber;
                const searchableText = `${invoiceNumber} ${entityName}`.toLowerCase();
                const date = new Date(inv.issueDate);
                const totalAmount = 'grandTotal' in inv ? inv.grandTotal : inv.totalAmount;

                const searchMatch = searchableText.includes(searchTerm.toLowerCase());
                const startDateMatch = !dateRange.start || date >= new Date(dateRange.start);
                const endDateMatch = !dateRange.end || date <= new Date(new Date(dateRange.end).setHours(23, 59, 59, 999));
                
                // Advanced Filters
                const minAmountMatch = !advancedFilters.minAmount || totalAmount >= parseFloat(advancedFilters.minAmount);
                const maxAmountMatch = !advancedFilters.maxAmount || totalAmount <= parseFloat(advancedFilters.maxAmount);
                const entityMatch = advancedFilters.entityId === 'all' || ('customerId' in inv && inv.customerId === parseInt(advancedFilters.entityId)) || ('supplierId' in inv && inv.supplierId === parseInt(advancedFilters.entityId));
                const typeMatch = advancedFilters.invoiceType === 'all' || !('invoiceType' in inv) || inv.invoiceType === advancedFilters.invoiceType;
                const scenarioMatch = advancedFilters.eInvoiceScenario === 'all' || !('scenario' in inv) || inv.scenario === advancedFilters.eInvoiceScenario;

                return searchMatch && startDateMatch && endDateMatch && minAmountMatch && maxAmountMatch && entityMatch && typeMatch && scenarioMatch;
            })
            .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    }, [invoices, searchTerm, dateRange, advancedFilters]);
    
    const paginatedInvoices = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedInvoices.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedInvoices, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredAndSortedInvoices.length / itemsPerPage);

    useEffect(() => {
        if (invoicesToPrint) {
            const handleAfterPrint = () => {
                setInvoicesToPrint(null);
                window.removeEventListener('afterprint', handleAfterPrint);
            };
            window.addEventListener('afterprint', handleAfterPrint);
            const printTimeout = setTimeout(() => window.print(), 50);
            return () => {
                clearTimeout(printTimeout);
                window.removeEventListener('afterprint', handleAfterPrint);
            };
        }
    }, [invoicesToPrint]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(paginatedInvoices.map(inv => inv.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkAction = (handler: (ids: number[]) => void) => {
        handler(selectedIds);
        setSelectedIds([]);
    };

    const handleDownload = (format: 'csv' | 'xml') => {
        const selectedInvoices = invoices.filter(inv => selectedIds.includes(inv.id));
        if (format === 'csv') {
            exportInvoicesToCSV(selectedInvoices, entities);
        } else if (format === 'xml') {
            exportInvoicesToXML(selectedInvoices);
        }
    };
    
    const handlePrintSingle = (invoice: Invoice | Bill) => {
        if ('items' in invoice) {
             setInvoicesToPrint([invoice]);
        }
    };

    const handlePrint = () => {
        const selected = invoices.filter(inv => selectedIds.includes(inv.id) && 'items' in inv);
        if (selected.length > 0) {
            setInvoicesToPrint(selected);
        }
    };
    
    const handleAdvancedFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAdvancedFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearAdvancedFilters = () => {
        setAdvancedFilters({
            minAmount: '', maxAmount: '', entityId: 'all', invoiceType: 'all', eInvoiceScenario: 'all'
        });
    }

    const totalAmount = useMemo(() => {
        return filteredAndSortedInvoices.reduce((sum, inv) => sum + ('grandTotal' in inv ? inv.grandTotal : inv.totalAmount), 0);
    }, [filteredAndSortedInvoices]);

    const isAllSelectedOnPage = selectedIds.length > 0 && paginatedInvoices.length > 0 && paginatedInvoices.every(inv => selectedIds.includes(inv.id));

    return (
        <>
        <Card title={title}>
             <div className="flex justify-between items-center mb-4 flex-wrap gap-2 p-4 border-b dark:border-dark-border">
                <div className="flex gap-2 flex-wrap items-center flex-grow">
                    <input type="text" placeholder="Fatura No, Müşteri/Tedarikçi Ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border min-w-[250px] flex-grow" />
                     {entityType === 'customer' && (
                        <>
                            <select name="invoiceType" value={advancedFilters.invoiceType} onChange={handleAdvancedFilterChange} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                                <option value="all">Tüm Fatura Tipleri</option>
                                <option value="Satış">Satış</option>
                                <option value="Tevkifat">Tevkifat</option>
                                <option value="İstisna">İstisna</option>
                            </select>
                            <select name="eInvoiceScenario" value={advancedFilters.eInvoiceScenario} onChange={handleAdvancedFilterChange} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                                <option value="all">Tüm Senaryolar</option>
                                <option value="e-Fatura">e-Fatura</option>
                                <option value="e-Arşiv">e-Arşiv</option>
                            </select>
                        </>
                    )}
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <input type="date" value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    <input type="date" value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    <FilterPopover isFilterActive={isAnyAdvancedFilterActive} onClear={clearAdvancedFilters}>
                        <div className="space-y-4">
                            <h4 className="font-semibold">Ek Filtreler</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Min Tutar" name="minAmount" type="number" value={advancedFilters.minAmount} onChange={handleAdvancedFilterChange} />
                                <InputField label="Maks Tutar" name="maxAmount" type="number" value={advancedFilters.maxAmount} onChange={handleAdvancedFilterChange} />
                            </div>
                            <SelectField label={entityLabel} name="entityId" value={advancedFilters.entityId} onChange={handleAdvancedFilterChange} options={[{id: 'all', name: `Tüm ${entityLabel}ler`}, ...entities]} />
                        </div>
                    </FilterPopover>
                </div>
            </div>
            
            {selectedIds.length > 0 && (
                <div className="p-4 mb-4 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center gap-4">
                    <span className="font-semibold">{selectedIds.length} öğe seçildi.</span>
                    {bulkActions.map(action => (
                         <Button key={action.label} variant={action.variant || 'secondary'} onClick={() => handleBulkAction(action.handler)}>{action.label}</Button>
                    ))}
                    <Dropdown trigger={<Button variant="secondary">İndir/Yazdır</Button>}>
                        <DropdownItem onClick={() => handleDownload('csv')}><span className="w-5">{ICONS.fileCsv}</span> CSV İndir</DropdownItem>
                        <DropdownItem onClick={() => handleDownload('xml')}><span className="w-5">{ICONS.fileXml}</span> XML İndir</DropdownItem>
                        <DropdownItem onClick={handlePrint}><span className="w-5">{ICONS.print}</span> Toplu Yazdır</DropdownItem>
                    </Dropdown>
                </div>
            )}
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                        {showSelectAll && <th className="p-3"><input type="checkbox" checked={isAllSelectedOnPage} onChange={handleSelectAll} /></th>}
                        <th className="p-3 font-semibold">Fatura No</th>
                        <th className="p-3 font-semibold">{entityLabel}</th>
                        <th className="p-3 font-semibold">Tarih</th>
                        <th className="p-3 font-semibold">Vade</th>
                        <th className="p-3 font-semibold text-right">Tutar</th>
                        <th className="p-3 font-semibold">Durum</th>
                        <th className="p-3 font-semibold text-center">Eylemler</th>
                    </tr></thead>
                    <tbody>
                        {paginatedInvoices.map(inv => (
                            <tr key={inv.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                {showSelectAll && <td className="p-3"><input type="checkbox" checked={selectedIds.includes(inv.id)} onChange={() => handleSelectOne(inv.id)} /></td>}
                                <td className="p-3 font-mono">{'invoiceNumber' in inv && inv.invoiceNumber ? inv.invoiceNumber : ('billNumber' in inv ? inv.billNumber : 'Taslak')}</td>
                                <td className="p-3 font-medium">{'customerId' in inv ? inv.customerName : inv.supplierName}</td>
                                <td className="p-3">{inv.issueDate}</td>
                                <td className="p-3">{inv.dueDate}</td>
                                <td className="p-3 text-right font-mono">${('grandTotal' in inv ? inv.grandTotal : inv.totalAmount).toLocaleString()}</td>
                                <td className="p-3">
                                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inv.status)}`}>{inv.status}</span>
                                </td>
                                <td className="p-3 text-center">
                                    <Dropdown trigger={<button className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">{ICONS.ellipsisVertical}</button>} menuPosition="right-0">
                                        {'items' in inv && <DropdownItem onClick={() => setPreviewingInvoice(inv)}><span className="w-5">{ICONS.view}</span> Önizle</DropdownItem>}
                                        {'items' in inv && <DropdownItem onClick={() => handlePrintSingle(inv)}><span className="w-5">{ICONS.print}</span> Yazdır</DropdownItem>}
                                        <DropdownItem onClick={() => exportInvoicesToCSV([inv], entities)}><span className="w-5">{ICONS.fileCsv}</span> CSV İndir</DropdownItem>
                                        <DropdownItem onClick={() => exportInvoicesToXML([inv])}><span className="w-5">{ICONS.fileXml}</span> XML İndir</DropdownItem>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="font-bold bg-slate-100 dark:bg-slate-800">
                        <tr>
                            <td colSpan={showSelectAll ? 5 : 4} className="p-3 text-right">Toplam (Filtrelenmiş)</td>
                            <td className="p-3 text-right font-mono">${totalAmount.toLocaleString()}</td>
                            <td colSpan={2} className="p-3">{filteredAndSortedInvoices.length} Fatura</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-dark-border">
                    <div className="text-sm text-text-secondary">
                        <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            {[10, 25, 50, 100, 250].map(size => <option key={size} value={size}>Sayfa başına {size}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Sayfa {currentPage} / {totalPages}</span>
                        <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} variant="secondary">Önceki</Button>
                        <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="secondary">Sonraki</Button>
                    </div>
                </div>
            )}
        </Card>
        {previewingInvoice && <InvoicePreviewModal isOpen={!!previewingInvoice} onClose={() => setPreviewingInvoice(null)} invoice={previewingInvoice as Invoice} />}
        {invoicesToPrint && <PrintableInvoiceList invoices={invoicesToPrint as Invoice[]} />}
        </>
    );
};

const getStatusColor = (status: InvoiceStatus | BillStatus) => {
    switch(status) {
        case InvoiceStatus.Paid:
        case BillStatus.Paid:
            return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case InvoiceStatus.Overdue:
            return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        case InvoiceStatus.Sent:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case BillStatus.Payable:
             return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
        default:
            return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
}

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div><label className="block text-sm font-medium">{label}</label><input {...props} className="mt-1 w-full" /></div>
);
const SelectField: React.FC<any> = ({ label, options, name, ...props }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <select name={name} {...props} className="mt-1 w-full">
            {options.map((opt: any) => {
                const value = typeof opt === 'object' ? opt.id : opt;
                const text = typeof opt === 'object' ? opt.name : (opt === 'all' ? `Tümü` : opt);
                return <option key={value} value={value}>{text}</option>;
            })}
        </select>
    </div>
);

export default GenericInvoiceList;