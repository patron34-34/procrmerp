import * as T from '../types';

const SIMULATED_DELAY = 500; // 500ms delay

// Helper to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class ApiService {
    private state: Record<string, any>;
    private setState: (key: string, value: any) => void;

    constructor(state: Record<string, any>, setState: (key: string, value: any) => void) {
        this.state = state;
        this.setState = setState;
    }

    private logActivity(actionType: T.ActionType, details: string, entityType?: T.EntityType, entityId?: number) {
        const currentUser = this.state.currentUser as T.Employee;
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
        this.setState('activityLogs', (prev: T.ActivityLog[]) => [newLog, ...prev].slice(0, 200));
    }

    // --- CUSTOMER API ---
    async addCustomer(customerData: Omit<T.Customer, 'id' | 'avatar'>): Promise<T.Customer> {
        await delay(SIMULATED_DELAY);
        const newCustomer: T.Customer = {
            ...customerData,
            id: Date.now(),
            avatar: `https://i.pravatar.cc/150?u=c${Date.now()}`,
        };
        this.setState('customers', (prev: T.Customer[]) => [newCustomer, ...prev]);
        this.logActivity(T.ActionType.CREATED, `Müşteri '${newCustomer.name}' oluşturuldu.`, 'customer', newCustomer.id);
        return newCustomer;
    }
    
    async updateCustomer(customerToUpdate: T.Customer): Promise<T.Customer> {
        await delay(SIMULATED_DELAY);
        this.setState('customers', (prev: T.Customer[]) => 
            prev.map(c => c.id === customerToUpdate.id ? customerToUpdate : c)
        );
        this.logActivity(T.ActionType.UPDATED, `Müşteri '${customerToUpdate.name}' güncellendi.`, 'customer', customerToUpdate.id);
        return customerToUpdate;
    }
    
    async addSalesActivity(activityData: Omit<T.SalesActivity, "id" | "userName" | "userAvatar" | "timestamp">): Promise<void> {
        await delay(SIMULATED_DELAY/2);
        const currentUser = this.state.currentUser as T.Employee;
        const newActivity: T.SalesActivity = {
            ...activityData,
            id: Date.now(),
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            timestamp: new Date().toISOString(),
        };
        this.setState('salesActivities', (prev: T.SalesActivity[]) => [newActivity, ...prev]);
        this.setState('deals', (prev: T.Deal[]) => 
            prev.map(d => d.id === activityData.dealId ? { ...d, lastActivityDate: newActivity.timestamp.split('T')[0] } : d)
        );
    }

    // --- DEAL API ---
    async addDeal(dealData: Omit<T.Deal, 'id' | 'customerName' | 'assignedToName' | 'value' | 'lastActivityDate' | 'createdDate'>): Promise<T.Deal> {
        await delay(SIMULATED_DELAY);
        const customer = this.state.customers.find((c: T.Customer) => c.id === dealData.customerId);
        const assignee = this.state.employees.find((e: T.Employee) => e.id === dealData.assignedToId);
        const value = dealData.lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const newDeal: T.Deal = {
            ...dealData,
            id: Date.now(),
            customerName: customer?.name || 'Bilinmeyen Müşteri',
            assignedToName: assignee?.name || 'Atanmamış',
            value: value,
            createdDate: new Date().toISOString().split('T')[0],
            lastActivityDate: new Date().toISOString().split('T')[0]
        };
        this.setState('deals', (prev: T.Deal[]) => [newDeal, ...prev]);
        this.logActivity(T.ActionType.CREATED, `Anlaşma '${newDeal.title}' oluşturuldu.`, 'deal', newDeal.id);
        return newDeal;
    }

    async updateDeal(dealToUpdate: T.Deal): Promise<T.Deal> {
        await delay(SIMULATED_DELAY);
        this.setState('deals', (prev: T.Deal[]) => 
            prev.map(d => d.id === dealToUpdate.id ? dealToUpdate : d)
        );
        this.logActivity(T.ActionType.UPDATED, `Anlaşma '${dealToUpdate.title}' güncellendi.`, 'deal', dealToUpdate.id);
        return dealToUpdate;
    }

    async updateDealStage(dealId: number, newStage: T.DealStage): Promise<T.Deal> {
        await delay(SIMULATED_DELAY);
        let updatedDeal: T.Deal | null = null;
        this.setState('deals', (prev: T.Deal[]) => 
            prev.map(d => {
                if (d.id === dealId) {
                    updatedDeal = { ...d, stage: newStage, lastActivityDate: new Date().toISOString().split('T')[0] };
                    return updatedDeal;
                }
                return d;
            })
        );
        if(updatedDeal) {
            this.logActivity(T.ActionType.STATUS_CHANGED, `Anlaşma '${updatedDeal.title}' durumu '${newStage}' olarak değiştirildi.`, 'deal', dealId);
        }
        return updatedDeal!;
    }
    
    async deleteDeal(dealId: number): Promise<void> {
        await delay(SIMULATED_DELAY);
        const dealToDelete = this.state.deals.find((d: T.Deal) => d.id === dealId);
        if(dealToDelete) {
             this.setState('deals', (prev: T.Deal[]) => prev.filter(d => d.id !== dealId));
             this.logActivity(T.ActionType.DELETED, `Anlaşma '${dealToDelete.title}' silindi.`, 'deal', dealId);
        }
    }

    private _createTasksFromTemplate(templateId: number, project: T.Project) {
        const template = this.state.taskTemplates.find((t: T.TaskTemplate) => t.id === templateId);
        if (!template) return;
    
        const newTasks: T.Task[] = [];
        const tempIdToNewIdMap = new Map<string, number>();
        const startDate = new Date(project.startDate);
    
        template.items.forEach(item => {
            const dueDate = new Date(startDate);
            dueDate.setDate(dueDate.getDate() + item.dueDaysAfterStart);
    
            const role = this.state.roles.find((r: T.Role) => r.id === item.defaultAssigneeRoleId);
            const assignee = this.state.employees.find((e: T.Employee) => e.role === role?.id) || this.state.employees.find((e: T.Employee) => e.id === project.teamMemberIds[0]);
    
            const newTask: T.Task = {
                id: Date.now() + Math.random(),
                title: item.taskName,
                description: '',
                status: T.TaskStatus.Todo,
                priority: item.priority,
                dueDate: dueDate.toISOString().split('T')[0],
                assignedToId: assignee?.id || 1,
                assignedToName: assignee?.name || 'Atanmamış',
                relatedEntityType: 'project',
                relatedEntityId: project.id,
                relatedEntityName: project.name,
                estimatedTime: item.estimatedTime,
                parentId: item.parentId ? tempIdToNewIdMap.get(item.parentId) : undefined
            };
            tempIdToNewIdMap.set(item.id, newTask.id);
            newTasks.push(newTask);
        });
    
        this.setState('tasks', (prev: T.Task[]) => [...newTasks, ...prev]);
        this.logActivity(T.ActionType.TASK_CREATED, `${newTasks.length} görev '${template.name}' şablonundan oluşturuldu.`, 'project', project.id);
    }
    
    // --- Composite Business Logic ---
    async winDeal(deal: T.Deal, winReason: string, createProject: boolean, useTaskTemplate: boolean, taskTemplateId?: number): Promise<void> {
        await delay(SIMULATED_DELAY);
        
        // 1. Update deal status
        let wonDeal: T.Deal | null = null;
        this.setState('deals', (prev: T.Deal[]) => prev.map(d => {
            if(d.id === deal.id) {
                wonDeal = { ...d, stage: T.DealStage.Won, winReason, closeDate: new Date().toISOString().split('T')[0] };
                return wonDeal;
            }
            return d;
        }));

        if(!wonDeal) return;
        this.logActivity(T.ActionType.STATUS_CHANGED, `Anlaşma '${wonDeal.title}' kazanıldı. Neden: ${winReason}`, 'deal', wonDeal.id);

        // 2. Create Commission Record
        const commissionAmount = wonDeal.value * 0.05; // 5% commission
        const newRecord: T.CommissionRecord = {
            id: Date.now(), employeeId: wonDeal.assignedToId, dealId: wonDeal.id,
            dealValue: wonDeal.value, commissionAmount, earnedDate: new Date().toISOString().split('T')[0],
        };
        this.setState('commissionRecords', (prev: T.CommissionRecord[]) => [newRecord, ...prev]);
        this.logActivity(T.ActionType.CREATED, `'${wonDeal.title}' için komisyon kaydı oluşturuldu.`, 'commission', newRecord.id);

        // 3. Create Sales Order if there are line items
        if (wonDeal.lineItems && wonDeal.lineItems.length > 0) {
            const customer = this.state.customers.find((c: T.Customer) => c.id === wonDeal!.customerId);
            if(customer) {
                const orderItems: T.SalesOrderItem[] = wonDeal.lineItems.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                    discountRate: 0,
                    taxRate: 20, // default
                    committedStockItemIds: [],
                    shippedQuantity: 0,
                }));
                const subTotal = orderItems.reduce((sum, i) => sum + i.quantity * i.price, 0);
                const totalTax = subTotal * 0.20; // simplified
                const newOrder: T.SalesOrder = {
                    id: Date.now(),
                    orderNumber: `SO-${Date.now()}`,
                    customerId: wonDeal.customerId,
                    customerName: customer.name,
                    orderDate: new Date().toISOString().split('T')[0],
                    items: orderItems,
                    status: T.SalesOrderStatus.OnayBekliyor,
                    shippingAddress: customer.shippingAddress,
                    billingAddress: customer.billingAddress,
                    subTotal: subTotal,
                    totalDiscount: 0,
                    totalTax: totalTax,
                    shippingCost: 0,
                    grandTotal: subTotal + totalTax,
                    dealId: wonDeal.id,
                };
                this.setState('salesOrders', (prev: T.SalesOrder[]) => [newOrder, ...prev]);
                this.logActivity(T.ActionType.CREATED, `Anlaşmadan #${newOrder.orderNumber} numaralı satış siparişi oluşturuldu.`, 'sales_order', newOrder.id);
            }
        }

        let createdProject: T.Project | null = null;
        // 4. (Optional) Create Project
        if (createProject) {
            const newProjectData: Omit<T.Project, 'id' | 'client'> = {
                name: `${wonDeal.title} Projesi`,
                customerId: wonDeal.customerId,
                deadline: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString().split('T')[0],
                status: 'beklemede',
                progress: 0,
                description: `'${wonDeal.title}' anlaşmasından oluşturuldu.`,
                startDate: new Date().toISOString().split('T')[0],
                teamMemberIds: [wonDeal.assignedToId],
                budget: wonDeal.value * 0.8, // Assume 80% of deal value is budget
                spent: 0,
                tags: ['satıştan-gelen'],
            };
            
            const customer = this.state.customers.find((c: T.Customer) => c.id === newProjectData.customerId);
            createdProject = {
                ...newProjectData,
                id: Date.now(),
                client: customer?.name || 'Bilinmeyen Müşteri'
            };

            this.setState('projects', (prev: T.Project[]) => [createdProject!, ...prev]);
            this.logActivity(T.ActionType.PROJECT_CREATED, `Proje '${createdProject.name}' oluşturuldu.`, 'project', createdProject.id);

             // 5. (Optional) Create Tasks from Template
            if (useTaskTemplate && taskTemplateId && createdProject) {
                this._createTasksFromTemplate(taskTemplateId, createdProject);
            }
        }
    }
}