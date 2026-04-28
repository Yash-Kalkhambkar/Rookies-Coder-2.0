import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Section = {
  id: string;
  type: 'text' | 'code_example' | 'video' | 'audio' | 'exercise';
  order_index: number;
  content: string | null;
  language: string | null;
  code: string | null;
  media_url: string | null;
  prompt: string | null;
  starter_code: string | null;
  expected_output: string | null;
};

type LessonData = {
  id: string;
  title: string;
  description: string;
  order_index: number;
  xp_reward: number;
  module: { id: string; title: string; order_index: number };
  sections: Section[];
  siblings: { id: string; title: string; order_index: number; completed: boolean }[];
};

export function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('> Ready for execution.');
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // If no lessonId, get the first available lesson
      let targetId = lessonId;
      if (!targetId) {
        const { data } = await supabase
          .from('lessons')
          .select('id')
          .eq('status', 'published')
          .order('order_index')
          .limit(1)
          .single();
        if (data) targetId = data.id;
        else { setLoading(false); return; }
      }

      // Fetch lesson + module
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('id, title, description, order_index, xp_reward, module_id, modules(id, title, order_index)')
        .eq('id', targetId)
        .single();

      if (!lessonData) { setLoading(false); return; }

      // Fetch sections
      const { data: sections } = await supabase
        .from('lesson_sections')
        .select('*')
        .eq('lesson_id', targetId)
        .order('order_index');

      // Fetch sibling lessons in same module
      const { data: siblings } = await supabase
        .from('lessons')
        .select('id, title, order_index')
        .eq('module_id', lessonData.module_id)
        .eq('status', 'published')
        .order('order_index');

      // Check completion
      if (profile) {
        const { data: progress } = await supabase
          .from('user_lesson_progress')
          .select('completed_at')
          .eq('user_id', profile.id)
          .eq('lesson_id', targetId)
          .single();
        setCompleted(!!progress?.completed_at);

        // Get completed sibling ids
        const siblingIds = (siblings ?? []).map((s: any) => s.id);
        const { data: siblingProgress } = await supabase
          .from('user_lesson_progress')
          .select('lesson_id, completed_at')
          .eq('user_id', profile.id)
          .in('lesson_id', siblingIds);

        const completedSet = new Set((siblingProgress ?? []).filter((p: any) => p.completed_at).map((p: any) => p.lesson_id));

        const exercise = (sections ?? []).find((s: any) => s.type === 'exercise');
        if (exercise?.starter_code) setCode(exercise.starter_code);

        setLesson({
          id: lessonData.id,
          title: lessonData.title,
          description: lessonData.description,
          order_index: lessonData.order_index,
          xp_reward: lessonData.xp_reward,
          module: lessonData.modules as any,
          sections: (sections ?? []) as Section[],
          siblings: (siblings ?? []).map((s: any) => ({
            id: s.id,
            title: s.title,
            order_index: s.order_index,
            completed: completedSet.has(s.id),
          })),
        });
      }

      setLoading(false);
    }
    load();
  }, [lessonId, profile]);

  const handleRun = () => {
    setIsRunning(true);
    setOutput('> Compiling...');
    setTimeout(() => {
      const exercise = lesson?.sections.find(s => s.type === 'exercise');
      if (exercise?.expected_output && (code.includes('for') || code.includes('while') || code.includes('loop'))) {
        setOutput(`> Execution successful.\n${exercise.expected_output}`);
      } else {
        setOutput('> Execution successful.\n(No output)');
      }
      setIsRunning(false);
    }, 800);
  };

  const handleMarkComplete = async () => {
    if (!profile || !lesson) return;
    setMarking(true);

    // Upsert progress
    const { error } = await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: profile.id,
        lesson_id: lesson.id,
        completed_at: new Date().toISOString(),
        xp_earned: lesson.xp_reward,
      }, { onConflict: 'user_id,lesson_id' });

    if (error) {
      toast.error('Failed to save progress');
      setMarking(false);
      return;
    }

    // Update XP on profile
    await supabase
      .from('profiles')
      .update({ xp: (profile.xp ?? 0) + lesson.xp_reward })
      .eq('id', profile.id);

    // Update daily activity
    const today = new Date().toISOString().split('T')[0];
    const { error: activityError } = await supabase.from('daily_activity').upsert({
      user_id: profile.id,
      activity_date: today,
      xp_earned: lesson.xp_reward,
      lessons_completed: 1,
    }, { onConflict: 'user_id,activity_date' });
    if (activityError) console.warn('activity upsert:', activityError.message);

    setCompleted(true);
    toast.success(`+${lesson.xp_reward} XP earned!`);

    // Navigate to next lesson
    const nextLesson = lesson.siblings.find(s => s.order_index === lesson.order_index + 1);
    if (nextLesson) {
      setTimeout(() => navigate(`/lesson/${nextLesson.id}`), 1000);
    }
    setMarking(false);
  };

  if (loading) {
    return (
      <div className="flex gap-8 max-w-7xl mx-auto">
        <div className="flex-1 bg-white border border-outline animate-pulse min-h-[600px]" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-7xl mx-auto text-center py-20">
        <p className="font-mono text-slate-500">Lesson not found.</p>
        <Link to="/path" className="font-mono text-xs text-primary hover:underline mt-4 block">← Back to Learning Path</Link>
      </div>
    );
  }

  const prevLesson = lesson.siblings.find(s => s.order_index === lesson.order_index - 1);
  const nextLesson = lesson.siblings.find(s => s.order_index === lesson.order_index + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex gap-8 max-w-7xl mx-auto"
    >
      {/* Main Content */}
      <div className="flex-1 bg-[#FFFCF8] border-2 border-outline shadow-md min-h-[800px] flex flex-col">
        {/* Header */}
        <div className="p-10 lg:p-14 border-b-2 border-outline bg-neutral relative">
          <div className="absolute top-0 right-0 w-16 h-16 border-l-2 border-b-2 border-outline bg-outline-variant flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-tertiary">
              {lesson.module.order_index}.{lesson.order_index}
            </span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-primary mb-4">
            Module {lesson.module.order_index}: {lesson.module.title}
          </div>
          <h1 className="text-5xl font-serif font-black tracking-tight text-tertiary mb-6">{lesson.title}</h1>
          <p className="font-body text-xl text-slate-700 leading-relaxed max-w-3xl">{lesson.description}</p>
          {completed && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-secondary text-white font-mono text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-[14px]">check</span>
              Completed · +{lesson.xp_reward} XP
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="p-10 lg:p-14 flex-1 space-y-12">
          {lesson.sections.length === 0 && (
            <div className="p-8 bg-neutral border border-outline text-center">
              <span className="material-symbols-outlined text-slate-300 text-4xl mb-4 block">menu_book</span>
              <p className="font-mono text-sm text-slate-500">Content for this lesson is being prepared.</p>
              <p className="font-mono text-xs text-slate-400 mt-2">Mark it complete to continue your journey.</p>
            </div>
          )}
          {lesson.sections.map((section, i) => (
            <section key={section.id}>
              {section.type === 'text' && (
                <>
                  <h2 className="text-3xl font-serif font-bold text-tertiary mb-6 flex items-center border-b border-outline pb-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-4 font-sans">{i + 1}</span>
                    The Concept
                  </h2>
                  <p className="text-slate-700 leading-relaxed text-lg">{section.content}</p>
                </>
              )}

              {section.type === 'code_example' && (
                <>
                  <h2 className="text-3xl font-serif font-bold text-tertiary mb-6 flex items-center border-b border-outline pb-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-4 font-sans">{i + 1}</span>
                    Code Example
                  </h2>
                  <div className="border border-outline bg-tertiary rounded-sm overflow-hidden">
                    <div className="flex items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="mx-auto font-mono text-xs text-slate-400">example.{section.language ?? 'rs'}</div>
                    </div>
                    <pre className="p-4 font-mono text-sm text-slate-300 overflow-x-auto">{section.code}</pre>
                  </div>
                </>
              )}

              {section.type === 'exercise' && (
                <>
                  <h2 className="text-3xl font-serif font-bold text-tertiary mb-6 flex items-center border-b border-outline pb-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-4 font-sans">{i + 1}</span>
                    Try It Yourself
                  </h2>
                  <p className="mb-6 text-slate-700">{section.prompt}</p>
                  <div className="border border-outline bg-neutral min-h-[200px] relative">
                    <div className="absolute top-0 right-0 flex border-b border-l border-outline bg-white z-10">
                      <button onClick={() => setCode(section.starter_code ?? '')} className="px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:bg-outline-variant transition-colors border-r border-outline">Reset</button>
                      <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary font-bold hover:bg-amber-50 transition-colors flex items-center disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[14px] mr-1">{isRunning ? 'hourglass_empty' : 'play_arrow'}</span>
                        {isRunning ? 'Running' : 'Run'}
                      </button>
                    </div>
                    <textarea
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      className="w-full h-full min-h-[200px] p-4 pt-10 font-mono text-sm text-tertiary bg-transparent outline-none resize-y"
                      spellCheck={false}
                    />
                  </div>
                  <div className="mt-4 border border-outline bg-tertiary p-4 min-h-[100px] font-mono text-xs text-green-400 whitespace-pre-wrap">
                    <div className="text-slate-500 mb-2">Output:</div>
                    {output}
                  </div>
                </>
              )}

              {section.type === 'video' && (
                <>
                  <h2 className="text-3xl font-serif font-bold text-tertiary mb-6 flex items-center border-b border-outline pb-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-4 font-sans">{i + 1}</span>
                    Visual Explanation
                  </h2>
                  <div className="border border-outline bg-neutral p-2 shadow-sm">
                    {section.media_url ? (
                      <video controls className="w-full aspect-video object-cover bg-black" poster="https://picsum.photos/seed/lesson/800/450">
                        <source src={section.media_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      // Fake video player placeholder
                      <div className="w-full aspect-video bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
                        <img src="https://picsum.photos/seed/lesson/800/450" alt="video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                        <div className="relative z-10 flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors shadow-lg">
                            <span className="material-symbols-outlined text-white text-4xl ml-1">play_arrow</span>
                          </div>
                          <p className="font-mono text-xs text-white/70 uppercase tracking-widest">Sample Video Lecture</p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-900/80 flex items-center px-4 gap-3">
                          <span className="material-symbols-outlined text-white text-[18px]">play_arrow</span>
                          <div className="flex-1 h-1 bg-slate-600 rounded-full"><div className="w-1/3 h-full bg-primary rounded-full" /></div>
                          <span className="font-mono text-[10px] text-white/60">3:42</span>
                          <span className="material-symbols-outlined text-white text-[18px]">volume_up</span>
                          <span className="material-symbols-outlined text-white text-[18px]">fullscreen</span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {section.type === 'audio' && (
                <>
                  <h2 className="text-3xl font-serif font-bold text-tertiary mb-6 flex items-center border-b border-outline pb-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-4 font-sans">{i + 1}</span>
                    Audio Guide
                  </h2>
                  <div className="border border-outline bg-neutral p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-outline flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">graphic_eq</span>
                    </div>
                    {section.media_url ? (
                      <audio controls className="w-full h-10">
                        <source src={section.media_url} type="audio/ogg" />
                        <source src={section.media_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <div className="flex-1 flex items-center gap-3">
                        <button className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-white text-[16px] ml-0.5">play_arrow</span>
                        </button>
                        <div className="flex-1 h-1.5 bg-outline rounded-full"><div className="w-0 h-full bg-primary rounded-full" /></div>
                        <span className="font-mono text-[10px] text-slate-500">0:00 / 8:15</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>
          ))}
        </div>

        {/* Footer nav */}
        <div className="p-6 border-t border-outline bg-neutral flex items-center justify-between">
          {prevLesson ? (
            <Link to={`/lesson/${prevLesson.id}`} className="px-6 py-3 border border-outline bg-white text-tertiary font-mono text-sm uppercase tracking-widest font-bold hover:bg-outline-variant transition-colors">
              ← Previous
            </Link>
          ) : <div />}

          {!completed ? (
            <button
              onClick={handleMarkComplete}
              disabled={marking}
              className="px-6 py-3 bg-primary text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-amber-700 transition-colors border border-primary shadow-[4px_4px_0px_0px_rgba(30,30,47,1)] hover:shadow-[2px_2px_0px_0px_rgba(30,30,47,1)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50"
            >
              {marking ? 'Saving...' : `Mark Complete · +${lesson.xp_reward} XP`}
            </button>
          ) : nextLesson ? (
            <Link to={`/lesson/${nextLesson.id}`} className="px-6 py-3 bg-secondary text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-teal-700 transition-colors border border-secondary">
              Next Lesson →
            </Link>
          ) : (
            <Link to="/path" className="px-6 py-3 bg-secondary text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-teal-700 transition-colors border border-secondary">
              Back to Path →
            </Link>
          )}
        </div>
      </div>

      {/* Sidebar manifest */}
      <div className="w-72 shrink-0 hidden xl:block">
        <div className="sticky top-24 bg-white border border-outline shadow-sm p-6">
          <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-tertiary mb-6 border-b border-outline pb-2">
            Lesson Manifest
          </h3>
          <ul className="space-y-4 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-outline">
            {lesson.siblings.map(s => (
              <li key={s.id} className="relative pl-8">
                <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 border-white z-10 flex items-center justify-center ${
                  s.id === lesson.id ? 'bg-primary' :
                  s.completed ? 'bg-secondary' : 'bg-neutral border-outline'
                }`}>
                  {s.completed && s.id !== lesson.id && (
                    <span className="material-symbols-outlined text-white text-[12px]">check</span>
                  )}
                  {s.id === lesson.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                {s.id === lesson.id ? (
                  <span className="font-mono text-xs font-bold text-tertiary">{s.title}</span>
                ) : (
                  <Link to={`/lesson/${s.id}`} className={`font-mono text-xs hover:text-primary transition-colors ${s.completed ? 'text-slate-400 line-through' : 'text-slate-500'}`}>
                    {s.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
