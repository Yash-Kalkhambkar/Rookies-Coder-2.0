import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-screen bg-neutral flex flex-col font-sans">
      <header className="flex items-center justify-between px-8 py-6 border-b border-outline bg-neutral relative z-10">
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
          <span className="font-serif font-black text-2xl tracking-tight text-tertiary">Rookie's Coder</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="font-mono text-sm uppercase tracking-tight font-medium text-slate-600 hover:text-primary transition-colors">Features</a>
          <a href="#curriculum" className="font-mono text-sm uppercase tracking-tight font-medium text-slate-600 hover:text-primary transition-colors">Curriculum</a>
          <a href="#community" className="font-mono text-sm uppercase tracking-tight font-medium text-slate-600 hover:text-primary transition-colors">Community</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="font-mono text-sm uppercase tracking-tight font-medium text-slate-600 hover:text-primary transition-colors">
            Log In
          </Link>
          <Link to="/login" className="px-5 py-2.5 bg-tertiary text-white font-mono text-sm uppercase tracking-tight font-medium hover:bg-slate-800 transition-colors border border-tertiary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)] hover:shadow-[2px_2px_0px_0px_rgba(217,119,6,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
            Start Crafting
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 border border-outline opacity-50 rotate-12 pointer-events-none"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 border border-outline opacity-30 -rotate-6 pointer-events-none"></div>
        
        <div className="max-w-4xl w-full text-center relative z-10">
          <div className="inline-flex items-center px-3 py-1 bg-outline-variant border border-outline mb-8">
            <span className="material-symbols-outlined text-primary text-sm mr-2">auto_awesome</span>
            <span className="font-mono text-xs uppercase tracking-widest font-semibold text-tertiary">Version 2.0 Now Available</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tight text-tertiary mb-8 leading-[0.9]">
            The Craft of Code.<br/>
            <span className="text-primary italic font-serif font-normal">Handcrafted for Beginners.</span>
          </h1>
          
          <p className="font-body text-xl md:text-2xl text-slate-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            A structured, manuscript-style learning platform that treats programming as an artisanal skill. Master the fundamentals with precision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/login" className="px-8 py-4 bg-primary text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-amber-700 transition-colors border border-primary shadow-[6px_6px_0px_0px_rgba(30,30,47,1)] hover:shadow-[2px_2px_0px_0px_rgba(30,30,47,1)] hover:translate-x-[4px] hover:translate-y-[4px] w-full sm:w-auto">
              Begin Journey
            </Link>
            <a href="#curriculum" className="px-8 py-4 bg-transparent text-tertiary font-mono text-sm uppercase tracking-widest font-bold hover:bg-outline-variant transition-colors border border-tertiary w-full sm:w-auto">
              View Syllabus
            </a>
          </div>
        </div>

        <div className="mt-24 w-full max-w-5xl border border-outline bg-white shadow-xl relative z-10">
          <div className="flex items-center px-4 py-2 border-b border-outline bg-outline-variant">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="mx-auto font-mono text-xs text-slate-500">hello_world.rs</div>
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
            <pre>
              <code className="text-tertiary">
                <span className="text-secondary">fn</span> <span className="text-primary">main</span>() {'{'}
                <br/>
                {'    '}println!(<span className="text-green-600">"Welcome to Rookie's Coder."</span>);
                <br/>
                {'    '}<span className="text-slate-400">// The journey of a thousand miles begins with a single step.</span>
                <br/>
                {'    '}<span className="text-secondary">let</span> mut skill_level = <span className="text-primary">0</span>;
                <br/>
                {'    '}<span className="text-secondary">while</span> skill_level &lt; <span className="text-primary">100</span> {'{'}
                <br/>
                {'        '}skill_level += practice();
                <br/>
                {'    '}{'}'}
                <br/>
                {'}'}
              </code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
