import { mockUsers, mockTransactions, mockWithdrawals, mockSiteSettings } from './mockData';
import type { AdminUser, AdminTransaction, WithdrawalRequest, AppEvent, ChartDataPoint, SiteSettings, ChatSession, Message } from '../../types';

// --- DATABASE SIMULATION WITH LOCALSTORAGE PERSISTENCE ---

const DB_KEY = 'eth_mining_nexus_db';

// Function to get the initial state from localStorage or fallback to mocks
const getInitialDb = () => {
    try {
        const storedDb = localStorage.getItem(DB_KEY);
        if (storedDb) {
            const parsedDb = JSON.parse(storedDb);
            // Basic validation to ensure stored data has expected structure
            if (parsedDb.users && parsedDb.transactions && parsedDb.settings) {
                return parsedDb;
            }
        }
    } catch (error) {
        console.error("Failed to parse DB from localStorage", error);
    }
    // Fallback to mock data if localStorage is empty or corrupt
    return {
        users: JSON.parse(JSON.stringify(mockUsers)),
        transactions: JSON.parse(JSON.stringify(mockTransactions)),
        withdrawals: JSON.parse(JSON.stringify(mockWithdrawals)),
        settings: JSON.parse(JSON.stringify(mockSiteSettings)),
        chatSessions: {} as Record<string, ChatSession>,
    };
};

// This acts as a persistent in-memory database, initialized from localStorage.
let db = getInitialDb();

// Function to persist the current DB state to localStorage and notify other tabs
const persistDb = () => {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        // Use a separate key with a timestamp to reliably trigger the 'storage' event in other tabs.
        localStorage.setItem('db_last_updated', Date.now().toString());
    } catch (error) {
        console.error("Failed to persist DB to localStorage", error);
    }
};


// --- API SIMULATION ---
const LATENCY = 200; // Reduced latency for a snappier feel

// This flag simulates the admin's connection to the backend.
let isBackendConnected = true;

export const setBackendStatus = (isConnected: boolean) => {
  isBackendConnected = isConnected;
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

// Public API calls have no latency as they are user-facing.
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
    const userExists = db.users.some(u => u.walletAddress.toLowerCase() === newUser.walletAddress.toLowerCase());
    if (!userExists) {
        let newUsers = [...db.users, newUser];
        if (parentUserId) {
            newUsers = newUsers.map(u => {
                if (u.id === parentUserId) {
                    return { ...u, referrals: u.referrals + 1 };
                }
                return u;
            });
        }
        db.users = newUsers;
        persistDb(); // Persist changes
    }
    return publicApiCall(db.users);
};

export const updateUserStatus = (userId: string, status: AdminUser['status']) => {
    db.users = db.users.map(u => {
      if (u.id === userId) {
        return { ...u, status, lastActive: new Date().toISOString() };
      }
      return u;
    });
    persistDb(); // Persist changes
    return apiCall(db.users);
};

export const updateUserBalanceAndAllowance = async (userWallet: string, newEthBalance: number, newWalletBalance: {usdt: number, usdc: number}, newAllowance: {usdt: number, usdc: number}) => {
    db.users = db.users.map(u => {
        if (u.walletAddress.toLowerCase() === userWallet.toLowerCase()) {
            return { 
                ...u, 
                ethBalance: newEthBalance,
                walletBalance: newWalletBalance,
                usdtAllowance: newAllowance.usdt,
                usdcAllowance: newAllowance.usdc,
                lastActive: new Date().toISOString()
            };
        }
        return u;
    });
    persistDb(); // Persist changes
    return publicApiCall(db.users);
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
    db.withdrawals = [newRequest, ...db.withdrawals];
    persistDb(); // Persist changes
    return publicApiCall(db.withdrawals);
};

export const updateWithdrawalStatus = (withdrawalId: string, status: WithdrawalRequest['status']) => {
    db.withdrawals = db.withdrawals.map(w => {
        if (w.id === withdrawalId) {
            return { ...w, status };
        }
        return w;
    });
    persistDb(); // Persist changes
    return apiCall(db.withdrawals);
};

// --- Live Chat API ---
export const getChatSessions = async (): Promise<Record<string, ChatSession>> => {
    return publicApiCall(db.chatSessions);
};

export const startOrGetChatSession = async (sessionId: string): Promise<Record<string, ChatSession>> => {
    if (!db.chatSessions[sessionId]) {
        db.chatSessions = {
            ...db.chatSessions,
            [sessionId]: {
                sessionId: sessionId,
                messages: [{ text: "Hello! How can I assist you today?", sender: 'admin', timestamp: new Date().toISOString() }],
                unreadAdmin: false,
                lastMessageTimestamp: new Date().toISOString()
            }
        };
        persistDb(); // Persist changes
    }
    return publicApiCall(db.chatSessions);
};

export const addChatMessage = async (sessionId: string, message: Message): Promise<Record<string, ChatSession>> => {
    const currentSession = db.chatSessions[sessionId];
    if (currentSession) {
         const updatedSession: ChatSession = {
            ...currentSession,
            messages: [...currentSession.messages, message],
            lastMessageTimestamp: message.timestamp,
            // Mark as unread for admin only if the user sends the message
            unreadAdmin: message.sender === 'user' ? true : currentSession.unreadAdmin,
        };
        db.chatSessions = {
            ...db.chatSessions,
            [sessionId]: updatedSession,
        };
        persistDb(); // Persist changes
    }
    return publicApiCall(db.chatSessions);
};

export const markChatReadByAdmin = async (sessionId: string): Promise<Record<string, ChatSession>> => {
    const currentSession = db.chatSessions[sessionId];
    if (currentSession && currentSession.unreadAdmin) { // Only update if it's currently unread
        const updatedSession: ChatSession = {
            ...currentSession,
            unreadAdmin: false,
        };
        db.chatSessions = {
            ...db.chatSessions,
            [sessionId]: updatedSession
        };
        persistDb(); // Persist changes
    }
    return publicApiCall(db.chatSessions);
};


// --- Site Settings API ---
export const fetchSiteSettings = () => apiCall(db.settings);

export const publicFetchSiteSettings = () => publicApiCall(db.settings);

export const updateSiteSettings = async (settings: SiteSettings) => {
    db.settings = settings;
    persistDb(); // Persist changes
    return apiCall(db.settings);
};

// --- Legacy granular settings API for compatibility with existing components ---
export const fetchChartData = () => apiCall(db.settings.chartData);

export const updateChartData = async (data: ChartDataPoint[]) => {
    db.settings.chartData = data;
    persistDb(); // Persist changes
    return apiCall(db.settings.chartData);
};

export const fetchEvents = () => apiCall(db.settings.events);

export const addEvent = async (event: Omit<AppEvent, 'id'>) => {
    const newEvent = { ...event, id: `evt_${Date.now()}`};
    db.settings.events = [newEvent, ...db.settings.events];
    persistDb(); // Persist changes
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
    persistDb(); // Persist changes
    return apiCall(updatedEvent);
};

export const deleteEvent = async (eventId: string) => {
    const initialLength = db.settings.events.length;
    db.settings.events = db.settings.events.filter(e => e.id !== eventId);
    if (db.settings.events.length === initialLength) throw new Error("Event not found");
    persistDb(); // Persist changes
    return apiCall({ success: true });
};