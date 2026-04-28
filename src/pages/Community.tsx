import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Thread = {
  id: string;
  title: string;
  body: string;
  author: string;
  category: string;
  reply_count: number;
  like_count: number;
  views: number;
  time: string;
  is_solved: boolean;
  tags: string[];
  liked: boolean;
};

type Scholar = { username: string; xp: number; rank: number };

const CATEGORIES = ['Discussion', 'Help & Support', 'Showcase'];

export function Community() {
  const { profile } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'latest' | 'top' | 'unanswered'>('latest');
  const [category, setCategory] = useState('All Categories');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', body: '', category: 'Discussion', tags: '' });
  const [submitting, setSubmitting] = useState(false);

  async function loadThreads() {
    setLoading(true);
    let query = supabase
      .from('threads')
      .select('id, title, body, category, reply_count, like_count, views, is_solved, tags, created_at, profiles!threads_author_id_fkey(username)');

    if (category !== 'All Categories') query = query.eq('category', category);
    if (filter === 'top') query = query.order('like_count', { ascending: false });
    else if (filter === 'unanswered') query = query.eq('reply_count', 0).order('created_at', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data, error } = await query.limit(20);

    if (error) {
      console.error('threads error:', error);
      setLoading(false);
      return;
    }

    const rows = data ?? [];

    // Get liked threads for current user
    let likedSet = new Set<string>();
    if (profile && rows.length > 0) {
      const { data: likes } = await supabase
        .from('thread_likes')
        .select('thread_id')
        .eq('user_id', profile.id)
        .in('thread_id', rows.map((t: any) => t.id));
      likedSet = new Set((likes ?? []).map((l: any) => l.thread_id));
    }

    setThreads(rows.map((t: any) => ({
      id: t.id,
      title: t.title,
      body: t.body,
      author: t.profiles?.username ?? 'anonymous',
      category: t.category,
      reply_count: t.reply_count ?? 0,
      like_count: t.like_count ?? 0,
      views: t.views ?? 0,
      time: new Date(t.created_at).toLocaleDateString(),
      is_solved: t.is_solved ?? false,
      tags: t.tags ?? [],
      liked: likedSet.has(t.id),
    })));
    setLoading(false);
  }

  async function loadScholars() {
    const { data } = await supabase
      .from('profiles')
      .select('username, xp')
      .order('xp', { ascending: false })
      .limit(4);
    if (data) setScholars(data.map((s: any, i: number) => ({ ...s, rank: i + 1 })));
  }

  useEffect(() => { loadThreads(); }, [filter, category]);
  useEffect(() => { loadScholars(); }, []);
  // Re-fetch likes when profile loads
  useEffect(() => { if (profile) loadThreads(); }, [profile]);

  const handleLike = async (threadId: string, liked: boolean) => {
    if (!profile) { toast.error('Sign in to like'); return; }
    if (liked) {
      await supabase.from('thread_likes').delete().eq('user_id', profile.id).eq('thread_id', threadId);
    } else {
      await supabase.from('thread_likes').insert({ user_id: profile.id, thread_id: threadId });
    }
    setThreads(threads.map(t => t.id === threadId ? { ...t, liked: !liked, like_count: t.like_count + (liked ? -1 : 1) } : t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) { toast.error('Sign in to post'); return; }
    if (!newEntry.title.trim()) { toast.error('Title is required'); return; }
    setSubmitting(true);

    const { error } = await supabase.from('threads').insert({
      author_id: profile.id,
      title: newEntry.title,
      body: newEntry.body || '(No content)',
      category: newEntry.category,
      tags: newEntry.tags.split(',').map(t => t.trim()).filter(Boolean),
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Thread published!');
      setIsModalOpen(false);
      setNewEntry({ title: '', body: '', category: 'Discussion', tags: '' });
      loadThreads();
    }
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 relative"
    >
      <div className="flex-1 space-y-8">
        <div className="flex items-end justify-between border-b-2 border-tertiary pb-6">
          <div>
            <h1 className="text-4xl font-serif font-black tracking-tight text-tertiary mb-2">The Collective Manuscript</h1>
            <p className="font-mono text-sm text-slate-600">Discourse, questions, and shared knowledge.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-primary text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-amber-700 transition-colors border border-primary shadow-[4px_4px_0px_0px_rgba(30,30,47,1)] hover:shadow-[2px_2px_0px_0px_rgba(30,30,47,1)] hover:translate-x-[2px] hover:translate-y-[2px] flex items-center"
          >
            <span className="material-symbols-outlined mr-2 text-[18px]">edit_document</span>
            New Entry
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 border-b border-outline pb-4">
          {(['latest', 'top', 'unanswered'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold transition-colors ${filter === f ? 'bg-tertiary text-white' : 'text-slate-500 hover:text-tertiary'}`}
            >
              {f}
            </button>
          ))}
          <div className="flex-1" />
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">filter_list</span>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-outline font-mono text-xs text-slate-600 focus:outline-none focus:border-primary appearance-none"
            >
              <option>All Categories</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Thread list */}
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-32 bg-white border border-outline animate-pulse" />)
          ) : threads.length === 0 ? (
            <div className="p-12 bg-white border border-outline text-center">
              <p className="font-mono text-sm text-slate-500">No threads yet. Be the first to post!</p>
            </div>
          ) : (
            <AnimatePresence>
              {threads.map((thread, index) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="p-6 bg-white border border-outline hover:border-primary transition-colors group relative"
                >
                  {thread.is_solved && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[16px]">check</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest font-bold ${
                      thread.category === 'Help & Support' ? 'bg-amber-100 text-amber-800' :
                      thread.category === 'Showcase' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>{thread.category}</span>
                    <span className="font-mono text-[10px] text-slate-400">• {thread.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-tertiary group-hover:text-primary transition-colors mb-2">{thread.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {thread.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-neutral border border-outline font-mono text-[10px] text-slate-500">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-outline pt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-tertiary rounded-full flex items-center justify-center text-white font-mono text-[10px] font-bold">
                        {thread.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-mono text-xs text-slate-600">@{thread.author}</span>
                    </div>
                    <div className="flex items-center space-x-4 font-mono text-xs text-slate-500">
                      <button
                        onClick={() => handleLike(thread.id, thread.liked)}
                        className={`flex items-center transition-colors ${thread.liked ? 'text-primary' : 'hover:text-primary'}`}
                      >
                        <span className="material-symbols-outlined text-[16px] mr-1">{thread.liked ? 'favorite' : 'favorite_border'}</span>
                        {thread.like_count}
                      </button>
                      <div className="flex items-center">
                        <span className="material-symbols-outlined text-[16px] mr-1">forum</span>
                        {thread.reply_count}
                      </div>
                      <div className="flex items-center">
                        <span className="material-symbols-outlined text-[16px] mr-1">visibility</span>
                        {thread.views}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-8">
        <div className="bg-tertiary text-neutral p-6 border border-tertiary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)]">
          <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-400 mb-4 flex items-center">
            <span className="material-symbols-outlined mr-2 text-[18px]">group</span>
            Active Scholars
          </h3>
          <ul className="space-y-4">
            {scholars.map(user => (
              <li key={user.username} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`font-mono text-xs font-bold ${user.rank <= 3 ? 'text-primary' : 'text-slate-500'}`}>#{user.rank}</span>
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-mono text-[10px] font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-mono text-xs text-white">@{user.username}</span>
                </div>
                <span className="font-mono text-[10px] text-secondary">{user.xp.toLocaleString()} XP</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-neutral border border-outline p-6">
          <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-tertiary mb-2">Manuscript Guidelines</h3>
          <p className="text-sm text-slate-600 mb-4">Be respectful, share knowledge generously, and format code blocks properly.</p>
        </div>
      </div>

      {/* New Thread Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-tertiary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white border border-outline shadow-[8px_8px_0px_0px_rgba(30,30,47,1)] w-full max-w-2xl"
            >
              <div className="p-6 border-b border-outline bg-outline-variant flex items-center justify-between">
                <h2 className="text-2xl font-serif font-black tracking-tight text-tertiary">Draft New Entry</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-tertiary">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest font-bold text-tertiary">Title</label>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={e => setNewEntry({ ...newEntry, title: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral border border-outline font-mono text-sm focus:outline-none focus:border-primary"
                    placeholder="What knowledge do you seek or share?"
                    autoFocus
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-mono text-xs uppercase tracking-widest font-bold text-tertiary">Category</label>
                    <select
                      value={newEntry.category}
                      onChange={e => setNewEntry({ ...newEntry, category: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral border border-outline font-mono text-sm focus:outline-none focus:border-primary"
                    >
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-xs uppercase tracking-widest font-bold text-tertiary">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={newEntry.tags}
                      onChange={e => setNewEntry({ ...newEntry, tags: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral border border-outline font-mono text-sm focus:outline-none focus:border-primary"
                      placeholder="rust, algorithms..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest font-bold text-tertiary">Content</label>
                  <textarea
                    rows={6}
                    value={newEntry.body}
                    onChange={e => setNewEntry({ ...newEntry, body: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral border border-outline font-mono text-sm focus:outline-none focus:border-primary resize-none"
                    placeholder="Write your manuscript entry here..."
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4 border-t border-outline">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-transparent text-tertiary font-mono text-sm uppercase tracking-widest font-bold hover:bg-outline-variant border border-outline">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-primary text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-amber-700 border border-primary shadow-[4px_4px_0px_0px_rgba(30,30,47,1)] disabled:opacity-50"
                  >
                    {submitting ? 'Publishing...' : 'Publish Entry'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
