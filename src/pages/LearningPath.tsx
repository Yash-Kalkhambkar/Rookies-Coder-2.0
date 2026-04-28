import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Module = {
  id: string;
  title: string;
  description: string;
  order_index: number;
  tags: string[];
  total_lessons: number;
  completed_lessons: number;
  first_lesson_id: string | null;
};

export function LearningPath() {
  const { profile } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    async function load() {
      // Fetch all published modules with their lessons
      const { data: modulesData } = await supabase
        .from('modules')
        .select('id, title, description, order_index, tags, lessons(id, order_index)')
        .eq('status', 'published')
        .order('order_index');

      if (!modulesData) { setLoading(false); return; }

      // Fetch user progress
      const { data: progressData } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, completed_at')
        .eq('user_id', profile.id)
        .not('completed_at', 'is', null);

      const completedIds = new Set((progressData ?? []).map((p: any) => p.lesson_id));

      const enriched: Module[] = modulesData.map((m: any) => {
        const lessons = m.lessons ?? [];
        const sorted = [...lessons].sort((a: any, b: any) => a.order_index - b.order_index);
        return {
          id: m.id,
          title: m.title,
          description: m.description,
          order_index: m.order_index,
          tags: m.tags ?? [],
          total_lessons: lessons.length,
          completed_lessons: lessons.filter((l: any) => completedIds.has(l.id)).length,
          first_lesson_id: sorted[0]?.id ?? null,
        };
      });

      setModules(enriched);
      setLoading(false);
    }
    load();
  }, [profile]);

  const totalLessons = modules.reduce((s, m) => s + m.total_lessons, 0);
  const completedLessons = modules.reduce((s, m) => s + m.completed_lessons, 0);
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  function getModuleStatus(m: Module) {
    if (m.completed_lessons === m.total_lessons && m.total_lessons > 0) return 'completed';
    if (m.completed_lessons > 0) return 'in_progress';
    // Lock if previous module not completed
    const prev = modules.find(x => x.order_index === m.order_index - 1);
    if (prev && prev.completed_lessons < prev.total_lessons) return 'locked';
    return 'available';
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white border border-outline animate-pulse" />)}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto relative">
      <div className="flex items-end justify-between border-b-2 border-tertiary pb-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-black tracking-tight text-tertiary mb-2">Learning Path</h1>
          <p className="font-mono text-sm text-slate-600">Your structured journey through the craft of code.</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs uppercase tracking-widest font-bold text-primary mb-1">Overall Progress</div>
          <div className="text-3xl font-black text-tertiary">{overallPct}%</div>
        </div>
      </div>

      <div className="space-y-16 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline before:to-transparent">
        {modules.map((mod, idx) => {
          const status = getModuleStatus(mod);
          const pct = mod.total_lessons > 0 ? Math.round((mod.completed_lessons / mod.total_lessons) * 100) : 0;

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            >
              {/* Timeline dot */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-neutral shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${
                status === 'completed' ? 'bg-secondary' :
                status === 'in_progress' ? 'bg-primary' :
                status === 'available' ? 'bg-slate-400' : 'bg-outline-variant'
              }`}>
                <span className="material-symbols-outlined text-white">
                  {status === 'completed' ? 'check' : status === 'in_progress' ? 'play_arrow' : status === 'locked' ? 'lock' : 'radio_button_unchecked'}
                </span>
              </div>

              {/* Card */}
              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-white shadow-sm ${
                status === 'in_progress' ? 'border-2 border-primary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)]' :
                status === 'locked' ? 'border border-outline opacity-60' : 'border border-outline'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-[10px] uppercase tracking-widest font-bold ${
                    status === 'completed' ? 'text-secondary' :
                    status === 'in_progress' ? 'text-primary' : 'text-slate-500'
                  }`}>Module {mod.order_index}</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {status === 'completed' ? 'Completed' :
                     status === 'in_progress' ? `In Progress (${pct}%)` :
                     status === 'locked' ? 'Locked' : 'Available'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-tertiary mb-2">{mod.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{mod.description}</p>

                {status === 'in_progress' && (
                  <div className="w-full bg-neutral h-2 mb-4 border border-outline">
                    <div className="bg-primary h-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {mod.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-neutral border border-outline font-mono text-[10px] text-slate-500">{tag}</span>
                  ))}
                </div>

                {status !== 'locked' && mod.first_lesson_id && (
                  <Link
                    to={`/lesson/${mod.first_lesson_id}`}
                    className="inline-block px-4 py-2 bg-tertiary text-white font-mono text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
                  >
                    {status === 'completed' ? 'Review' : status === 'in_progress' ? 'Continue' : 'Start'}
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating stats */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="fixed bottom-8 right-8 bg-tertiary text-white p-4 border border-tertiary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)] z-20 hidden lg:block"
      >
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3">Path Statistics</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-8">
            <span className="text-sm">Total Modules</span>
            <span className="font-mono font-bold">{modules.length}</span>
          </div>
          <div className="flex justify-between items-center gap-8">
            <span className="text-sm">Completed</span>
            <span className="font-mono font-bold text-secondary">{modules.filter(m => getModuleStatus(m) === 'completed').length}</span>
          </div>
          <div className="flex justify-between items-center gap-8">
            <span className="text-sm">Progress</span>
            <span className="font-mono font-bold text-primary">{overallPct}%</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
