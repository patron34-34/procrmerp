import * as T from '../types';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const SIMULATED_DELAY = 300;

// --- LocalStorage Helper Functions ---
const getLocalStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
};

const setLocalStorage = <T,>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
    }
};

// --- API Functions ---

// --- Customer API ---
export const fetchCustomers = async (): Promise<T.Customer[]> => {
    await delay(SIMULATED_DELAY);
    return getLocalStorage<T.Customer[]>('customers', []);
};

export const fetchCustomerById = async (id: number): Promise<T.Customer | undefined> => {
    await delay(SIMULATED_DELAY / 2);
    const customers = getLocalStorage<T.Customer[]>('customers', []);
    return customers.find(c => c.id === id);
};

const logActivity = (currentUser: T.Employee, actionType: T.ActionType, details: string, entityType?: T.EntityType, entityId?: number) => {
    const newLog: T.ActivityLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        actionType,
        details,
        entityType,
        entityId,
    };
    const logs = getLocalStorage<T.ActivityLog[]>('activityLogs', []);
    setLocalStorage('activityLogs', [newLog, ...logs].slice(0, 200));
};


export const addCustomer = async (customerData: Omit<T.Customer, 'id' | 'avatar'>, currentUser: T.Employee): Promise<T.Customer> => {
    await delay(SIMULATED_DELAY);
    const newCustomer: T.Customer = {
        ...customerData,
        id: Date.now(),
        avatar: `https://i.pravatar.cc/150?u=c${Date.now()}`,
    };
    const customers = getLocalStorage<T.Customer[]>('customers', []);
    setLocalStorage('customers', [newCustomer, ...customers]);
    logActivity(currentUser, T.ActionType.CREATED, `Müşteri '${newCustomer.name}' oluşturuldu.`, 'customer', newCustomer.id);
    return newCustomer;
};

export const updateCustomer = async (customerToUpdate: T.Customer, currentUser: T.Employee): Promise<T.Customer> => {
    await delay(SIMULATED_DELAY);
    const customers = getLocalStorage<T.Customer[]>('customers', []);
    const updatedCustomers = customers.map(c => c.id === customerToUpdate.id ? customerToUpdate : c);
    setLocalStorage('customers', updatedCustomers);
    logActivity(currentUser, T.ActionType.UPDATED, `Müşteri '${customerToUpdate.name}' güncellendi.`, 'customer', customerToUpdate.id);
    return customerToUpdate;
};

export const deleteCustomer = async (id: number, currentUser: T.Employee): Promise<void> => {
    await delay(SIMULATED_DELAY);
    const customers = getLocalStorage<T.Customer[]>('customers', []);
    const customerToDelete = customers.find(c => c.id === id);
    if (customerToDelete) {
        setLocalStorage('customers', customers.filter(c => c.id !== id));
        logActivity(currentUser, T.ActionType.DELETED, `Müşteri '${customerToDelete.name}' silindi.`, 'customer', id);
    }
};

export const deleteMultipleCustomers = async (ids: number[], currentUser: T.Employee): Promise<void> => {
    await delay(SIMULATED_DELAY);
    const customers = getLocalStorage<T.Customer[]>('customers', []);
    const customersToDelete = customers.filter(c => ids.includes(c.id));
    setLocalStorage('customers', customers.filter(c => !ids.includes(c.id)));
    logActivity(currentUser, T.ActionType.DELETED, `${customersToDelete.length} müşteri silindi.`);
};

// --- You would continue this pattern for all other data types ---
// Example for deals to show how dependent data is fetched
export const fetchDeals = async (): Promise<T.Deal[]> => {
    await delay(SIMULATED_DELAY);
    return getLocalStorage<T.Deal[]>('deals', []);
};
