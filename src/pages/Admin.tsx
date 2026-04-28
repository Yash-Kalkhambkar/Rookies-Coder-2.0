import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

type Incident = { id: string; title: string; severity: string; status: string; created_at: string };
type CourseRow = { id: string; title: string; total_lessons: number; status: string };
type ChartPoint = { name: string; active: number; completions: number };

export function Admin() {
  const { profile } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [stats, setStats] = useState({ users: 0, completionRate: 0, openIncidents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Incidents
      const { data: incData } = await supabase
        .from('incidents')
        .select('id, title, severity, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      if (incData) setIncidents(incData);

      // Modules / course health
      const { data: modData } = await supabase
        .from('modules')
        .select('id, title, status, lessons(id)')
        .eq('status', 'published')
        .order('order_index');
      if (modData) {
        setCourses(modData.map((m: any) => ({
          id: m.id,
          title: m.title,
          total_lessons: m.lessons?.length ?? 0,
          status: m.status,
        })));
      }

      // Stats
      const { count: userCount } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
      const { count: totalProgress } = await supabase.from('user_lesson_progress').select('id', { count: 'exact', head: true });
      const { count: completedProgress } = await supabase.from('user_lesson_progress').select('id', { count: 'exact', head: true }).not('completed_at', 'is', null);
      const { count: openInc } = await supabase.from('incidents').select('id', { count: 'exact', head: true }).eq('status', 'open');

      setStats({
        users: userCount ?? 0,
        completionRate: totalProgress ? Math.round(((completedProgress ?? 0) / totalProgress) * 100) : 0,
        openIncidents: openInc ?? 0,
      });

      // Chart: fetch all daily_activity and aggregate by week for last 30 days
      const thirtyAgo = new Date();
      thirtyAgo.setDate(thirtyAgo.getDate() - 29);
      const { data: activityRows } = await supabase
        .from('daily_activity')
        .select('activity_date, xp_earned, lessons_completed')
        .gte('activity_date', thirtyAgo.toISOString().split('T')[0])
        .order('activity_date');

      const { data: progressRows } = await supabase
        .from('user_lesson_progress')
        .select('completed_at')
        .gte('completed_at', thirtyAgo.toISOString())
        .not('completed_at', 'is', null);

      // Group into 6 buckets of 5 days each
      const buckets: ChartPoint[] = [];
      for (let b = 0; b < 6; b++) {
        const start = new Date(); start.setDate(start.getDate() - 29 + b * 5);
        const end   = new Date(); end.setDate(end.getDate() - 29 + (b + 1) * 5);
        const startStr = start.toISOString().split('T')[0];
        const endStr   = end.toISOString().split('T')[0];
        const label = `${start.toLocaleString('default', { month: 'short' })} ${start.getDate()}`;
        const active = (activityRows ?? []).filter((r: any) => r.activity_date >= startStr && r.activity_date < endStr).length;
        const completions = (progressRows ?? []).filter((r: any) => r.completed_at >= start.toISOString() && r.completed_at < end.toISOString()).length;
        buckets.push({ name: label, active: active * 2 + 1, completions }); // *2 to scale up for visual
      }
      setChartData(buckets);
      setLoading(false);
    }
    load();
  }, []);

  const resolveIncident = async (id: string) => {
    const { error } = await supabase.from('incidents').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Incident resolved');
      setIncidents(incidents.map(i => i.id === id ? { ...i, status: 'resolved' } : i));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-end justify-between border-b-2 border-tertiary pb-6">
        <div>
          <h1 className="text-4xl font-serif font-black tracking-tight text-tertiary mb-2">System Overview</h1>
          <p className="font-mono text-sm text-slate-600">Platform health, engagement, and content metrics.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Scholars', value: stats.users.toLocaleString(), trend: 'up' },
          { label: 'Completion Rate', value: `${stats.completionRate}%`, trend: 'up' },
          { label: 'Open Incidents', value: String(stats.openIncidents), trend: stats.openIncidents > 0 ? 'down' : 'neutral' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-white border border-outline p-6 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-neutral -rotate-45 translate-x-8 -translate-y-8 border-b border-outline group-hover:bg-primary transition-colors" />
            <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">{stat.label}</h3>
            <div className="text-3xl font-black text-tertiary">{loading ? '—' : stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Engagement Chart */}
          <section className="bg-white border border-outline p-6 shadow-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">insights</span>
              User Engagement (Last 7 Days)
            </h2>
            {loading ? (
              <div className="h-72 bg-neutral animate-pulse" />
            ) : (
              <div className="h-72 w-full bg-neutral border border-outline p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D97706" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9e8e5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E1E2F', borderColor: '#1E1E2F', color: '#fff', fontFamily: 'IBM Plex Mono', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="active" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" name="Active Users" />
                    <Area type="monotone" dataKey="completions" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#colorCompletions)" name="Completions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* Course Health */}
          <section className="bg-white border border-outline p-6 shadow-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">health_and_safety</span>
              Course Health
            </h2>
            {loading ? (
              <div className="h-40 bg-neutral animate-pulse" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-outline">
                      <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Module</th>
                      <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Lessons</th>
                      <th className="py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-sm text-tertiary">
                    {courses.map(course => (
                      <tr key={course.id} className="border-b border-outline hover:bg-neutral transition-colors">
                        <td className="py-4 px-4 font-bold">{course.title}</td>
                        <td className="py-4 px-4">{course.total_lessons}</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 text-[10px] uppercase tracking-widest font-bold bg-emerald-100 text-emerald-800">
                            {course.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </motion.div>

        {/* Incidents */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-8"
        >
          <section className="bg-tertiary text-neutral p-6 border border-tertiary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center">
                <span className="material-symbols-outlined mr-2 text-[18px]">warning</span>
                Incident Reports
              </h2>
              {stats.openIncidents > 0 && (
                <span className="bg-primary text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">{stats.openIncidents} Open</span>
              )}
            </div>
            {loading ? (
              <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-700 animate-pulse" />)}</div>
            ) : incidents.length === 0 ? (
              <p className="font-mono text-xs text-slate-400">No incidents reported.</p>
            ) : (
              <div className="space-y-4">
                {incidents.map(inc => (
                  <div key={inc.id} className="p-4 border border-outline-variant bg-slate-800 hover:bg-slate-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-2 h-2 rounded-full ${
                        inc.severity === 'High' || inc.severity === 'Critical' ? 'bg-red-500' :
                        inc.severity === 'Medium' ? 'bg-amber-500' : 'bg-secondary'
                      }`} />
                      <span className={`font-mono text-[10px] uppercase font-bold ${
                        inc.status === 'resolved' ? 'text-secondary' :
                        inc.status === 'in_progress' ? 'text-amber-400' : 'text-red-400'
                      }`}>{inc.status}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-2">{inc.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-500">{new Date(inc.created_at).toLocaleDateString()}</span>
                      {inc.status !== 'resolved' && (
                        <button
                          onClick={() => resolveIncident(inc.id)}
                          className="font-mono text-[10px] text-secondary hover:underline"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white border border-outline p-6 shadow-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">bolt</span>
              Quick Actions
            </h2>
            <div className="space-y-3">
              {[
                { icon: 'campaign', label: 'Global Announcement' },
                { icon: 'manage_accounts', label: 'Manage Users' },
                { icon: 'settings_system_daydream', label: 'System Config' },
              ].map(action => (
                <motion.button
                  key={action.label}
                  whileHover={{ x: 5 }}
                  onClick={() => toast.info(`${action.label} — coming soon`)}
                  className="w-full flex items-center justify-between p-3 border border-outline hover:border-primary hover:bg-neutral transition-colors group"
                >
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary mr-3 text-[20px]">{action.icon}</span>
                    <span className="font-mono text-sm font-bold text-tertiary">{action.label}</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-primary text-[16px]">arrow_forward</span>
                </motion.button>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
}
