import * as T from '../types';

// This file is deprecated. All state management is now handled through AppContext.
// The context uses useLocalStorageState for persistence. Direct manipulation of
// localStorage from here would cause state inconsistencies.
// Keeping this file to prevent import errors in components that have not yet been refactored.

// Dummy exports to satisfy imports
export const fetchCustomers = async (): Promise<T.Customer[]> => [];
export const fetchCustomerById = async (id: number): Promise<T.Customer | undefined> => undefined;
export const addCustomer = async (customerData: any, currentUser: any): Promise<T.Customer> => ({...customerData, id: Date.now(), avatar: ''});
export const updateCustomer = async (customerToUpdate: any, currentUser: any): Promise<T.Customer> => customerToUpdate;
export const deleteCustomer = async (id: number, currentUser: any): Promise<void> => {};
export const deleteMultipleCustomers = async (ids: number[], currentUser: any): Promise<void> => {};
export const fetchDeals = async (): Promise<T.Deal[]> => [];