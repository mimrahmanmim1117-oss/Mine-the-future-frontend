import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import type { FaqItem, Testimonial, AppEvent } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { CertificateIcon } from './icons/CertificateIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { ComputerIcon } from './icons/ComputerIcon';
import { MetaMaskIcon } from './icons/MetaMaskIcon';
import { CoinbaseIcon } from './icons/CoinbaseIcon';
import { TrustWalletIcon } from './icons/TrustWalletIcon';
import { LedgerIcon } from './icons/LedgerIcon';
import { TrezorIcon } from './icons/TrezorIcon';
import { ExodusIcon } from './icons/ExodusIcon';
import { ArgentIcon } from './icons/ArgentIcon';
import { ZenGoIcon } from './icons/ZenGoIcon';
import { BitpandaIcon } from './icons/BitpandaIcon';
import { SwissBorgIcon } from './icons/SwissBorgIcon';
import { RainIcon } from './icons/RainIcon';
import { BitOasisIcon } from './icons/BitOasisIcon';
import { BinanceIcon } from './icons/BinanceIcon';
import { BitgetIcon } from './icons/BitgetIcon';
import { BybitIcon } from './icons/BybitIcon';
import { AbantetherIcon } from './icons/AbantetherIcon';
import { NobitexIcon } from './icons/NobitexIcon';
import { OKXIcon } from './icons/OKXIcon';
import { RamzenexIcon } from './icons/RamzenexIcon';

interface LandingPageProps {
  onStartMiningClick: () => void;
}

const chartData = [
  { name: '12 AM', value: 120 },
  { name: '3 AM', value: 150 },
  { name: '6 AM', value: 130 },
  { name: '9 AM', value: 180 },
  { name: '12 PM', value: 210 },
  { name: '3 PM', value: 250 },
  { name: '6 PM', value: 230 },
  { name: '9 PM', value: 260 },
];

const trustedWalletsRow1 = [
  { name: 'MetaMask', icon: <MetaMaskIcon className="w-12 h-12" /> },
  { name: 'Coinbase', icon: <CoinbaseIcon className="w-12 h-12" /> },
  { name: 'Trust Wallet', icon: <TrustWalletIcon className="w-12 h-12" /> },
  { name: 'Ledger', icon: <LedgerIcon className="w-12 h-12" /> },
  { name: 'Trezor', icon: <TrezorIcon className="w-12 h-12" /> },
  { name: 'Exodus', icon: <ExodusIcon className="w-12 h-12" /> },
  { name: 'Binance', icon: <BinanceIcon className="w-12 h-12" /> },
  { name: 'Bybit', icon: <BybitIcon className="w-12 h-12" /> },
  { name: 'OKX', icon: <OKXIcon className="w-12 h-12" /> },
  { name: 'Bitget', icon: <BitgetIcon className="w-12 h-12" /> },
];

const trustedWalletsRow2 = [
  { name: 'Argent', icon: <ArgentIcon className="w-12 h-12" /> },
  { name: 'ZenGo', icon: <ZenGoIcon className="w-12 h-12" /> },
  { name: 'Bitpanda', icon: <BitpandaIcon className="w-12 h-12" /> },
  { name: 'SwissBorg', icon: <SwissBorgIcon className="w-12 h-12" /> },
  { name: 'Rain', icon: <RainIcon className="w-12 h-12" /> },
  { name: 'BitOasis', icon: <BitOasisIcon className="w-12 h-12" /> },
  { name: 'Abantether', icon: <AbantetherIcon className="w-12 h-12" /> },
  { name: 'Nobitex', icon: <NobitexIcon className="w-12 h-12" /> },
  { name: 'Ramzenex', icon: <RamzenexIcon className="w-12 h-12" /> },
];

const events: AppEvent[] = [
  { date: { day: '22', month: 'OCT' }, title: 'Blockchain Innovators Summit', description: 'The industry\'s leading summit to discuss the future of decentralized tech and governance.', status: 'Upcoming' },
  { date: { day: '15', month: 'NOV' }, title: 'DeFi World Congress', description: 'A deep dive into latest trends in decentralized finance, from yield farming to governance tokens.', status: 'Upcoming' },
  { date: { day: '05', month: 'DEC' }, title: 'Crypto Miners Expo 2024', description: 'Explore the latest in mining hardware and software at this global event for professional miners.', status: 'Upcoming' },
];

const faqItems: FaqItem[] = [
  { question: 'What is cloud mining?', answer: 'Cloud mining is a mechanism to mine a cryptocurrency, such as bitcoin, using rented cloud computing power and without having to install and directly run the hardware and related software. This allows people to mine cryptocurrencies without managing their own hardware.' },
  { question: 'How do I get started?', answer: 'Getting started is easy! Simply connect your cryptocurrency wallet, choose a mining plan, and allocate your assets. Our platform will handle the rest, and you can start earning rewards immediately.' },
  { question: 'What are the risks involved?', answer: 'Like any investment, cloud mining has risks, including market volatility and changes in mining difficulty. We recommend starting with a smaller amount to understand the process and consulting a financial advisor.' },
  { question: 'How are payouts calculated and distributed?', answer: 'Payouts are calculated based on the hashing power you\'ve contributed and the current network rewards. They are automatically distributed to your connected wallet on a daily basis.' },
];

const testimonials: Testimonial[] = [
  { name: 'Sophie W.', location: 'Boston, MA', quote: 'This has been a total game-changer for me. I started with a small investment and have watched my portfolio grow steadily. Highly recommend!', avatar: 'https://picsum.photos/id/1027/100/100' },
  { name: 'Robert K.', location: 'Chicago, IL', quote: 'After years on the market, I can say this is a seamless platform. The service is professional, transparent, and always on schedule. A solid choice for anyone serious about mining.', avatar: 'https://picsum.photos/id/1005/100/100' },
  { name: 'Priya R.', location: 'Santa Monica, CA', quote: 'Honestly, I was skeptical at first, but they made it incredibly easy. What impressed me was the responsive customer support - they answered all my questions promptly!', avatar: 'https://picsum.photos/id/1011/100/100' },
  { name: 'Mohammed A.', location: 'Houston, TX', quote: 'Super impressed with the platform. My investment grew steadily, and the support team was always available. Highly recommend!', avatar: 'https://picsum.photos/id/1012/100/100' },
];

const FaqAccordionItem: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-700">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-800 transition-colors">
        <h3 className="text-lg font-medium text-white">{item.question}</h3>
        <ChevronDownIcon className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <p className="p-6 pt-0 text-brand-gray">{item.answer}</p>}
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onStartMiningClick }) => {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');

  const chartComponents = {
    line: (
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151' }} />
        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 8, stroke: '#2563eb', fill: '#fff' }} />
      </LineChart>
    ),
    area: (
      <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151' }} />
        <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#colorValue)" />
      </AreaChart>
    ),
    bar: (
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151' }} cursor={{fill: '#374151'}} />
            <Bar dataKey="value" fill="#2563eb" />
        </BarChart>
    )
  };


  return (
    <div className="space-y-24 md:space-y-32 py-16 md:py-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Start Mining Ethereum Today</h1>
        <h2 className="text-xl md:text-2xl font-medium tracking-tight text-brand-gray mb-10 max-w-3xl mx-auto">Join our cloud mining platform and start earning ETH with your wallet. Simple, secure, and profitable.</h2>
        <div className="flex justify-center">
          <button
            onClick={onStartMiningClick}
            className="bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-4 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg text-lg flex items-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <span>Start Mining Now</span>
          </button>
        </div>
      </section>
      
      {/* Chart & Events */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark-light p-6 md:p-8 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">ETH Live Market Chart</h3>
            <div className="flex items-center space-x-2 bg-gray-900/50 p-1 rounded-md">
                {(['line', 'area', 'bar'] as const).map((type) => (
                    <button 
                        key={type}
                        onClick={() => setChartType(type)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${chartType === type ? 'bg-brand-blue text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>
          </div>
          <div className="w-full h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartComponents[chartType]}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Earning Flexibility Section */}
        <div className="mt-16 text-center">
            <div className="bg-brand-dark-light p-8 rounded-lg max-w-3xl mx-auto border border-gray-700">
                <div className="flex justify-center items-center space-x-8">
                    <PhoneIcon className="w-12 h-12 text-brand-blue flex-shrink-0" />
                    <ComputerIcon className="w-12 h-12 text-brand-blue flex-shrink-0" />
                </div>
                <p className="text-2xl mt-6 text-brand-gray italic">
                    "You can earn from home by phone, or you can earn from the office on a computer."
                </p>
            </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-4">Upcoming Events</h2>
          <p className="text-brand-gray text-center max-w-2xl mx-auto mb-12">Stay ahead of the curve. Join us at these premier industry events.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {events.map(event => (
              <div key={event.title} className="bg-brand-dark-light p-6 rounded-lg border border-gray-700 hover:border-brand-blue transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="text-center flex-shrink-0">
                    <p className="text-3xl font-bold text-white">{event.date.day}</p>
                    <p className="text-sm font-medium text-brand-gray">{event.date.month}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-brand-gray mb-4">{event.description}</p>
                    <a href="#" className="font-medium text-brand-blue hover:text-brand-blue-light flex items-center">Learn More <ExternalLinkIcon className="w-4 h-4 ml-1" /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
        <p className="text-brand-gray text-center max-w-2xl mx-auto mb-12">Have questions? We've got answers.</p>
        <div className="max-w-3xl mx-auto bg-brand-dark-light rounded-lg shadow-xl">
          {faqItems.map((item, index) => <FaqAccordionItem key={index} item={item} />)}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Miners Say</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map(t => (
            <div key={t.name} className="bg-brand-dark-light p-6 rounded-lg border border-gray-700">
              <p className="text-brand-gray mb-6">"{t.quote}"</p>
              <div className="flex items-center">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-brand-gray">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certificates */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Our Credentials & Certificates</h2>
        <p className="text-brand-gray max-w-2xl mx-auto mb-12">We are committed to security, transparency, and regulatory compliance.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {['SOC 2 Compliant', 'ISO/IEC 27001', 'Crypto-Safe Certified', 'Blockchain Alliance Member'].map(cert => (
            <div key={cert} className="bg-brand-dark-light p-6 rounded-lg flex flex-col items-center justify-center border border-gray-700">
              <CertificateIcon className="w-12 h-12 text-brand-blue mb-4" />
              <h3 className="font-semibold text-center">{cert}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted Wallets */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Trusted Wallets & Platforms</h2>
        <p className="text-brand-gray max-w-2xl mx-auto mb-12">Compatible with the industry's most popular and secure wallets.</p>
        <div className="space-y-4">
            <div className="relative w-full overflow-hidden bg-brand-dark-light py-8 rounded-lg [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex animate-scroll">
                    {[...trustedWalletsRow1, ...trustedWalletsRow1].map((wallet, index) => (
                    <div key={`${wallet.name}-${index}`} className="flex-shrink-0 flex flex-col items-center justify-center w-48 mx-4">
                        {wallet.icon}
                        <span className="mt-4 font-semibold text-brand-gray">{wallet.name}</span>
                    </div>
                    ))}
                </div>
            </div>
            <div className="relative w-full overflow-hidden bg-brand-dark-light py-8 rounded-lg [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex animate-scroll-reverse">
                    {[...trustedWalletsRow2, ...trustedWalletsRow2].map((wallet, index) => (
                    <div key={`${wallet.name}-${index}`} className="flex-shrink-0 flex flex-col items-center justify-center w-48 mx-4">
                        {wallet.icon}
                        <span className="mt-4 font-semibold text-brand-gray">{wallet.name}</span>
                    </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;