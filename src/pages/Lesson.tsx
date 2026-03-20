import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'motion/react';

export function Lesson() {
  const [code, setCode] = useState('// Your code here...\nfor i in 2..=10 {\n    if i % 2 == 0 {\n        println!("{}", i);\n    }\n}');
  const [output, setOutput] = useState('> Ready for execution.');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setOutput('> Compiling...');
    
    setTimeout(() => {
      if (code.includes('for') || code.includes('while')) {
        setOutput('> Execution successful.\n2\n4\n6\n8\n10');
      } else {
        setOutput('> Execution successful.\n(No output)');
      }
      setIsRunning(false);
    }, 800);
  };

  const handleReset = () => {
    setCode('// Your code here...\n');
    setOutput('> Ready for execution.');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex gap-8 max-w-7xl mx-auto"
    >
      {/* Main Content Area */}
      <div className="flex-1 bg-[#FFFCF8] border-2 border-outline shadow-md min-h-[800px] flex flex-col">
        {/* Lesson Header */}
        <div className="p-10 lg:p-14 border-b-2 border-outline bg-neutral relative">
          <div className="absolute top-0 right-0 w-16 h-16 border-l-2 border-b-2 border-outline bg-outline-variant flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-tertiary">2.4</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-primary mb-4">Module 2: Algorithmic Thinking</div>
          <h1 className="text-5xl font-serif font-black tracking-tight text-tertiary mb-6">Loops & Iteration: The Forge</h1>
          <p className="font-body text-xl text-slate-700 leading-relaxed max-w-3xl">
            Repetition is the hammer that shapes data. Learn how to iterate over collections and execute logic repeatedly until a condition is met.
          </p>
        </div>

        {/* Lesson Body */}
        <div className="p-10 lg:p-14 flex-1 space-y-12 manuscript-body">
          
          <section>
            <h2 className="text-3xl font-serif font-bold text-tertiary mb-6 flex items-center border-b border-outline pb-3">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-4 font-sans">1</span>
              The Concept
            </h2>
            <p className="mb-6 drop-cap">
              Imagine you have a stack of 100 manuscripts to review. You wouldn't write "review manuscript 1", "review manuscript 2", and so on. You would say, "For each manuscript in the stack, review it." This is the essence of iteration.
            </p>
            <div className="p-8 my-10 bg-neutral border-l-4 border-primary font-serif italic text-2xl text-slate-700">
              "A loop allows a program to execute a statement or a block of statements multiple times."
            </div>

            {/* Media Section */}
            <div className="mt-8 pt-8 border-t border-outline space-y-8">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-4 flex items-center">
                  <span className="material-symbols-outlined mr-2 text-[18px]">play_circle</span>
                  Visual Explanation
                </h3>
                <div className="border border-outline bg-neutral p-2 shadow-sm">
                  <video 
                    controls 
                    className="w-full aspect-video object-cover bg-black"
                    poster="https://picsum.photos/seed/lesson/800/450"
                  >
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-4 flex items-center">
                  <span className="material-symbols-outlined mr-2 text-[18px]">headphones</span>
                  Audio Guide
                </h3>
                <div className="border border-outline bg-neutral p-4 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-outline flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">graphic_eq</span>
                  </div>
                  <audio controls className="w-full h-10">
                    <source src="https://www.w3schools.com/html/horse.ogg" type="audio/ogg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-bold text-tertiary mb-6 flex items-center border-b border-outline pb-3">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-4 font-sans">2</span>
              The While Loop
            </h2>
            <p className="mb-6">
              The <code>while</code> loop continues to execute as long as its condition evaluates to true. It is the most fundamental type of loop.
            </p>
            
            {/* Code Block */}
            <div className="border border-outline bg-tertiary rounded-sm overflow-hidden my-6">
              <div className="flex items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto font-mono text-xs text-slate-400">while_loop.rs</div>
              </div>
              <div className="p-4 font-mono text-sm overflow-x-auto text-slate-300">
                <pre>
                  <code>
                    <span className="text-pink-400">let</span> <span className="text-blue-400">mut</span> counter = <span className="text-amber-400">0</span>;
                    <br/><br/>
                    <span className="text-pink-400">while</span> counter &lt; <span className="text-amber-400">5</span> {'{'}
                    <br/>
                    {'    '}println!(<span className="text-green-400">"The counter is {}"</span>, counter);
                    <br/>
                    {'    '}counter += <span className="text-amber-400">1</span>; <span className="text-slate-500">// Crucial: avoid infinite loops!</span>
                    <br/>
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-bold text-tertiary mb-6 flex items-center border-b border-outline pb-3">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-4 font-sans">3</span>
              Try It Yourself
            </h2>
            <p className="mb-6">
              Write a loop that prints all even numbers from 2 to 10.
            </p>
            
            {/* Interactive Editor Placeholder */}
            <div className="border border-outline bg-neutral min-h-[200px] relative group">
              <div className="absolute top-0 right-0 flex border-b border-l border-outline bg-white z-10">
                <button onClick={handleReset} className="px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:bg-outline-variant transition-colors border-r border-outline">Reset</button>
                <button 
                  onClick={handleRun}
                  disabled={isRunning}
                  className="px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary font-bold hover:bg-amber-50 transition-colors flex items-center disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[14px] mr-1">
                    {isRunning ? 'hourglass_empty' : 'play_arrow'}
                  </span> 
                  {isRunning ? 'Running' : 'Run'}
                </button>
              </div>
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full min-h-[200px] p-4 pt-10 font-mono text-sm text-tertiary bg-transparent outline-none resize-y" 
                spellCheck="false"
              />
            </div>
            
            {/* Output Console */}
            <div className="mt-4 border border-outline bg-tertiary p-4 min-h-[100px] font-mono text-xs text-green-400 whitespace-pre-wrap">
              <div className="text-slate-500 mb-2">Output:</div>
              {output}
            </div>
          </section>

        </div>

        {/* Lesson Footer */}
        <div className="p-6 border-t border-outline bg-neutral flex items-center justify-between">
          <button className="px-6 py-3 border border-outline bg-white text-tertiary font-mono text-sm uppercase tracking-widest font-bold hover:bg-outline-variant transition-colors">
            Previous Lesson
          </button>
          <button className="px-6 py-3 bg-primary text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-amber-700 transition-colors border border-primary shadow-[4px_4px_0px_0px_rgba(30,30,47,1)] hover:shadow-[2px_2px_0px_0px_rgba(30,30,47,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
            Mark Complete & Continue
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="w-72 shrink-0 hidden xl:block">
        <div className="sticky top-24 bg-white border border-outline shadow-sm p-6">
          <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-tertiary mb-6 border-b border-outline pb-2">Lesson Manifest</h3>
          
          <ul className="space-y-4 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-outline">
            <li className="relative pl-8">
              <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-secondary border-2 border-white z-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[12px]">check</span>
              </div>
              <span className="font-mono text-xs text-slate-500 line-through">2.1 Variables & Types</span>
            </li>
            <li className="relative pl-8">
              <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-secondary border-2 border-white z-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[12px]">check</span>
              </div>
              <span className="font-mono text-xs text-slate-500 line-through">2.2 Control Flow (If/Else)</span>
            </li>
            <li className="relative pl-8">
              <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-secondary border-2 border-white z-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[12px]">check</span>
              </div>
              <span className="font-mono text-xs text-slate-500 line-through">2.3 Match Expressions</span>
            </li>
            <li className="relative pl-8">
              <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-primary border-2 border-white z-10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <span className="font-mono text-xs font-bold text-tertiary">2.4 Loops & Iteration</span>
            </li>
            <li className="relative pl-8">
              <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-neutral border-2 border-outline z-10"></div>
              <span className="font-mono text-xs text-slate-400">2.5 Functions & Scope</span>
            </li>
            <li className="relative pl-8">
              <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-neutral border-2 border-outline z-10"></div>
              <span className="font-mono text-xs text-slate-400">2.6 Module Assessment</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
