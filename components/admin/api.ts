import { mockUsers, mockTransactions, mockWithdrawals, mockSiteSettings } from './mockData';
import type { AdminUser, AdminTransaction, WithdrawalRequest, AppEvent, ChartDataPoint, SiteSettings, ChatSession, Message } from '../../types';

// --- DATABASE SIMULATION ---
// This acts as a persistent in-memory database for the entire app session.
// It's initialized once and will be mutated by API calls.
let db = {
  users: JSON.parse(JSON.stringify(mockUsers)),
  transactions: JSON.parse(JSON.stringify(mockTransactions)),
  withdrawals: JSON.parse(JSON.stringify(mockWithdrawals)),
  settings: JSON.parse(JSON.stringify(mockSiteSettings)),
  chatSessions: {} as Record<string, ChatSession>,
};

// --- API SIMULATION ---
const LATENCY = 800; // ms to simulate network delay

// This flag simulates the admin's connection to the backend.
// It's controlled by the toggle in the Admin Panel.
let isBackendConnected = true;

export const setBackendStatus = (isConnected: boolean) => {
  isBackendConnected = isConnected;
  // The database is NOT reset here to ensure data persists across connections.
};

const apiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isBackendConnected) {
        // Return a deep copy to prevent direct state mutation from callers
        resolve(JSON.parse(JSON.stringify(data)));
      } else {
        reject(new Error('Could not connect to the backend. Please make sure the server is running.'));
      }
    }, LATENCY);
  });
};

// Public API calls for the frontend don't have latency or connection checks.
// They interact directly with our persistent 'db'.
const publicApiCall = <T>(data: T): Promise<T> => {
    return Promise.resolve(JSON.parse(JSON.stringify(data)));
};

// --- API ENDPOINTS ---

export const fetchDashboardData = () => apiCall({
    users: db.users,
    transactions: db.transactions,
    withdrawals: db.withdrawals,
});

export const fetchUsers = () => apiCall(db.users);

export const publicFetchUsers = () => publicApiCall(db.users);

export const addUser = async (newUser: AdminUser, parentUserId: string | null): Promise<AdminUser[]> => {
    // Prevent duplicate users
    const userExists = db.users.some(u => u.walletAddress.toLowerCase() === newUser.walletAddress.toLowerCase());
    if (!userExists) {
        db.users.push(newUser);
        if (parentUserId) {
            const parent = db.users.find(u => u.id === parentUserId);
            if (parent) {
                parent.referrals += 1;
            }
        }
    }
    return publicApiCall(db.users);
};

export const updateUserStatus = (userId: string, status: AdminUser['status']) => {
    const user = db.users.find(u => u.id === userId);
    if(user) {
        user.status = status;
    }
    // Using apiCall to simulate the network request for this mutation
    return apiCall(user);
};

export const fetchTransactions = () => apiCall(db.transactions);
export const publicFetchTransactions = () => publicApiCall(db.transactions);


export const fetchWithdrawals = () => apiCall(db.withdrawals);
export const publicFetchWithdrawals = () => publicApiCall(db.withdrawals);


export const fetchWithdrawalsForUser = (userWallet: string) => {
    const userWithdrawals = db.withdrawals.filter(w => w.userWallet.toLowerCase() === userWallet.toLowerCase());
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

export const updateWithdrawalStatus = (withdrawalId: string, status: WithdrawalRequest['status']) => {
    const withdrawal = db.withdrawals.find(w => w.id === withdrawalId);
    if(withdrawal) {
        withdrawal.status = status;
    }
    // Using apiCall to simulate the network request for this mutation
    return apiCall(withdrawal);
};

// --- Live Chat API ---
export const getChatSessions = async (): Promise<Record<string, ChatSession>> => {
    return publicApiCall(db.chatSessions);
};

export const startOrGetChatSession = async (sessionId: string): Promise<Record<string, ChatSession>> => {
    if (!db.chatSessions[sessionId]) {
        db.chatSessions[sessionId] = {
            sessionId: sessionId,
            messages: [{ text: "Hello! How can I assist you today?", sender: 'admin', timestamp: new Date().toISOString() }],
            unreadAdmin: false,
            lastMessageTimestamp: new Date().toISOString()
        };
    }
    return publicApiCall(db.chatSessions);
};

export const addChatMessage = async (sessionId: string, message: Message): Promise<Record<string, ChatSession>> => {
    if (db.chatSessions[sessionId]) {
        db.chatSessions[sessionId].messages.push(message);
        db.chatSessions[sessionId].lastMessageTimestamp = message.timestamp;
        if (message.sender === 'user') {
            db.chatSessions[sessionId].unreadAdmin = true;
        }
    }
    return publicApiCall(db.chatSessions);
};

export const markChatReadByAdmin = async (sessionId: string): Promise<Record<string, ChatSession>> => {
    if (db.chatSessions[sessionId]) {
        db.chatSessions[sessionId].unreadAdmin = false;
    }
    return publicApiCall(db.chatSessions);
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