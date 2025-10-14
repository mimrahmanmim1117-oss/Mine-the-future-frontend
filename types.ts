export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  avatar: string;
}

export interface AppEvent {
  date: {
    day: string;
    month: string;
  };
  title: string;
  description: string;
  status: 'Upcoming' | 'Joined' | 'Completed';
}

export interface Referral {
  id: string;
  walletAddress: string;
  status: 'Active' | 'Inactive';
  earnings: number;
}