import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { motion } from 'motion/react';

const data = [
  { name: 'Mon', xp: 400, avg: 240 },
  { name: 'Tue', xp: 300, avg: 250 },
  { name: 'Wed', xp: 200, avg: 260 },
  { name: 'Thu', xp: 278, avg: 280 },
  { name: 'Fri', xp: 189, avg: 290 },
  { name: 'Sat', xp: 239, avg: 300 },
  { name: 'Sun', xp: 349, avg: 310 },
];

const radarData = [
  { subject: 'Algorithms', A: 80, fullMark: 100 },
  { subject: 'Data Structs', A: 90, fullMark: 100 },
  { subject: 'Sys Design', A: 40, fullMark: 100 },
  { subject: 'Databases', A: 60, fullMark: 100 },
  { subject: 'Networking', A: 30, fullMark: 100 },
  { subject: 'Security', A: 50, fullMark: 100 },
];

export function Progress() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-end justify-between border-b-2 border-tertiary pb-6">
        <div>
          <h1 className="text-4xl font-serif font-black tracking-tight text-tertiary mb-2">Developer Progress</h1>
          <p className="font-mono text-sm text-slate-600">Advanced Systems Design & Architecture</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs uppercase tracking-widest font-bold text-primary mb-1">Total XP</div>
          <div className="text-4xl font-black text-tertiary">24,500</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          
          {/* Consistency Chart */}
          <section className="bg-white border border-outline p-6 shadow-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">show_chart</span>
              Learning Consistency
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9e8e5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                  <Tooltip 
                    cursor={{ fill: '#f4f3f0' }}
                    contentStyle={{ backgroundColor: '#1E1E2F', borderColor: '#1E1E2F', color: '#fff', fontFamily: 'IBM Plex Mono', fontSize: '12px' }}
                  />
                  <Bar dataKey="xp" fill="#D97706" radius={[4, 4, 0, 0]} name="Daily XP" maxBarSize={40} />
                  <Line type="monotone" dataKey="avg" stroke="#0D9488" strokeWidth={3} dot={{ r: 4, fill: '#0D9488', strokeWidth: 2, stroke: '#fff' }} name="7-Day Avg" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Proficiency Heatmap */}
          <section className="bg-white border border-outline p-6 shadow-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">grid_on</span>
              Proficiency Heatmap
            </h2>
            
            <div className="h-72 w-full bg-neutral border border-outline flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#e9e8e5" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Proficiency" dataKey="A" stroke="#D97706" fill="#D97706" fillOpacity={0.4} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E1E2F', borderColor: '#1E1E2F', color: '#fff', fontFamily: 'IBM Plex Mono', fontSize: '12px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </motion.div>

        {/* Right Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-8"
        >
          
          {/* Certifications */}
          <section className="bg-tertiary text-neutral p-6 border border-tertiary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)]">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-400 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">workspace_premium</span>
              Certifications
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-outline-variant bg-slate-800 flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4 shrink-0">
                  <span className="material-symbols-outlined text-white">emoji_events</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Foundations of Logic</h3>
                  <p className="font-mono text-[10px] text-slate-400 mt-1">Issued: Oct 2023</p>
                </div>
              </div>
              
              <div className="p-4 border border-outline-variant bg-slate-800 flex items-center opacity-50 grayscale">
                <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mr-4 shrink-0">
                  <span className="material-symbols-outlined text-slate-400">lock</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Algorithmic Mastery</h3>
                  <p className="font-mono text-[10px] text-slate-400 mt-1">In Progress (60%)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Milestones */}
          <section className="bg-white border border-outline p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">flag</span>
              Recent Milestones
            </h2>
            
            <div className="relative border-l-2 border-outline ml-3 space-y-6">
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-secondary border-2 border-white"></div>
                <div className="font-mono text-[10px] text-slate-400 mb-1">2 days ago</div>
                <h3 className="font-bold text-tertiary text-sm">Completed 100th Exercise</h3>
                <p className="text-xs text-slate-600 mt-1">Consistency is key.</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-white"></div>
                <div className="font-mono text-[10px] text-slate-400 mb-1">1 week ago</div>
                <h3 className="font-bold text-tertiary text-sm">Mastered Binary Trees</h3>
                <p className="text-xs text-slate-600 mt-1">Passed the module assessment with 95%.</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                <div className="font-mono text-[10px] text-slate-400 mb-1">1 month ago</div>
                <h3 className="font-bold text-tertiary text-sm">Joined the Guild</h3>
                <p className="text-xs text-slate-600 mt-1">Began the journey.</p>
              </div>
            </div>
          </section>

        </motion.div>
      </div>
    </motion.div>
  );
}
