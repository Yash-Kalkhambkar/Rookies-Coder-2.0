import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const engagementData = [
  { name: 'Jan', active: 4000, completions: 2400 },
  { name: 'Feb', active: 4500, completions: 2800 },
  { name: 'Mar', active: 5100, completions: 3200 },
  { name: 'Apr', active: 4800, completions: 3600 },
  { name: 'May', active: 6000, completions: 4100 },
  { name: 'Jun', active: 7200, completions: 4800 },
  { name: 'Jul', active: 8500, completions: 5300 },
];

export function Admin() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header Section */}
      <div className="flex items-end justify-between border-b-2 border-tertiary pb-6">
        <div>
          <h1 className="text-4xl font-serif font-black tracking-tight text-tertiary mb-2">System Overview</h1>
          <p className="font-mono text-sm text-slate-600">Platform health, engagement, and content metrics.</p>
        </div>
        <div className="flex space-x-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-white text-tertiary font-mono text-xs uppercase tracking-widest font-bold hover:bg-outline-variant transition-colors border border-outline flex items-center"
          >
            <span className="material-symbols-outlined mr-2 text-[16px]">download</span>
            Export Report
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-tertiary text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-slate-800 transition-colors border border-tertiary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)] hover:shadow-[2px_2px_0px_0px_rgba(217,119,6,1)] hover:translate-x-[2px] hover:translate-y-[2px] flex items-center"
          >
            <span className="material-symbols-outlined mr-2 text-[16px]">add</span>
            New Module
          </motion.button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Scholars', value: '12,450', change: '+14%', trend: 'up' },
          { label: 'Avg. Completion Rate', value: '68%', change: '+2.4%', trend: 'up' },
          { label: 'Open Incidents', value: '3', change: '-2', trend: 'down' },
          { label: 'Server Load', value: '42%', change: 'Stable', trend: 'neutral' }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-white border border-outline p-6 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-neutral -rotate-45 translate-x-8 -translate-y-8 border-b border-outline group-hover:bg-primary transition-colors"></div>
            <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">{stat.label}</h3>
            <div className="text-3xl font-black text-tertiary mb-2">{stat.value}</div>
            <div className={`flex items-center font-mono text-[10px] font-bold ${
              stat.trend === 'up' ? 'text-secondary' : 
              stat.trend === 'down' ? 'text-primary' : 
              'text-slate-400'
            }`}>
              <span className="material-symbols-outlined text-[14px] mr-1">
                {stat.trend === 'up' ? 'trending_up' : stat.trend === 'down' ? 'trending_down' : 'trending_flat'}
              </span>
              {stat.change} vs last month
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 space-y-8"
        >
          
          {/* User Engagement Analytics */}
          <section className="bg-white border border-outline p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 flex items-center">
                <span className="material-symbols-outlined mr-2 text-[18px]">insights</span>
                User Engagement Analytics
              </h2>
              <select className="bg-neutral border border-outline px-3 py-1 font-mono text-[10px] text-slate-600 focus:outline-none">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Year to Date</option>
              </select>
            </div>
            
            {/* Chart */}
            <div className="h-72 w-full bg-neutral border border-outline p-4 relative overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9e8e5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E1E2F', borderColor: '#1E1E2F', color: '#fff', fontFamily: 'IBM Plex Mono', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="active" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" name="Active Users" />
                  <Area type="monotone" dataKey="completions" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#colorCompletions)" name="Completions" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Course Health */}
          <section className="bg-white border border-outline p-6 shadow-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">health_and_safety</span>
              Course Health
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-outline">
                    <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Module Name</th>
                    <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Enrollments</th>
                    <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Drop-off Rate</th>
                    <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Avg. Rating</th>
                    <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-sm text-tertiary">
                  {[
                    { name: 'Foundations of Logic', enrolls: '12.4k', drop: '15%', rating: '4.8', status: 'Healthy' },
                    { name: 'Algorithmic Thinking', enrolls: '8.2k', drop: '22%', rating: '4.5', status: 'Warning' },
                    { name: 'Data Systems & Memory', enrolls: '5.1k', drop: '45%', rating: '3.9', status: 'Critical' },
                    { name: 'Advanced Architecture', enrolls: '2.3k', drop: '10%', rating: '4.9', status: 'Healthy' },
                  ].map((course, i) => (
                    <tr key={i} className="border-b border-outline hover:bg-neutral transition-colors">
                      <td className="py-4 px-4 font-bold">{course.name}</td>
                      <td className="py-4 px-4">{course.enrolls}</td>
                      <td className={`py-4 px-4 ${parseInt(course.drop) > 30 ? 'text-red-500 font-bold' : ''}`}>{course.drop}</td>
                      <td className="py-4 px-4 flex items-center">
                        <span className="material-symbols-outlined text-amber-400 text-[16px] mr-1">star</span>
                        {course.rating}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold ${
                          course.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800' :
                          course.status === 'Warning' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </motion.div>

        {/* Right Column (1/3) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-8"
        >
          
          {/* Incident Reports */}
          <section className="bg-tertiary text-neutral p-6 border border-tertiary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center">
                <span className="material-symbols-outlined mr-2 text-[18px]">warning</span>
                Incident Reports
              </h2>
              <span className="bg-primary text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">3 New</span>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'INC-042', title: 'Code execution timeout in Module 3', severity: 'High', time: '2h ago' },
                { id: 'INC-041', title: 'Broken link in curriculum syllabus', severity: 'Low', time: '5h ago' },
                { id: 'INC-040', title: 'Database connection spike', severity: 'Medium', time: '1d ago' },
              ].map((inc, i) => (
                <div key={i} className="p-4 border border-outline-variant bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-slate-400">{inc.id}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      inc.severity === 'High' ? 'bg-red-500' : 
                      inc.severity === 'Medium' ? 'bg-amber-500' : 
                      'bg-secondary'
                    }`}></span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-2">{inc.title}</h3>
                  <div className="font-mono text-[10px] text-slate-500">{inc.time}</div>
                </div>
              ))}
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-2 border border-outline-variant text-white font-mono text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
            >
              View All Incidents
            </motion.button>
          </section>

          {/* Quick Actions */}
          <section className="bg-white border border-outline p-6 shadow-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">bolt</span>
              Quick Actions
            </h2>
            
            <div className="space-y-3">
              <motion.button 
                whileHover={{ x: 5 }}
                className="w-full flex items-center justify-between p-3 border border-outline hover:border-primary hover:bg-neutral transition-colors group"
              >
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary mr-3 text-[20px]">campaign</span>
                  <span className="font-mono text-sm font-bold text-tertiary">Global Announcement</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary text-[16px]">arrow_forward</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ x: 5 }}
                className="w-full flex items-center justify-between p-3 border border-outline hover:border-primary hover:bg-neutral transition-colors group"
              >
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary mr-3 text-[20px]">manage_accounts</span>
                  <span className="font-mono text-sm font-bold text-tertiary">Manage Users</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary text-[16px]">arrow_forward</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ x: 5 }}
                className="w-full flex items-center justify-between p-3 border border-outline hover:border-primary hover:bg-neutral transition-colors group"
              >
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary mr-3 text-[20px]">settings_system_daydream</span>
                  <span className="font-mono text-sm font-bold text-tertiary">System Config</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary text-[16px]">arrow_forward</span>
              </motion.button>
            </div>
          </section>

        </motion.div>
      </div>
    </motion.div>
  );
}
