import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type DayData = { name: string; xp: number; avg: number };
type Cert = { id: string; module_title: string; issued_at: string };
type Milestone = { id: string; title: string; description: string; achieved_at: string };

export function Progress() {
  const { profile } = useAuth();
  const [chartData, setChartData] = useState<DayData[]>([]);
  const [radarData, setRadarData] = useState<{ subject: string; A: number; fullMark: number }[]>([]);
  const [certs, setCerts] = useState<Cert[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    async function load() {
      // Last 30 days activity for chart — group into 7 day labels
      const chartDays: DayData[] = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const thirtyAgo = new Date(); thirtyAgo.setDate(thirtyAgo.getDate() - 29);
      const { data: allActivity } = await supabase
        .from('daily_activity')
        .select('activity_date, xp_earned')
        .eq('user_id', profile.id)
        .gte('activity_date', thirtyAgo.toISOString().split('T')[0])
        .order('activity_date');

      // Show last 7 days individually
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const found = (allActivity ?? []).find((a: any) => a.activity_date === dateStr);
        chartDays.push({ name: dayNames[d.getDay()], xp: found?.xp_earned ?? 0, avg: 0 });
      }
      const totalXp = chartDays.reduce((s, d) => s + d.xp, 0);
      const avg = Math.round(totalXp / 7);
      setChartData(chartDays.map(d => ({ ...d, avg })));

      // Proficiency radar from lesson progress by module tags
      const { data: progressData } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, completed_at, lessons(module_id, modules(title, tags))')
        .eq('user_id', profile.id)
        .not('completed_at', 'is', null);

      const tagScores: Record<string, { done: number; total: number }> = {};
      const { data: allLessons } = await supabase
        .from('lessons')
        .select('id, module_id, modules(title, tags)')
        .eq('status', 'published');

      (allLessons ?? []).forEach((l: any) => {
        const tags: string[] = l.modules?.tags ?? [];
        tags.forEach(tag => {
          if (!tagScores[tag]) tagScores[tag] = { done: 0, total: 0 };
          tagScores[tag].total++;
        });
      });

      const completedIds = new Set((progressData ?? []).map((p: any) => p.lesson_id));
      (allLessons ?? []).forEach((l: any) => {
        if (!completedIds.has(l.id)) return;
        const tags: string[] = l.modules?.tags ?? [];
        tags.forEach(tag => {
          if (tagScores[tag]) tagScores[tag].done++;
        });
      });

      const radar = Object.entries(tagScores)
        .slice(0, 6)
        .map(([tag, { done, total }]) => ({
          subject: tag.charAt(0).toUpperCase() + tag.slice(1),
          A: total > 0 ? Math.round((done / total) * 100) : 0,
          fullMark: 100,
        }));
      setRadarData(radar.length > 0 ? radar : [
        { subject: 'Algorithms', A: 0, fullMark: 100 },
        { subject: 'Data Structs', A: 0, fullMark: 100 },
        { subject: 'Memory', A: 0, fullMark: 100 },
        { subject: 'Networking', A: 0, fullMark: 100 },
        { subject: 'Concurrency', A: 0, fullMark: 100 },
        { subject: 'Systems', A: 0, fullMark: 100 },
      ]);

      // Certifications
      const { data: certData } = await supabase
        .from('certifications')
        .select('id, issued_at, modules(title)')
        .eq('user_id', profile.id)
        .order('issued_at', { ascending: false });
      if (certData) setCerts(certData.map((c: any) => ({ id: c.id, module_title: c.modules?.title, issued_at: c.issued_at })));

      // Milestones
      const { data: msData } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', profile.id)
        .order('achieved_at', { ascending: false })
        .limit(5);
      if (msData) setMilestones(msData);

      setLoading(false);
    }
    load();
  }, [profile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-end justify-between border-b-2 border-tertiary pb-6">
        <div>
          <h1 className="text-4xl font-serif font-black tracking-tight text-tertiary mb-2">Developer Progress</h1>
          <p className="font-mono text-sm text-slate-600">@{profile?.username}</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs uppercase tracking-widest font-bold text-primary mb-1">Total XP</div>
          <div className="text-4xl font-black text-tertiary">{profile?.xp?.toLocaleString() ?? 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              Learning Consistency (Last 7 Days)
            </h2>
            {loading ? (
              <div className="h-72 bg-neutral animate-pulse" />
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9e8e5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E1E2F', borderColor: '#1E1E2F', color: '#fff', fontFamily: 'IBM Plex Mono', fontSize: '12px' }} />
                    <Bar dataKey="xp" fill="#D97706" radius={[4, 4, 0, 0]} name="Daily XP" maxBarSize={40} />
                    <Line type="monotone" dataKey="avg" stroke="#0D9488" strokeWidth={3} dot={{ r: 4, fill: '#0D9488', strokeWidth: 2, stroke: '#fff' }} name="7-Day Avg" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* Proficiency Radar */}
          <section className="bg-white border border-outline p-6 shadow-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">grid_on</span>
              Skill Proficiency
            </h2>
            {loading ? (
              <div className="h-72 bg-neutral animate-pulse" />
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#e9e8e5" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Proficiency" dataKey="A" stroke="#D97706" fill="#D97706" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E1E2F', borderColor: '#1E1E2F', color: '#fff', fontFamily: 'IBM Plex Mono', fontSize: '12px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        </motion.div>

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
            {certs.length === 0 ? (
              <p className="font-mono text-xs text-slate-400">Complete a module to earn your first certificate.</p>
            ) : (
              <div className="space-y-4">
                {certs.map(cert => (
                  <div key={cert.id} className="p-4 border border-outline-variant bg-slate-800 flex items-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4 shrink-0">
                      <span className="material-symbols-outlined text-white">emoji_events</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{cert.module_title}</h3>
                      <p className="font-mono text-[10px] text-slate-400 mt-1">Issued: {new Date(cert.issued_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Milestones */}
          <section className="bg-white border border-outline p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">flag</span>
              Recent Milestones
            </h2>
            {milestones.length === 0 ? (
              <p className="font-mono text-xs text-slate-400">No milestones yet. Keep learning!</p>
            ) : (
              <div className="relative border-l-2 border-outline ml-3 space-y-6">
                {milestones.map((ms, i) => (
                  <div key={ms.id} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${i === 0 ? 'bg-primary' : 'bg-secondary'}`} />
                    <div className="font-mono text-[10px] text-slate-400 mb-1">{new Date(ms.achieved_at).toLocaleDateString()}</div>
                    <h3 className="font-bold text-tertiary text-sm">{ms.title}</h3>
                    {ms.description && <p className="text-xs text-slate-600 mt-1">{ms.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
}
