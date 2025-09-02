
import { useCallback } from 'react';
import { Customer } from '../types';
import { useLocalStorageState } from './useLocalStorageState';

export const useCustomers = (initialCustomers: Customer[]) => {
    const [customers, setCustomers] = useLocalStorageState<Customer[]>('customers', initialCustomers);

    const addCustomer = useCallback((customerData: Omit<Customer, 'id' | 'avatar'>): Customer => {
        const newCustomer: Customer = {
            ...customerData,
            id: Date.now(),
            avatar: `https://i.pravatar.cc/150?u=c${Date.now()}`,
        };
        setCustomers(prev => [newCustomer, ...prev]);
        return newCustomer;
    }, [setCustomers]);

    const updateCustomer = useCallback((customerToUpdate: Customer): Customer => {
        setCustomers(prev => prev.map(c => c.id === customerToUpdate.id ? customerToUpdate : c));
        return customerToUpdate;
    }, [setCustomers]);
    
    const updateCustomerStatus = useCallback((customerId: number, newStatus: string): Customer | undefined => {
        let updatedCustomer: Customer | undefined;
        setCustomers(prev => prev.map(c => {
            if (c.id === customerId) {
                updatedCustomer = { ...c, status: newStatus };
                return updatedCustomer;
            }
            return c;
        }));
        return updatedCustomer;
    }, [setCustomers]);

    const assignCustomersToEmployee = useCallback((customerIds: number[], employeeId: number) => {
        setCustomers(prev => prev.map(c => customerIds.includes(c.id) ? { ...c, assignedToId: employeeId } : c));
    }, [setCustomers]);

    const addTagsToCustomers = useCallback((customerIds: number[], tags: string[]) => {
        setCustomers(prev => prev.map(c => {
            if (customerIds.includes(c.id)) {
                const newTags = [...new Set([...c.tags, ...tags])];
                return { ...c, tags: newTags };
            }
            return c;
        }));
    }, [setCustomers]);

    const deleteCustomer = useCallback((id: number) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
    }, [setCustomers]);

    const deleteMultipleCustomers = useCallback((ids: number[]) => {
        setCustomers(prev => prev.filter(c => !ids.includes(c.id)));
    }, [setCustomers]);
    
    const importCustomers = useCallback((customersData: Omit<Customer, 'id' | 'avatar'>[]): Customer[] => {
        const newCustomers: Customer[] = customersData.map((c, i) => ({
            ...c,
            id: Date.now() + i,
            avatar: `https://i.pravatar.cc/150?u=c${Date.now() + i}`,
        }));
        setCustomers(prev => [...newCustomers, ...prev]);
        return newCustomers;
    }, [setCustomers]);

    return {
        customers,
        addCustomer,
        updateCustomer,
        updateCustomerStatus,
        assignCustomersToEmployee,
        addTagsToCustomers,
        deleteCustomer,
        deleteMultipleCustomers,
        importCustomers,
    };
};
