import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type RecentLesson = { id: string; title: string; module_title: string; completed_at: string | null };
type Thread = { id: string; title: string; author: string; reply_count: number };
type ActivityDay = { activity_date: string; xp_earned: number };

export function Dashboard() {
  const { profile } = useAuth();
  const [recentLessons, setRecentLessons] = useState<RecentLesson[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activity, setActivity] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    async function load() {
      // Recent lessons
      const { data: progress } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, completed_at, lessons(id, title, modules(title))')
        .eq('user_id', profile!.id)
        .order('started_at', { ascending: false })
        .limit(3);

      if (progress) {
        setRecentLessons(progress.map((p: any) => ({
          id: p.lessons?.id,
          title: p.lessons?.title,
          module_title: p.lessons?.modules?.title,
          completed_at: p.completed_at,
        })));
      }

      // Community threads
      const { data: threadData } = await supabase
        .from('threads')
        .select('id, title, reply_count, profiles(username)')
        .order('created_at', { ascending: false })
        .limit(3);

      if (threadData) {
        setThreads(threadData.map((t: any) => ({
          id: t.id,
          title: t.title,
          author: t.profiles?.username ?? 'unknown',
          reply_count: t.reply_count,
        })));
      }

      // Activity heatmap (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { data: activityData } = await supabase
        .from('daily_activity')
        .select('activity_date, xp_earned')
        .eq('user_id', profile!.id)
        .gte('activity_date', thirtyDaysAgo.toISOString().split('T')[0]);

      if (activityData) setActivity(activityData);
      setLoading(false);
    }
    load();
  }, [profile]);

  // Build 30-day heatmap from real data
  const heatmap = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const found = activity.find(a => a.activity_date === dateStr);
    return found?.xp_earned ?? 0;
  });

  const maxXp = Math.max(...heatmap, 1);

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
          <h1 className="text-4xl font-serif font-black tracking-tight text-tertiary mb-2">
            Welcome back, {profile?.display_name || profile?.username || 'Scholar'}.
          </h1>
          <p className="font-mono text-sm text-slate-600">Continue your craft where you left off.</p>
        </div>
        <Link
          to="/path"
          className="px-6 py-3 bg-primary text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-amber-700 transition-colors border border-primary shadow-[4px_4px_0px_0px_rgba(30,30,47,1)] hover:shadow-[2px_2px_0px_0px_rgba(30,30,47,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          Resume Study
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Quote */}
          <section className="p-8 bg-white border-l-4 border-primary shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-9xl text-neutral opacity-50 font-serif">"</div>
            <p className="font-serif italic text-2xl text-slate-700 relative z-10">
              "First, solve the problem. Then, write the code."
            </p>
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mt-4 relative z-10">— John Johnson</p>
          </section>

          {/* Activity Metrics */}
          <section className="bg-white border border-outline p-6 shadow-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">bar_chart</span>
              Activity Metrics
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="border-l-4 border-primary pl-4">
                <div className="text-3xl font-black text-tertiary">{profile?.streak_days ?? 0}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mt-1">Days Streak</div>
              </div>
              <div className="border-l-4 border-secondary pl-4">
                <div className="text-3xl font-black text-tertiary">{profile?.xp?.toLocaleString() ?? 0}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mt-1">Total XP</div>
              </div>
              <div className="border-l-4 border-tertiary pl-4">
                <div className="text-3xl font-black text-tertiary">{recentLessons.filter(l => l.completed_at).length}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mt-1">Lessons Done</div>
              </div>
            </div>

            {/* Heatmap */}
            <div className="mt-8 pt-6 border-t border-outline">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Contribution Graph</span>
                <span className="font-mono text-[10px] text-slate-400">Last 30 days</span>
              </div>
              <div className="flex gap-1">
                {heatmap.map((xp, i) => (
                  <div
                    key={i}
                    title={`${xp} XP`}
                    className={`h-8 flex-1 border border-outline transition-colors ${
                      xp === 0 ? 'bg-neutral' :
                      xp < maxXp * 0.33 ? 'bg-amber-200' :
                      xp < maxXp * 0.66 ? 'bg-amber-400' : 'bg-primary'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Recent Material */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 flex items-center">
                <span className="material-symbols-outlined mr-2 text-[18px]">history</span>
                Recent Material
              </h2>
              <Link to="/path" className="font-mono text-[10px] uppercase tracking-widest text-primary hover:underline">View All</Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-white border border-outline animate-pulse" />
                ))}
              </div>
            ) : recentLessons.length === 0 ? (
              <div className="p-8 bg-white border border-outline text-center">
                <p className="font-mono text-sm text-slate-500">No lessons started yet.</p>
                <Link to="/path" className="font-mono text-xs text-primary hover:underline mt-2 block">Start your first lesson →</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentLessons.map((item) => (
                  <Link
                    key={item.id}
                    to={`/lesson/${item.id}`}
                    className="flex items-center justify-between p-4 bg-white border border-outline hover:border-primary transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-4 ${item.completed_at ? 'bg-secondary' : 'bg-primary'}`} />
                      <div>
                        <h3 className="font-bold text-tertiary group-hover:text-primary transition-colors">{item.title}</h3>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{item.module_title}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-8"
        >
          {/* Community Pulse */}
          <section className="bg-white border border-outline p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">forum</span>
              Community Pulse
            </h2>

            {threads.length === 0 ? (
              <p className="font-mono text-xs text-slate-400">No threads yet.</p>
            ) : (
              <div className="space-y-4">
                {threads.map((thread) => (
                  <div key={thread.id} className="pb-4 border-b border-outline last:border-0 last:pb-0">
                    <h3 className="font-medium text-sm text-tertiary hover:text-primary cursor-pointer mb-1">{thread.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-500">by @{thread.author}</span>
                      <span className="font-mono text-[10px] text-secondary">{thread.reply_count} replies</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/community"
              className="block text-center w-full mt-6 py-2 bg-neutral border border-outline text-tertiary font-mono text-xs uppercase tracking-widest hover:bg-outline-variant transition-colors"
            >
              Join Discussion
            </Link>
          </section>

          {/* Quick Links */}
          <section className="bg-tertiary text-neutral p-6 border border-tertiary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)]">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-400 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/path" className="flex items-center text-white hover:text-primary transition-colors">
                <span className="material-symbols-outlined mr-3 text-[18px]">map</span>
                <span className="font-mono text-sm">View Learning Path</span>
              </Link>
              <Link to="/contests" className="flex items-center text-white hover:text-primary transition-colors">
                <span className="material-symbols-outlined mr-3 text-[18px]">emoji_events</span>
                <span className="font-mono text-sm">Join a Contest</span>
              </Link>
              <Link to="/progress" className="flex items-center text-white hover:text-primary transition-colors">
                <span className="material-symbols-outlined mr-3 text-[18px]">monitoring</span>
                <span className="font-mono text-sm">View Progress</span>
              </Link>
            </div>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
}
