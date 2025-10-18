import { mockUsers, mockTransactions, mockWithdrawals, mockSiteSettings } from './mockData';
import type { AdminUser, AdminTransaction, WithdrawalRequest, AppEvent, ChartDataPoint, SiteSettings } from '../../types';

// --- DATABASE SIMULATION ---
// In a real app, this would be a database. We'll mutate this data in memory.
let db = {
  users: JSON.parse(JSON.stringify(mockUsers)),
  transactions: JSON.parse(JSON.stringify(mockTransactions)),
  withdrawals: JSON.parse(JSON.stringify(mockWithdrawals)),
  settings: JSON.parse(JSON.stringify(mockSiteSettings)),
};

// --- API SIMULATION ---
const LATENCY = 800; // ms to simulate network delay

let isBackendConnected = false;

export const setBackendStatus = (isConnected: boolean) => {
  isBackendConnected = isConnected;
  if (isConnected) {
    // Reset DB on connect to have a clean state for the session
    db = {
      users: JSON.parse(JSON.stringify(mockUsers)),
      transactions: JSON.parse(JSON.stringify(mockTransactions)),
      withdrawals: JSON.parse(JSON.stringify(mockWithdrawals)),
      settings: JSON.parse(JSON.stringify(mockSiteSettings)),
    };
  }
};

const apiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isBackendConnected) {
        resolve(JSON.parse(JSON.stringify(data)));
      } else {
        reject(new Error('Could not connect to the backend. Please make sure the server is running.'));
      }
    }, LATENCY);
  });
};

// Public fetcher that doesn't check connection status or have latency, for frontend use
const publicApiCall = <T>(data: T): Promise<T> => {
    return new Promise((resolve) => {
        // No latency for public calls
        resolve(JSON.parse(JSON.stringify(data)));
    });
};

// --- API ENDPOINTS ---

export const fetchDashboardData = () => apiCall({
    users: db.users,
    transactions: db.transactions,
    withdrawals: db.withdrawals,
});

export const fetchUsers = () => apiCall(db.users);

export const updateUserStatus = async (userId: string, status: AdminUser['status']) => {
    const user = db.users.find(u => u.id === userId);
    if(user) {
        user.status = status;
    }
    return apiCall(user);
};

export const fetchTransactions = () => apiCall(db.transactions);

export const fetchWithdrawals = () => apiCall(db.withdrawals);

export const fetchWithdrawalsForUser = (userWallet: string) => {
    const userWithdrawals = db.withdrawals.filter(w => w.userWallet === userWallet);
    return publicApiCall(userWithdrawals);
};

export const requestAssistedWithdrawal = (userWallet: string, amount: number, message: string) => {
    const newRequest: WithdrawalRequest = {
        id: `wd_${Date.now()}`,
        userWallet,
        amount,
        userMessage: message,
        status: 'Pending Assistance',
        timestamp: new Date().toISOString(),
    };
    db.withdrawals.unshift(newRequest);
    return publicApiCall(newRequest);
};

export const updateWithdrawalStatus = async (withdrawalId: string, status: WithdrawalRequest['status']) => {
    const withdrawal = db.withdrawals.find(w => w.id === withdrawalId);
    if(withdrawal) {
        withdrawal.status = status;
    }
    return apiCall(withdrawal);
};

// --- Site Settings API ---
export const fetchSiteSettings = () => apiCall(db.settings);

export const publicFetchSiteSettings = () => publicApiCall(db.settings);

export const updateSiteSettings = async (settings: SiteSettings) => {
    db.settings = settings;
    return apiCall(db.settings);
};

// --- Legacy granular settings API for compatibility with existing components ---
export const fetchChartData = () => apiCall(db.settings.chartData);

export const updateChartData = async (data: ChartDataPoint[]) => {
    db.settings.chartData = data;
    return apiCall(db.settings.chartData);
};

export const fetchEvents = () => apiCall(db.settings.events);

export const addEvent = async (event: Omit<AppEvent, 'id'>) => {
    const newEvent = { ...event, id: `evt_${Date.now()}`};
    db.settings.events.unshift(newEvent);
    return apiCall(newEvent);
};

export const updateEvent = async (updatedEvent: AppEvent) => {
    let eventFound = false;
    db.settings.events = db.settings.events.map(e => {
        if (e.id === updatedEvent.id) {
            eventFound = true;
            return updatedEvent;
        }
        return e;
    });
    if (!eventFound) throw new Error("Event not found");
    return apiCall(updatedEvent);
};

export const deleteEvent = async (eventId: string) => {
    const initialLength = db.settings.events.length;
    db.settings.events = db.settings.events.filter(e => e.id !== eventId);
    if (db.settings.events.length === initialLength) throw new Error("Event not found");
    return apiCall({ success: true });
};
