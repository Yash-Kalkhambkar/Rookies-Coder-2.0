import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function LearningPath() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto relative"
    >
      <div className="flex items-end justify-between border-b-2 border-tertiary pb-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-black tracking-tight text-tertiary mb-2">Learning Path</h1>
          <p className="font-mono text-sm text-slate-600">Your structured journey through the craft of code.</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs uppercase tracking-widest font-bold text-primary mb-1">Overall Progress</div>
          <div className="text-3xl font-black text-tertiary">34%</div>
        </div>
      </div>

      <div className="space-y-16 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline before:to-transparent">
        
        {/* Module 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-neutral bg-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            <span className="material-symbols-outlined text-white">check</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-white border border-outline shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-secondary">Module 1</span>
              <span className="font-mono text-[10px] text-slate-500">Completed</span>
            </div>
            <h3 className="text-xl font-bold text-tertiary mb-2">Foundations of Logic</h3>
            <p className="text-sm text-slate-600 mb-4">Variables, control flow, and basic data structures. The bedrock of all programming.</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-neutral border border-outline font-mono text-[10px] text-slate-500">Variables</span>
              <span className="px-2 py-1 bg-neutral border border-outline font-mono text-[10px] text-slate-500">Loops</span>
              <span className="px-2 py-1 bg-neutral border border-outline font-mono text-[10px] text-slate-500">Functions</span>
            </div>
          </div>
        </motion.div>

        {/* Module 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-neutral bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            <span className="material-symbols-outlined text-white">play_arrow</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-white border-2 border-primary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-primary">Module 2</span>
              <span className="font-mono text-[10px] text-primary font-bold">In Progress (60%)</span>
            </div>
            <h3 className="text-xl font-bold text-tertiary mb-2">Algorithmic Thinking</h3>
            <p className="text-sm text-slate-600 mb-4">Sorting, searching, and understanding time complexity (Big O notation).</p>
            
            <div className="w-full bg-neutral h-2 mb-6 border border-outline">
              <div className="bg-primary h-full" style={{ width: '60%' }}></div>
            </div>
            
            <Link to="/lesson" className="inline-block px-4 py-2 bg-tertiary text-white font-mono text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors">
              Continue Lesson
            </Link>
          </div>
        </motion.div>

        {/* Module 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-neutral bg-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            <span className="material-symbols-outlined text-white">check</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-white border border-outline shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-secondary">Module 3</span>
              <span className="font-mono text-[10px] text-slate-500">Completed</span>
            </div>
            <h3 className="text-xl font-bold text-tertiary mb-2">Data Systems & Memory</h3>
            <p className="text-sm text-slate-600 mb-4">Pointers, references, and memory allocation. Understanding the machine.</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-neutral border border-outline font-mono text-[10px] text-slate-500">Pointers</span>
              <span className="px-2 py-1 bg-neutral border border-outline font-mono text-[10px] text-slate-500">Heap vs Stack</span>
            </div>
          </div>
        </motion.div>

        {/* Module 4 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-neutral bg-outline-variant shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            <span className="material-symbols-outlined text-slate-400">lock</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-neutral border border-outline opacity-75">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-slate-500">Module 4</span>
              <span className="font-mono text-[10px] text-slate-400">Locked</span>
            </div>
            <h3 className="text-xl font-bold text-slate-500 mb-2">Concurrency & Threads</h3>
            <p className="text-sm text-slate-500 mb-4">Doing multiple things at once safely. Mutexes, channels, and async/await.</p>
            <div className="flex gap-2 opacity-50">
              <span className="px-2 py-1 bg-white border border-outline font-mono text-[10px] text-slate-400">Threads</span>
              <span className="px-2 py-1 bg-white border border-outline font-mono text-[10px] text-slate-400">Async</span>
            </div>
          </div>
        </motion.div>

        {/* Module 5 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-neutral bg-outline-variant shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            <span className="material-symbols-outlined text-slate-400">lock</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-neutral border border-outline opacity-75">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-slate-500">Module 5</span>
              <span className="font-mono text-[10px] text-slate-400">Locked</span>
            </div>
            <h3 className="text-xl font-bold text-slate-500 mb-2">Networking & APIs</h3>
            <p className="text-sm text-slate-500 mb-4">Connecting your code to the world. HTTP, WebSockets, and RESTful design.</p>
            <div className="flex gap-2 opacity-50">
              <span className="px-2 py-1 bg-white border border-outline font-mono text-[10px] text-slate-400">HTTP</span>
              <span className="px-2 py-1 bg-white border border-outline font-mono text-[10px] text-slate-400">REST</span>
            </div>
          </div>
        </motion.div>

        {/* Module 6 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-neutral bg-outline-variant shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            <span className="material-symbols-outlined text-slate-400">emoji_events</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-neutral border border-outline opacity-75">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-slate-500">Module 6</span>
              <span className="font-mono text-[10px] text-slate-400">Locked</span>
            </div>
            <h3 className="text-xl font-bold text-slate-500 mb-2">Capstone Project</h3>
            <p className="text-sm text-slate-500 mb-4">Build a complete, production-ready distributed system from scratch.</p>
            <div className="flex gap-2 opacity-50">
              <span className="px-2 py-1 bg-white border border-outline font-mono text-[10px] text-slate-400">Architecture</span>
              <span className="px-2 py-1 bg-white border border-outline font-mono text-[10px] text-slate-400">Deployment</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Floating Quick Stats */}
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
            <span className="font-mono font-bold">12</span>
          </div>
          <div className="flex justify-between items-center gap-8">
            <span className="text-sm">Completed</span>
            <span className="font-mono font-bold text-secondary">4</span>
          </div>
          <div className="flex justify-between items-center gap-8">
            <span className="text-sm">Est. Time Left</span>
            <span className="font-mono font-bold text-primary">45h</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
