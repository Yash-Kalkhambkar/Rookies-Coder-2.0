import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState } from 'react';

export function Dashboard() {
  const [quests, setQuests] = useState([
    { id: 1, text: 'Complete 1 module', done: false },
    { id: 2, text: 'Read a community thread', done: true },
    { id: 3, text: 'Write 50 lines of code', done: false },
  ]);

  const toggleQuest = (id: number) => {
    setQuests(quests.map(q => q.id === id ? { ...q, done: !q.done } : q));
  };

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
          <h1 className="text-4xl font-serif font-black tracking-tight text-tertiary mb-2">Advanced Logic Implementation</h1>
          <p className="font-mono text-sm text-slate-600">Module 4, Section 2 • Estimated completion: 45 mins</p>
        </div>
        <button className="px-6 py-3 bg-primary text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-amber-700 transition-colors border border-primary shadow-[4px_4px_0px_0px_rgba(30,30,47,1)] hover:shadow-[2px_2px_0px_0px_rgba(30,30,47,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
          Resume Study
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          
          {/* Quote of the Day */}
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
                <div className="text-3xl font-black text-tertiary">14</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mt-1">Days Streak</div>
              </div>
              <div className="border-l-4 border-secondary pl-4">
                <div className="text-3xl font-black text-tertiary">8,450</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mt-1">Total XP</div>
              </div>
              <div className="border-l-4 border-tertiary pl-4">
                <div className="text-3xl font-black text-tertiary">12</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mt-1">Modules Done</div>
              </div>
            </div>
            
            {/* Heatmap placeholder */}
            <div className="mt-8 pt-6 border-t border-outline">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Contribution Graph</span>
                <span className="font-mono text-[10px] text-slate-400">Last 30 days</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-8 flex-1 border border-outline ${
                      Math.random() > 0.7 ? 'bg-primary' : 
                      Math.random() > 0.4 ? 'bg-amber-200' : 'bg-neutral'
                    }`}
                  ></div>
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
            
            <div className="space-y-4">
              {[
                { title: 'Understanding Recursion', type: 'Concept', status: 'Completed', date: 'Today' },
                { title: 'Binary Search Trees', type: 'Algorithm', status: 'In Progress', date: 'Yesterday' },
                { title: 'Memory Management in Rust', type: 'Deep Dive', status: 'Completed', date: 'Oct 12' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-outline hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-4 ${item.status === 'Completed' ? 'bg-secondary' : 'bg-primary'}`}></div>
                    <div>
                      <h3 className="font-bold text-tertiary group-hover:text-primary transition-colors">{item.title}</h3>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{item.type}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-mono text-[10px] text-slate-400">{item.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                </div>
              ))}
            </div>
          </section>
        </motion.div>

        {/* Right Column (1/3) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-8"
        >
          
          {/* Daily Quests */}
          <section className="bg-white border border-outline p-6 shadow-sm">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">task_alt</span>
              Daily Quests
            </h2>
            <div className="space-y-3">
              {quests.map((quest) => (
                <div 
                  key={quest.id} 
                  onClick={() => toggleQuest(quest.id)}
                  className="flex items-center p-3 border border-outline hover:border-primary cursor-pointer transition-colors group"
                >
                  <div className={`w-5 h-5 flex items-center justify-center border mr-3 transition-colors ${quest.done ? 'bg-primary border-primary' : 'border-outline group-hover:border-primary'}`}>
                    {quest.done && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${quest.done ? 'text-slate-400 line-through' : 'text-tertiary group-hover:text-primary'}`}>
                    {quest.text}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Sessions */}
          <section className="bg-tertiary text-neutral p-6 border border-tertiary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)]">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-400 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">event</span>
              Upcoming Sessions
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-2 border-primary pl-4">
                <div className="font-mono text-[10px] text-primary mb-1">Tomorrow, 14:00 UTC</div>
                <h3 className="font-bold text-white mb-1">System Design Workshop</h3>
                <p className="text-sm text-slate-400">Live architecture review with senior engineers.</p>
              </div>
              <div className="border-l-2 border-secondary pl-4">
                <div className="font-mono text-[10px] text-secondary mb-1">Friday, 18:00 UTC</div>
                <h3 className="font-bold text-white mb-1">Algorithm Study Group</h3>
                <p className="text-sm text-slate-400">Focusing on dynamic programming patterns.</p>
              </div>
            </div>
            
            <button className="w-full mt-8 py-2 border border-outline-variant text-white font-mono text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors">
              View Calendar
            </button>
          </section>

          {/* Community Pulse */}
          <section className="bg-white border border-outline p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">forum</span>
              Community Pulse
            </h2>
            
            <div className="space-y-4">
              {[
                { author: 'yash_dev', topic: 'Help with borrow checker', replies: 12 },
                { author: 'vanshika_codes', topic: 'Best resources for learning Go?', replies: 34 },
                { author: 'rohan_w', topic: 'Showcase: My first full-stack app', replies: 8 }
              ].map((thread, i) => (
                <div key={i} className="pb-4 border-b border-outline last:border-0 last:pb-0">
                  <h3 className="font-medium text-sm text-tertiary hover:text-primary cursor-pointer mb-1">{thread.topic}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-500">by @{thread.author}</span>
                    <span className="font-mono text-[10px] text-secondary">{thread.replies} replies</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Link to="/community" className="block text-center w-full mt-6 py-2 bg-neutral border border-outline text-tertiary font-mono text-xs uppercase tracking-widest hover:bg-outline-variant transition-colors">
              Join Discussion
            </Link>
          </section>

        </motion.div>
      </div>
    </motion.div>
  );
}
