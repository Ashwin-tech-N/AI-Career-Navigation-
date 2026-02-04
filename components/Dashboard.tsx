import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GeminiService } from '../services/geminiService';
import { TrendingUp, ArrowUpRight, DollarSign, Briefcase, Map } from './ui/Icons';

const mockTrendData = [
  { name: 'Mon', jobs: 2400 },
  { name: 'Tue', jobs: 1398 },
  { name: 'Wed', jobs: 9800 },
  { name: 'Thu', jobs: 3908 },
  { name: 'Fri', jobs: 4800 },
  { name: 'Sat', jobs: 3800 },
  { name: 'Sun', jobs: 4300 },
];

const mockSalaryData = [
  { name: 'Junior', salary: 45000 },
  { name: 'Mid', salary: 85000 },
  { name: 'Senior', salary: 145000 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: any; color: string }> = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
        <TrendingUp className="w-3 h-3 mr-1" /> {trend}
      </span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [marketIntel, setMarketIntel] = useState<any>(null);

  useEffect(() => {
    // In a real app, this would fetch from Gemini based on user profile
    // Simulating load for now or calling simplified Gemini
    GeminiService.generateJobTrends("Software Engineer Fresher").then(data => {
      if(data) setMarketIntel(data);
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Market Intelligence Dashboard</h1>
          <p className="text-gray-500">Real-time insights for Software Engineering roles.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live Market Data
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Daily Booming Jobs" 
          value="1,240" 
          trend="+12%" 
          icon={Briefcase} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Avg. Entry Salary" 
          value="$65k" 
          trend="+5.2%" 
          icon={DollarSign} 
          color="bg-emerald-500"
        />
        <StatCard 
          title="Remote Opportunities" 
          value="450+" 
          trend="+8%" 
          icon={Map} 
          color="bg-violet-500"
        />
         <StatCard 
          title="Market Growth" 
          value="High" 
          trend="Stable" 
          icon={ArrowUpRight} 
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Job Demand Trends (Last 7 Days)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f3f4f6', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0ea5e9' }}
                />
                <Area type="monotone" dataKey="jobs" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorJobs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Salary Progression</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSalaryData} layout="vertical" margin={{ left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 13}} width={50}/>
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="salary" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Trending Roles for You</h2>
          <div className="space-y-4">
            {(marketIntel?.trendingRoles || [
              {name: 'Full Stack Developer', growth: '+22%'}, 
              {name: 'DevOps Engineer', growth: '+18%'}, 
              {name: 'Cloud Architect', growth: '+15%'}
            ]).map((role: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span className="font-medium text-gray-900">{role.name}</span>
                </div>
                <span className="text-green-600 font-medium text-sm">{role.growth}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
           <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended Actions</h2>
           <ul className="space-y-3">
             <li className="flex gap-3 items-start p-3 bg-orange-50 rounded-lg border border-orange-100">
               <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div></div>
               <div>
                 <p className="text-sm font-medium text-gray-900">Update Resume Keywords</p>
                 <p className="text-xs text-gray-500 mt-1">Market analysis suggests adding 'React' and 'AWS' to your profile.</p>
               </div>
             </li>
             <li className="flex gap-3 items-start p-3 bg-blue-50 rounded-lg border border-blue-100">
               <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div></div>
               <div>
                 <p className="text-sm font-medium text-gray-900">Complete System Design Module</p>
                 <p className="text-xs text-gray-500 mt-1">80% of target roles require this skill.</p>
               </div>
             </li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;