
import { useCallback } from 'react';
import { Customer } from '../types';
import { useLocalStorageState } from './useLocalStorageState';

export const useCustomers = (initialCustomers: (Customer & { assignedToName: string })[]) => {
    const [customers, setCustomers] = useLocalStorageState<(Customer & { assignedToName: string })[]>('customers', initialCustomers);

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

    // NOTE: More complex functions like add, update, assign were moved to AppContext
    // to correctly handle dependencies like the 'employees' list for enriching data.
    return {
        customers,
        setCustomers,
        addTagsToCustomers,
        deleteCustomer,
        deleteMultipleCustomers,
    };
};