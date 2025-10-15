import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint, AppEvent } from '../types';
import { EthereumLogo } from './icons/EthereumLogo';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ComputerIcon } from './icons/ComputerIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { UserIcon } from './icons/UserIcon';

// Partner Icons
import { MetaMaskIcon } from './icons/MetaMaskIcon';
import { CoinbaseIcon } from './icons/CoinbaseIcon';
import { TrustWalletIcon } from './icons/TrustWalletIcon';
import { LedgerIcon } from './icons/LedgerIcon';
import { BinanceIcon } from './icons/BinanceIcon';
import { BybitIcon } from './icons/BybitIcon';
import { OKXIcon } from './icons/OKXIcon';
import { BitgetIcon } from './icons/BitgetIcon';
import { SwissBorgIcon } from './icons/SwissBorgIcon';
import { ZenGoIcon } from './icons/ZenGoIcon';

// Certificate Icons
import { SSLCertificateIcon } from './icons/SSLCertificateIcon';
import { SmartContractAuditIcon } from './icons/SmartContractAuditIcon';
import { KYCIcon } from './icons/KYCIcon';
import { DataPrivacyIcon } from './icons/DataPrivacyIcon';


interface LandingPageProps {
  onStartMiningClick: () => void;
  chartData: ChartDataPoint[];
  events: AppEvent[];
}

const faqs = [
  {
    question: "What is ETH cloud mining?",
    answer: "ETH cloud mining allows you to mine Ethereum without purchasing or managing any hardware. You rent mining capacity from our data centers and receive daily ETH rewards directly to your platform balance."
  },
  {
    question: "How do I start mining?",
    answer: "Simply connect your wallet, navigate to the 'Start Mining' page, choose the amount of USDT or USDC you wish to convert, and confirm. Your mining power is activated instantly, and you'll start earning ETH."
  },
  {
    question: "Is my investment secure?",
    answer: "Security is our top priority. Our platform uses state-of-the-art encryption, and all transactions are transparently recorded. We partner with leading security firms to ensure the safety of your assets."
  },
  {
    question: "How are mining rewards calculated?",
    answer: "Rewards are based on the amount of mining power you have, which is determined by your initial conversion. Payouts are calculated daily based on the overall network difficulty and our pool's performance."
  }
];

const investors = [
    {
        name: "Michael Terpin",
        title: "Founder, CoinAgenda",
        bio: "A serial entrepreneur and investor in the blockchain space since 2013. Michael brings unparalleled experience and a vast network to the project."
    },
    {
        name: "Dr. Anna Becker",
        title: "CEO, EndoTech",
        bio: "With a Ph.D. in AI, Dr. Becker provides strategic guidance on algorithmic efficiency and scaling our mining operations sustainably."
    },
    {
        name: "James Crypto",
        title: "Partner, Block Ventures",
        bio: "James is a renowned venture capitalist who specializes in early-stage decentralized finance and infrastructure projects."
    }
]

const partners = [
    { name: 'MetaMask', icon: <MetaMaskIcon className="h-10 w-auto" /> },
    { name: 'Coinbase', icon: <CoinbaseIcon className="h-10 w-auto" /> },
    { name: 'Trust Wallet', icon: <TrustWalletIcon className="h-10 w-auto" /> },
    { name: 'Ledger', icon: <LedgerIcon className="h-10 w-auto" /> },
    { name: 'Binance', icon: <BinanceIcon className="h-10 w-auto" /> },
    { name: 'Bybit', icon: <BybitIcon className="h-10 w-auto" /> },
    { name: 'OKX', icon: <OKXIcon className="h-10 w-auto" /> },
    { name: 'Bitget', icon: <BitgetIcon className="h-10 w-auto" /> },
    { name: 'SwissBorg', icon: <SwissBorgIcon className="h-10 w-auto" /> },
    { name: 'ZenGo', icon: <ZenGoIcon className="h-10 w-auto" /> },
];

const certificates = [
  {
    icon: <SSLCertificateIcon className="w-12 h-12 text-green-500" />,
    title: "SSL Encryption",
    description: "All data traffic between you and our servers is secured with industry-standard SSL encryption."
  },
  {
    icon: <SmartContractAuditIcon className="w-12 h-12 text-blue-500" />,
    title: "Smart Contract Audited",
    description: "Our smart contracts have been rigorously audited by third-party security experts to ensure their integrity and safety."
  },
  {
    icon: <KYCIcon className="w-12 h-12 text-purple-500" />,
    title: "KYC/AML Compliant",
    description: "We adhere to strict Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations."
  },
  {
    icon: <DataPrivacyIcon className="w-12 h-12 text-yellow-500" />,
    title: "Data Privacy Certified",
    description: "Our platform is compliant with global data protection standards like GDPR to safeguard your personal information."
  }
];


const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 hover:border-brand-blue/30 text-center transform hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-slate-900">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStartMiningClick, chartData, events }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleFaqToggle = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="text-slate-800">
      {/* Hero Section */}
      <section className="text-center py-20 md:py-32 hero-pattern">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-slate-900">
            Mine Ethereum, Power the Future
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Join our decentralized mining platform to convert your assets and start earning ETH rewards today. Secure, transparent, and powerful.
          </p>
          <button
            onClick={onStartMiningClick}
            className="bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/30 text-lg"
          >
            Start Mining Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<EthereumLogo className="w-12 h-12 text-brand-blue" />}
              title="Instant Conversion"
              description="Seamlessly convert your stablecoins (USDT/USDC) into mining power without complex steps."
            />
            <FeatureCard 
              icon={<CheckCircleIcon className="w-12 h-12 text-green-500" />}
              title="Secure & Transparent"
              description="Your assets are secure. All transactions are verifiable on the blockchain for complete transparency."
            />
             <FeatureCard 
              icon={<ComputerIcon className="w-12 h-12 text-slate-500" />}
              title="Multi-Platform"
              description="Access our platform from your desktop or mobile device, and manage your mining operations anywhere."
            />
          </div>
        </div>
      </section>

      {/* Chart and Events Section */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Live Mining Pool Performance (ETH)</h2>
            <div className="w-full h-80 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#1e293b' }} />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 8, stroke: '#2563eb', fill: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Latest News & Events</h2>
            <div className="space-y-4">
              {events.slice(0, 3).map(event => (
                <div 
                  key={event.id}
                  className="w-full text-left bg-slate-50 p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                  <h4 className="font-semibold text-slate-800">{event.title}</h4>
                  <p className="text-sm text-slate-600">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Ongoing Events Section */}
      <section className="py-20 bg-transparent">
          <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Ongoing & Upcoming Events</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.map(event => (
                      <div key={event.id} className="bg-white p-6 rounded-lg border border-slate-200 hover:border-brand-blue/30 flex flex-col shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                          <span className={`text-xs font-bold uppercase py-1 px-2 rounded-full self-start mb-3 ${
                              event.type === 'milestone' ? 'bg-purple-100 text-purple-700' :
                              event.type === 'update' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>{event.type}</span>
                          <h3 className="text-xl font-bold mb-2 text-slate-900">{event.title}</h3>
                          <p className="text-sm text-slate-600 mb-4 flex-grow">{event.description}</p>
                          <p className="text-xs text-slate-500 mt-auto">{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white border-y border-slate-200">
          <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Frequently Asked Questions</h2>
              <div className="space-y-4">
                  {faqs.map((faq, index) => (
                      <div key={index} className="bg-slate-50 rounded-lg border border-slate-200 transition-all duration-300 hover:border-slate-300">
                          <button
                              onClick={() => handleFaqToggle(index)}
                              className="w-full flex justify-between items-center text-left p-6"
                          >
                              <h3 className="text-lg font-semibold text-slate-800">{faq.question}</h3>
                              <ChevronDownIcon className={`w-6 h-6 text-slate-500 transition-transform transform ${openFaq === index ? 'rotate-180' : ''}`} />
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                              <p className="p-6 pt-0 text-slate-600">{faq.answer}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Investors Section */}
      <section className="py-20 bg-transparent">
          <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Our Investors & Backers</h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {investors.map((investor) => (
                       <div key={investor.name} className="bg-white p-8 rounded-lg border border-slate-200 hover:border-brand-blue/30 text-center shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                           <div className="w-24 h-24 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center">
                               <UserIcon className="w-12 h-12 text-slate-500" />
                           </div>
                           <h3 className="text-xl font-bold text-slate-900">{investor.name}</h3>
                           <p className="text-brand-blue font-semibold mb-3">{investor.title}</p>
                           <p className="text-slate-600 text-sm">{investor.bio}</p>
                       </div>
                  ))}
              </div>
          </div>
      </section>
      
      {/* Trusted Partners Section */}
      <section className="py-20 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Trusted Wallets & Exchange Partners</h2>
              <div className="relative overflow-hidden group">
                  <div className="flex whitespace-nowrap animate-scroll group-hover:pause">
                      {[...partners, ...partners].map((partner, index) => (
                          <div key={index} className="inline-flex items-center justify-center mx-8 my-4 text-slate-700 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                              {partner.icon}
                              <span className="ml-3 font-semibold text-lg">{partner.name}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Our Security & Compliance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {certificates.map((cert) => (
              <div key={cert.title} className="bg-white p-6 rounded-lg border border-slate-200 hover:border-brand-blue/30 text-center transform hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="flex justify-center mb-4">{cert.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">{cert.title}</h3>
                <p className="text-slate-600 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;