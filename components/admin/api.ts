import { mockUsers, mockTransactions, mockWithdrawals, mockSiteSettings } from './mockData';
import type { AdminUser, AdminTransaction, WithdrawalRequest, AppEvent, ChartDataPoint, SiteSettings, ChatSession, Message } from '../../types';

// --- DATABASE SIMULATION WITH LOCALSTORAGE PERSISTENCE ---

const DB_KEY = 'eth_mining_nexus_db';

// --- Core DB Functions ---

// This function WRITES to localStorage and is the ONLY way data should be saved.
const writeDb = (dbState: any) => {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(dbState));
        // Use a separate key with a timestamp to reliably trigger the 'storage' event in other tabs.
        localStorage.setItem('db_last_updated', Date.now().toString());
    } catch (error) {
        console.error("Failed to persist DB to localStorage", error);
    }
}

// This function READS from localStorage and is the ONLY way data should be retrieved.
const readDb = () => {
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
    
    // If localStorage is empty or corrupt, initialize with mock data and write it back.
    console.log("Initializing DB from mock data.");
    const initialDb = {
        users: JSON.parse(JSON.stringify(mockUsers)),
        transactions: JSON.parse(JSON.stringify(mockTransactions)),
        withdrawals: JSON.parse(JSON.stringify(mockWithdrawals)),
        settings: JSON.parse(JSON.stringify(mockSiteSettings)),
        chatSessions: {} as Record<string, ChatSession>,
    };
    writeDb(initialDb);
    return initialDb;
};


// --- API SIMULATION ---
const LATENCY = 200; 

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

const publicApiCall = <T>(data: T): Promise<T> => {
    return Promise.resolve(JSON.parse(JSON.stringify(data)));
};

// --- API ENDPOINTS ---

export const fetchDashboardData = () => {
    const db = readDb();
    return apiCall({
        users: db.users,
        transactions: db.transactions,
        withdrawals: db.withdrawals,
    });
};

export const fetchUsers = () => {
    const db = readDb();
    return apiCall(db.users);
};

export const publicFetchUsers = () => {
    const db = readDb();
    return publicApiCall(db.users);
};

export const addUser = async (newUser: AdminUser, parentUserId: string | null): Promise<AdminUser[]> => {
    const db = readDb();
    const userExists = db.users.some((u: AdminUser) => u.walletAddress.toLowerCase() === newUser.walletAddress.toLowerCase());
    
    if (!userExists) {
        let updatedUsers = [...db.users, newUser];
        if (parentUserId) {
            updatedUsers = updatedUsers.map(u => {
                if (u.id === parentUserId) {
                    return { ...u, referrals: u.referrals + 1 };
                }
                return u;
            });
        }
        writeDb({ ...db, users: updatedUsers });
    }
    const finalDb = readDb();
    return publicApiCall(finalDb.users);
};

export const updateUserStatus = (userId: string, status: AdminUser['status']) => {
    const db = readDb();
    const updatedUsers = db.users.map((u: AdminUser) => {
      if (u.id === userId) {
        return { ...u, status, lastActive: new Date().toISOString() };
      }
      return u;
    });
    writeDb({ ...db, users: updatedUsers });
    const finalDb = readDb();
    return apiCall(finalDb.users);
};

export const updateUserBalanceAndAllowance = async (userWallet: string, newEthBalance: number, newWalletBalance: {usdt: number, usdc: number}, newAllowance: {usdt: number, usdc: number}) => {
    const db = readDb();
    const updatedUsers = db.users.map((u: AdminUser) => {
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
    writeDb({ ...db, users: updatedUsers });
    const finalDb = readDb();
    return publicApiCall(finalDb.users);
};

export const fetchTransactions = () => {
    const db = readDb();
    return apiCall(db.transactions);
};
export const publicFetchTransactions = () => {
    const db = readDb();
    return publicApiCall(db.transactions);
};

export const fetchWithdrawals = () => {
    const db = readDb();
    return apiCall(db.withdrawals);
};
export const publicFetchWithdrawals = () => {
    const db = readDb();
    return publicApiCall(db.withdrawals);
};

export const fetchWithdrawalsForUser = (userWallet: string) => {
    const db = readDb();
    const userWithdrawals = db.withdrawals.filter((w: WithdrawalRequest) => w.userWallet.toLowerCase() === userWallet.toLowerCase());
    return publicApiCall(userWithdrawals);
};

export const requestAssistedWithdrawal = (userWallet: string, amount: number, message: string) => {
    const db = readDb();
    const newRequest: WithdrawalRequest = {
        id: `wd_${Date.now()}`,
        userWallet,
        amount,
        userMessage: message,
        status: 'Pending Assistance',
        timestamp: new Date().toISOString(),
    };
    const updatedWithdrawals = [newRequest, ...db.withdrawals];
    writeDb({ ...db, withdrawals: updatedWithdrawals });
    const finalDb = readDb();
    return publicApiCall(finalDb.withdrawals);
};

export const updateWithdrawalStatus = (withdrawalId: string, status: WithdrawalRequest['status']) => {
    const db = readDb();
    const updatedWithdrawals = db.withdrawals.map((w: WithdrawalRequest) => {
        if (w.id === withdrawalId) {
            return { ...w, status };
        }
        return w;
    });
    writeDb({ ...db, withdrawals: updatedWithdrawals });
    const finalDb = readDb();
    return apiCall(finalDb.withdrawals);
};

// --- Live Chat API ---
export const getChatSessions = async (): Promise<Record<string, ChatSession>> => {
    const db = readDb();
    return publicApiCall(db.chatSessions);
};

export const startOrGetChatSession = async (sessionId: string): Promise<Record<string, ChatSession>> => {
    const db = readDb();
    if (!db.chatSessions[sessionId]) {
        const updatedSessions = {
            ...db.chatSessions,
            [sessionId]: {
                sessionId: sessionId,
                messages: [{ text: "Hello! How can I assist you today?", sender: 'admin', timestamp: new Date().toISOString() }],
                unreadAdmin: true, // Start as unread for the admin
                lastMessageTimestamp: new Date().toISOString()
            }
        };
        writeDb({ ...db, chatSessions: updatedSessions });
    }
    const finalDb = readDb();
    return publicApiCall(finalDb.chatSessions);
};

export const addChatMessage = async (sessionId: string, message: Message): Promise<Record<string, ChatSession>> => {
    const db = readDb();
    const currentSession = db.chatSessions[sessionId];
    if (currentSession) {
         const updatedSession: ChatSession = {
            ...currentSession,
            messages: [...currentSession.messages, message],
            lastMessageTimestamp: message.timestamp,
            unreadAdmin: message.sender === 'user' ? true : currentSession.unreadAdmin,
        };
        const updatedSessions = { ...db.chatSessions, [sessionId]: updatedSession };
        writeDb({ ...db, chatSessions: updatedSessions });
    }
    const finalDb = readDb();
    return publicApiCall(finalDb.chatSessions);
};

export const markChatReadByAdmin = async (sessionId: string): Promise<Record<string, ChatSession>> => {
    const db = readDb();
    const currentSession = db.chatSessions[sessionId];
    if (currentSession && currentSession.unreadAdmin) {
        const updatedSession: ChatSession = { ...currentSession, unreadAdmin: false };
        const updatedSessions = { ...db.chatSessions, [sessionId]: updatedSession };
        writeDb({ ...db, chatSessions: updatedSessions });
    }
    const finalDb = readDb();
    return publicApiCall(finalDb.chatSessions);
};


// --- Site Settings API ---
export const fetchSiteSettings = () => {
    const db = readDb();
    return apiCall(db.settings);
};

export const publicFetchSiteSettings = () => {
    const db = readDb();
    return publicApiCall(db.settings);
};

export const updateSiteSettings = async (settings: SiteSettings) => {
    const db = readDb();
    writeDb({ ...db, settings });
    const finalDb = readDb();
    return apiCall(finalDb.settings);
};

// --- Legacy granular settings API for compatibility with existing components ---
export const fetchChartData = () => {
    const db = readDb();
    return apiCall(db.settings.chartData);
};

export const updateChartData = async (data: ChartDataPoint[]) => {
    const db = readDb();
    const updatedSettings = { ...db.settings, chartData: data };
    writeDb({ ...db, settings: updatedSettings });
    const finalDb = readDb();
    return apiCall(finalDb.settings.chartData);
};

export const fetchEvents = () => {
    const db = readDb();
    return apiCall(db.settings.events);
};

export const addEvent = async (event: Omit<AppEvent, 'id'>) => {
    const db = readDb();
    const newEvent = { ...event, id: `evt_${Date.now()}`};
    const updatedEvents = [newEvent, ...db.settings.events];
    const updatedSettings = { ...db.settings, events: updatedEvents };
    writeDb({ ...db, settings: updatedSettings });
    return apiCall(newEvent);
};

export const updateEvent = async (updatedEvent: AppEvent) => {
    const db = readDb();
    let eventFound = false;
    const updatedEvents = db.settings.events.map((e: AppEvent) => {
        if (e.id === updatedEvent.id) {
            eventFound = true;
            return updatedEvent;
        }
        return e;
    });
    if (!eventFound) throw new Error("Event not found");
    const updatedSettings = { ...db.settings, events: updatedEvents };
    writeDb({ ...db, settings: updatedSettings });
    return apiCall(updatedEvent);
};

export const deleteEvent = async (eventId: string) => {
    const db = readDb();
    const initialLength = db.settings.events.length;
    const updatedEvents = db.settings.events.filter((e: AppEvent) => e.id !== eventId);
    if (updatedEvents.length === initialLength) throw new Error("Event not found");
    const updatedSettings = { ...db.settings, events: updatedEvents };
    writeDb({ ...db, settings: updatedSettings });
    return apiCall({ success: true });
};
