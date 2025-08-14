
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ICONS } from '../../constants';
import { Customer, Deal, Project, Invoice, Product, Supplier, PurchaseOrder, Employee, BankAccount, Transaction, SupportTicket, Task, Document } from '../../types';
import { useNavigate } from 'react-router-dom';

type SearchResult = 
    | { type: 'Müşteriler'; item: Customer }
    | { type: 'Anlaşmalar'; item: Deal }
    | { type: 'Projeler'; item: Project }
    | { type: 'Görevler'; item: Task }
    | { type: 'Dokümanlar'; item: Document }
    | { type: 'Faturalar'; item: Invoice }
    | { type: 'Ürünler'; item: Product }
    | { type: 'Tedarikçiler'; item: Supplier }
    | { type: 'S.A. Siparişleri'; item: PurchaseOrder }
    | { type: 'Çalışanlar'; item: Employee }
    | { type: 'Banka Hesapları'; item: BankAccount }
    | { type: 'İşlemler'; item: Transaction }
    | { type: 'Destek'; item: SupportTicket };


const GlobalSearch: React.FC = () => {
    const { customers, deals, projects, tasks, invoices, products, suppliers, purchaseOrders, employees, bankAccounts, transactions, tickets, documents } = useApp();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const lowerCaseQuery = query.toLowerCase();
        
        const customerResults: SearchResult[] = customers.filter(c => c.name.toLowerCase().includes(lowerCaseQuery) || c.company.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'Müşteriler', item }));
        const dealResults: SearchResult[] = deals.filter(d => d.title.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'Anlaşmalar', item }));
        const projectResults: SearchResult[] = projects.filter(p => p.name.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'Projeler', item }));
        const taskResults: SearchResult[] = tasks.filter(t => t.title.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'Görevler', item }));
        const documentResults: SearchResult[] = documents.filter(d => d.name.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'Dokümanlar', item }));
        const invoiceResults: SearchResult[] = invoices.filter(i => i.invoiceNumber.toLowerCase().includes(lowerCaseQuery) || i.customerName.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'Faturalar', item }));
        const productResults: SearchResult[] = products.filter(p => p.name.toLowerCase().includes(lowerCaseQuery) || p.sku.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'Ürünler', item }));
        const supplierResults: SearchResult[] = suppliers.filter(s => s.name.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'Tedarikçiler', item }));
        const poResults: SearchResult[] = purchaseOrders.filter(po => po.poNumber.toLowerCase().includes(lowerCaseQuery) || po.supplierName.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'S.A. Siparişleri', item }));
        const employeeResults: SearchResult[] = employees.filter(e => e.name.toLowerCase().includes(lowerCaseQuery) || e.employeeId.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'Çalışanlar', item }));
        const accountResults: SearchResult[] = bankAccounts.filter(a => a.accountName.toLowerCase().includes(lowerCaseQuery) || a.bankName.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'Banka Hesapları', item }));
        const transactionResults: SearchResult[] = transactions.filter(t => t.description.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'İşlemler', item }));
        const ticketResults: SearchResult[] = tickets.filter(t => t.subject.toLowerCase().includes(lowerCaseQuery) || t.ticketNumber.toLowerCase().includes(lowerCaseQuery)).map(item => ({ type: 'Destek', item }));


        setResults([...customerResults, ...dealResults, ...projectResults, ...taskResults, ...documentResults, ...invoiceResults, ...productResults, ...supplierResults, ...poResults, ...employeeResults, ...accountResults, ...transactionResults, ...ticketResults]);

    }, [query, customers, deals, projects, tasks, invoices, products, suppliers, purchaseOrders, employees, bankAccounts, transactions, tickets, documents]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const getResultText = (result: SearchResult) => {
        switch (result.type) {
            case 'Anlaşmalar': return result.item.title;
            case 'Görevler': return result.item.title;
            case 'Dokümanlar': return result.item.name;
            case 'Faturalar': return `${result.item.invoiceNumber} - ${result.item.customerName}`;
            case 'S.A. Siparişleri': return `${result.item.poNumber} - ${result.item.supplierName}`;
            case 'Çalışanlar': return `${result.item.name} (${result.item.employeeId})`;
            case 'Banka Hesapları': return result.item.accountName;
            case 'İşlemler': return result.item.description;
            case 'Ürünler': return result.item.name;
            case 'Destek': return `${result.item.ticketNumber} - ${result.item.subject}`;
            default: return 'name' in result.item ? result.item.name : '';
        }
    }

    const handleResultClick = (result: SearchResult) => {
        setQuery('');
        setIsFocused(false);
        switch (result.type) {
            case 'Müşteriler': navigate(`/customers/${result.item.id}`); break;
            case 'Anlaşmalar': navigate(`/deals/${(result.item as Deal).id}`); break;
            case 'Projeler': navigate(`/projects/${(result.item as Project).id}`); break;
            case 'Görevler': navigate('/tasks'); break;
            case 'Dokümanlar': navigate('/documents'); break;
            case 'Faturalar': navigate('/invoices'); break;
            case 'Ürünler': navigate('/inventory/products'); break;
            case 'Tedarikçiler': navigate('/inventory/suppliers'); break;
            case 'S.A. Siparişleri': navigate('/inventory/purchase-orders'); break;
            case 'Çalışanlar': navigate(`/hr/employees/${(result.item as Employee).id}`); break;
            case 'Banka Hesapları': navigate('/accounting/bank-accounts'); break;
            case 'İşlemler': navigate('/accounting/transactions'); break;
            case 'Destek': navigate('/support/tickets'); break;
        }
    }

    return (
        <div className="relative w-64" ref={searchRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                {ICONS.search}
            </div>
            <input 
                type="text"
                placeholder="Genel Arama..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:border-dark-border dark:text-white"
            />
            {isFocused && query.length > 0 && (
                <div className="absolute mt-2 w-full max-h-80 overflow-y-auto bg-card rounded-md shadow-lg z-20 border border-slate-200 dark:bg-dark-card dark:border-dark-border">
                    {results.length > 0 ? (
                        <ul>
                           {results.map((result, index) => (
                               <li key={index}>
                                   <button 
                                      onClick={() => handleResultClick(result)}
                                      className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex justify-between items-center"
                                    >
                                       <span className="truncate pr-2">{getResultText(result)}</span>
                                       <span className="text-xs bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full shrink-0">{result.type}</span>
                                   </button>
                               </li>
                           ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-text-secondary dark:text-dark-text-secondary">
                            "{query}" için sonuç bulunamadı.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch
