import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// ── Wandbox API — free, no auth, runs code in browser ─────────────────────
const WANDBOX_URL = 'https://wandbox.org/api/compile.json';

const COMPILER_MAP: Record<string, string> = {
  rust:       'rust-1.82.0',
  python:     'cpython-3.12.7',
  javascript: 'nodejs-20.11.0',
  js:         'nodejs-20.11.0',
  cpp:        'gcc-13.2.0',
  'c++':      'gcc-13.2.0',
  c:          'gcc-13.2.0-c',
  go:         'go-1.22.0',
  ruby:       'ruby-3.3.0',
  java:       'openjdk-21.0.0',
};

async function runCode(code: string, language: string): Promise<string> {
  const compiler = COMPILER_MAP[language.toLowerCase()] ?? 'cpython-3.12.7';
  try {
    const res = await fetch(WANDBOX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compiler, code, save: false }),
    });
    const data = await res.json();
    if (data.compiler_error) return `Compile error:\n${data.compiler_error}`;
    if (data.program_error)  return `Runtime error:\n${data.program_error}`;
    return data.program_output?.trim() || '(No output)';
  } catch {
    return 'Error: Could not reach execution server. Check your connection.';
  }
}

// ── Fake interactive audio player ─────────────────────────────────────────
function FakeAudioPlayer({ title = 'Audio Guide' }: { title?: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 495; // 8:15

  const toggle = () => {
    if (playing) {
      clearInterval(intervalRef.current!);
      setPlaying(false);
    } else {
      setPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { clearInterval(intervalRef.current!); setPlaying(false); return 0; }
          return p + 100 / DURATION;
        });
      }, 1000);
    }
  };

  const fmt = (secs: number) => {
    const s = Math.floor(secs);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  useEffect(() => () => clearInterval(intervalRef.current!), []);

  return (
    <div className="border border-outline bg-neutral p-4 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 bg-white border border-outline flex items-center justify-center shrink-0">
        <span className={`material-symbols-outlined text-primary ${playing ? 'animate-pulse' : ''}`}>graphic_eq</span>
      </div>
      <div className="flex-1 flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shrink-0 hover:bg-amber-700 transition-colors"
        >
          <span className="material-symbols-outlined text-white text-[18px] ml-0.5">
            {playing ? 'pause' : 'play_arrow'}
          </span>
        </button>
        <div className="flex-1 flex flex-col gap-1">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">{title}</span>
          <div
            className="flex-1 h-1.5 bg-outline rounded-full cursor-pointer"
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress(((e.clientX - rect.left) / rect.width) * 100);
            }}
          >
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span className="font-mono text-[10px] text-slate-500 shrink-0">
          {fmt((progress / 100) * DURATION)} / {fmt(DURATION)}
        </span>
      </div>
    </div>
  );
}

// ── YouTube embed ──────────────────────────────────────────────────────────
// Curated coding tutorial videos per topic
const YOUTUBE_VIDEOS: Record<string, string> = {
  default:     'dQw4w9WgXcQ', // fallback
  loops:       'rgWgdzEeY-8', // Loops explained
  variables:   'zOjov-2OZ0E', // Variables & types
  functions:   'N8ap4k_1QEQ', // Functions
  algorithms:  'kPRA0W1kECg', // Algorithms
  recursion:   'IJDJ0kBx2LM', // Recursion
  sorting:     'kgBjXUE_Nwc', // Sorting algorithms
  search:      'P3YID7liBug', // Binary search
  match:       'zF34dRivLOw', // Pattern matching
};

function getYouTubeId(lessonTitle: string): string {
  const t = lessonTitle.toLowerCase();
  if (t.includes('loop') || t.includes('iter'))   return YOUTUBE_VIDEOS.loops;
  if (t.includes('variable') || t.includes('type')) return YOUTUBE_VIDEOS.variables;
  if (t.includes('function') || t.includes('scope')) return YOUTUBE_VIDEOS.functions;
  if (t.includes('algorithm'))                     return YOUTUBE_VIDEOS.algorithms;
  if (t.includes('sort'))                          return YOUTUBE_VIDEOS.sorting;
  if (t.includes('search') || t.includes('binary')) return YOUTUBE_VIDEOS.search;
  if (t.includes('match') || t.includes('pattern')) return YOUTUBE_VIDEOS.match;
  return YOUTUBE_VIDEOS.default;
}

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

  const handleRun = async () => {
    setIsRunning(true);
    const exercise = lesson?.sections.find(s => s.type === 'exercise');
    const lang = exercise?.language
      ?? lesson?.sections.find(s => s.type === 'code_example')?.language
      ?? 'python';
    setOutput(`> Compiling ${lang}...`);
    const result = await runCode(code, lang);
    setOutput(`> Execution complete.\n${result}`);
    setIsRunning(false);
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

                  {/* IDE container */}
                  <div className="border border-outline overflow-hidden shadow-md">
                    {/* IDE title bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <span className="font-mono text-xs text-slate-400">
                          exercise.{section.language ?? lesson.sections.find(s => s.type === 'code_example')?.language ?? 'rs'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCode(section.starter_code ?? '')}
                          className="px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-700 transition-colors rounded"
                        >
                          Reset
                        </button>
                        <button
                          onClick={handleRun}
                          disabled={isRunning}
                          className="px-4 py-1 bg-primary text-white font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-amber-700 transition-colors rounded flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {isRunning ? 'hourglass_empty' : 'play_arrow'}
                          </span>
                          {isRunning ? 'Running...' : 'Run Code'}
                        </button>
                      </div>
                    </div>

                    {/* Editor area with line numbers */}
                    <div className="flex bg-slate-900 min-h-[220px]">
                      {/* Line numbers */}
                      <div className="select-none py-4 px-3 bg-slate-800/50 border-r border-slate-700 text-right min-w-[3rem]">
                        {code.split('\n').map((_, idx) => (
                          <div key={idx} className="font-mono text-xs text-slate-600 leading-6">{idx + 1}</div>
                        ))}
                      </div>
                      {/* Code textarea */}
                      <textarea
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        className="flex-1 py-4 px-4 font-mono text-sm text-slate-200 bg-transparent outline-none resize-none leading-6 min-h-[220px]"
                        spellCheck={false}
                        rows={Math.max(8, code.split('\n').length + 1)}
                      />
                    </div>

                    {/* Output console */}
                    <div className="border-t border-slate-700 bg-slate-950 p-4 min-h-[100px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Output</span>
                      </div>
                      <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap">{output}</pre>
                    </div>
                  </div>
                </>
              )}

              {section.type === 'video' && (
                <>
                  <h2 className="text-3xl font-serif font-bold text-tertiary mb-6 flex items-center border-b border-outline pb-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-4 font-sans">{i + 1}</span>
                    Visual Explanation
                  </h2>
                  <div className="border border-outline shadow-sm overflow-hidden">
                    <iframe
                      className="w-full aspect-video"
                      src={`https://www.youtube.com/embed/${getYouTubeId(lesson.title)}?rel=0&modestbranding=1`}
                      title="Lesson video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </>
              )}

              {section.type === 'audio' && (
                <>
                  <h2 className="text-3xl font-serif font-bold text-tertiary mb-6 flex items-center border-b border-outline pb-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-4 font-sans">{i + 1}</span>
                    Audio Guide
                  </h2>
                  <FakeAudioPlayer title={`${lesson.title} — Audio Walkthrough`} />
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
