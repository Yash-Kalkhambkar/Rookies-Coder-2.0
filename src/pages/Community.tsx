import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

type Thread = {
  id: number;
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  time: string;
  solved: boolean;
  tags: string[];
  likes: number;
};

const INITIAL_THREADS: Thread[] = [
  {
    id: 1,
    title: "Understanding the borrow checker's lifetime rules",
    author: "yash_novice",
    category: "Help & Support",
    replies: 14,
    views: 230,
    time: "2h ago",
    solved: true,
    tags: ["rust", "memory", "lifetimes"],
    likes: 45
  },
  {
    id: 2,
    title: "Showcase: Built a terminal-based text editor",
    author: "vanshika_crafter",
    category: "Showcase",
    replies: 42,
    views: 1205,
    time: "5h ago",
    solved: false,
    tags: ["project", "terminal", "c++"],
    likes: 128
  },
  {
    id: 3,
    title: "Why is functional programming so hard to grasp?",
    author: "rohan_dev",
    category: "Discussion",
    replies: 89,
    views: 3400,
    time: "1d ago",
    solved: false,
    tags: ["theory", "functional", "paradigm"],
    likes: 312
  },
  {
    id: 4,
    title: "Need help optimizing this nested loop",
    author: "priya_student",
    category: "Help & Support",
    replies: 0,
    views: 12,
    time: "15m ago",
    solved: false,
    tags: ["algorithms", "performance"],
    likes: 2
  },
  {
    id: 5,
    title: "Best resources for learning System Design?",
    author: "aarav_architect",
    category: "Discussion",
    replies: 23,
    views: 450,
    time: "2d ago",
    solved: true,
    tags: ["architecture", "resources"],
    likes: 89
  }
];

export function Community() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', category: 'Discussion', tags: '' });
  const [likedThreads, setLikedThreads] = useState<Set<number>>(new Set());

  const handleLike = (id: number) => {
    setThreads(threads.map(t => {
      if (t.id === id) {
        const isLiked = likedThreads.has(id);
        if (isLiked) {
          const newLiked = new Set(likedThreads);
          newLiked.delete(id);
          setLikedThreads(newLiked);
          return { ...t, likes: t.likes - 1 };
        } else {
          setLikedThreads(new Set(likedThreads).add(id));
          return { ...t, likes: t.likes + 1 };
        }
      }
      return t;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const newThread: Thread = {
      id: Date.now(),
      title: newEntry.title,
      author: "current_user",
      category: newEntry.category,
      replies: 0,
      views: 0,
      time: "Just now",
      solved: false,
      tags: newEntry.tags.split(',').map(t => t.trim()).filter(t => t),
      likes: 0
    };

    setThreads([newThread, ...threads]);
    setIsModalOpen(false);
    setNewEntry({ title: '', category: 'Discussion', tags: '' });
    toast.success('Manuscript entry published successfully.');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 relative"
    >
      {/* Main Content */}
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
          <button className="px-4 py-2 bg-tertiary text-white font-mono text-xs uppercase tracking-widest font-bold">Latest</button>
          <button className="px-4 py-2 bg-transparent text-slate-500 hover:text-tertiary font-mono text-xs uppercase tracking-widest font-bold transition-colors">Top</button>
          <button className="px-4 py-2 bg-transparent text-slate-500 hover:text-tertiary font-mono text-xs uppercase tracking-widest font-bold transition-colors">Unanswered</button>
          <div className="flex-1"></div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">filter_list</span>
            <select className="pl-9 pr-8 py-2 bg-white border border-outline font-mono text-xs text-slate-600 focus:outline-none focus:border-primary appearance-none">
              <option>All Categories</option>
              <option>Help & Support</option>
              <option>Showcase</option>
              <option>Discussion</option>
            </select>
          </div>
        </div>

        {/* Thread List */}
        <div className="space-y-4">
          <AnimatePresence>
            {threads.map((thread, index) => (
              <motion.div 
                key={thread.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-6 bg-white border border-outline hover:border-primary transition-colors group relative"
              >
                {thread.solved && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[16px]">check</span>
                  </div>
                )}
              
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest font-bold ${
                    thread.category === 'Help & Support' ? 'bg-amber-100 text-amber-800' :
                    thread.category === 'Showcase' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {thread.category}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">• {thread.time}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-tertiary group-hover:text-primary transition-colors mb-2 cursor-pointer">{thread.title}</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {thread.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-neutral border border-outline font-mono text-[10px] text-slate-500">#{tag}</span>
                ))}
              </div>
              
              <div className="flex items-center justify-between border-t border-outline pt-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-tertiary rounded-full flex items-center justify-center text-white font-mono text-[10px] font-bold">
                    {thread.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-mono text-xs text-slate-600">@{thread.author}</span>
                </div>
                
                <div className="flex items-center space-x-4 font-mono text-xs text-slate-500">
                  <button 
                    onClick={() => handleLike(thread.id)}
                    className={`flex items-center transition-colors ${likedThreads.has(thread.id) ? 'text-primary' : 'hover:text-primary'}`}
                  >
                    <span className="material-symbols-outlined text-[16px] mr-1">
                      {likedThreads.has(thread.id) ? 'favorite' : 'favorite_border'}
                    </span>
                    {thread.likes}
                  </button>
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-[16px] mr-1">forum</span>
                    {thread.replies}
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
        </div>
        
        <div className="flex justify-center pt-8">
          <button className="px-6 py-2 border border-outline bg-white text-tertiary font-mono text-sm uppercase tracking-widest font-bold hover:bg-outline-variant transition-colors">
            Load More Entries
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-8">
        
        {/* Popular Tags */}
        <div className="bg-white border border-outline p-6">
          <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-tertiary mb-4 flex items-center">
            <span className="material-symbols-outlined mr-2 text-[18px]">local_offer</span>
            Popular Discourse
          </h3>
          <div className="flex flex-wrap gap-2">
            {['rust', 'algorithms', 'system-design', 'help', 'showcase', 'career', 'web-dev', 'c++'].map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-neutral border border-outline font-mono text-[10px] text-slate-600 hover:bg-outline-variant hover:text-primary cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Active Scholars */}
        <div className="bg-tertiary text-neutral p-6 border border-tertiary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)]">
          <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-400 mb-4 flex items-center">
            <span className="material-symbols-outlined mr-2 text-[18px]">group</span>
            Active Scholars
          </h3>
          <ul className="space-y-4">
            {[
              { name: 'yash_coder', xp: '12.4k', rank: 1 },
              { name: 'vanshika_builder', xp: '11.2k', rank: 2 },
              { name: 'rohan_dev', xp: '10.8k', rank: 3 },
              { name: 'priya_script', xp: '9.5k', rank: 4 },
            ].map(user => (
              <li key={user.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`font-mono text-xs font-bold ${user.rank <= 3 ? 'text-primary' : 'text-slate-500'}`}>#{user.rank}</span>
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-mono text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-mono text-xs text-white">@{user.name}</span>
                </div>
                <span className="font-mono text-[10px] text-secondary">{user.xp} XP</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Guidelines */}
        <div className="bg-neutral border border-outline p-6">
          <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-tertiary mb-2">Manuscript Guidelines</h3>
          <p className="text-sm text-slate-600 mb-4">
            Be respectful, share knowledge generously, and format code blocks properly. We are all apprentices of the craft.
          </p>
          <a href="#" className="font-mono text-xs text-primary hover:underline flex items-center">
            Read full guidelines <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
          </a>
        </div>

      </div>

      {/* New Entry Modal */}
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
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-tertiary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-widest font-bold text-tertiary">Title</label>
                <input 
                  type="text" 
                  value={newEntry.title}
                  onChange={e => setNewEntry({...newEntry, title: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral border border-outline font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="What knowledge do you seek or share?"
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest font-bold text-tertiary">Category</label>
                  <select 
                    value={newEntry.category}
                    onChange={e => setNewEntry({...newEntry, category: e.target.value})}
                    className="w-full px-4 py-3 bg-neutral border border-outline font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    <option>Discussion</option>
                    <option>Help & Support</option>
                    <option>Showcase</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-widest font-bold text-tertiary">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    value={newEntry.tags}
                    onChange={e => setNewEntry({...newEntry, tags: e.target.value})}
                    className="w-full px-4 py-3 bg-neutral border border-outline font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="rust, algorithms..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-widest font-bold text-tertiary">Content</label>
                <textarea 
                  rows={6}
                  className="w-full px-4 py-3 bg-neutral border border-outline font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  placeholder="Write your manuscript entry here..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-outline">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-transparent text-tertiary font-mono text-sm uppercase tracking-widest font-bold hover:bg-outline-variant transition-colors border border-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-primary text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-amber-700 transition-colors border border-primary shadow-[4px_4px_0px_0px_rgba(30,30,47,1)] hover:shadow-[2px_2px_0px_0px_rgba(30,30,47,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  Publish Entry
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
