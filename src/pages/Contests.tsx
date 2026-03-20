import React from 'react';
import { motion } from 'motion/react';

const activeContest = {
  title: 'Rookie CodeSprint 2026',
  type: 'Algorithms & Data Structures',
  endTime: '04:23:15',
  participants: 1245,
  prizes: ['₹50,000', 'Gold Badge', 'Certificate'],
};

const upcomingContests = [
  { title: 'Frontend Challenge: UI/UX', date: 'Mar 25, 2026', type: 'Web Dev', prizes: ['₹20,000', 'Silver Badge'] },
  { title: 'System Design Showdown', date: 'Apr 02, 2026', type: 'Architecture', prizes: ['₹30,000', 'Certificate'] },
];

const leaderboard = [
  { rank: 1, name: 'Yash', score: 2450, badge: 'Grandmaster' },
  { rank: 2, name: 'Vanshika', score: 2380, badge: 'Master' },
  { rank: 3, name: 'Aarav', score: 2210, badge: 'Expert' },
  { rank: 4, name: 'Priya', score: 2150, badge: 'Expert' },
  { rank: 5, name: 'Rohan', score: 2090, badge: 'Specialist' },
];

export function Contests() {
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
          <h1 className="text-4xl font-serif font-black tracking-tight text-tertiary mb-2">Arena</h1>
          <p className="font-mono text-sm text-slate-600">Compete, learn, and earn rewards in our coding contests.</p>
        </div>
        <button className="px-6 py-2 bg-primary text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-amber-700 transition-colors border border-primary shadow-[4px_4px_0px_0px_rgba(30,30,47,1)] hover:shadow-[2px_2px_0px_0px_rgba(30,30,47,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
          My Registrations
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Contest */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border-2 border-primary p-8 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-primary text-white font-mono text-[10px] uppercase tracking-widest font-bold px-3 py-1">
              Live Now
            </div>
            <h2 className="text-3xl font-serif font-bold text-tertiary mb-2">{activeContest.title}</h2>
            <p className="font-mono text-sm text-slate-500 mb-6">{activeContest.type}</p>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-1">Time Remaining</span>
                <span className="font-mono text-2xl font-bold text-secondary">{activeContest.endTime}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-1">Participants</span>
                <span className="font-mono text-2xl font-bold text-tertiary">{activeContest.participants}</span>
              </div>
            </div>

            <div className="border-t border-outline pt-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3 block">Prizes</span>
              <div className="flex gap-3">
                {activeContest.prizes.map((prize, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-50 border border-primary text-primary font-mono text-xs font-bold">
                    {prize}
                  </span>
                ))}
              </div>
            </div>

            <button className="mt-8 w-full py-3 bg-tertiary text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-slate-800 transition-colors">
              Enter Arena
            </button>
          </motion.section>

          {/* Upcoming Contests */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white border border-outline p-6 shadow-sm"
          >
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">event</span>
              Upcoming Contests
            </h2>
            <div className="space-y-4">
              {upcomingContests.map((contest, i) => (
                <div key={i} className="p-4 border border-outline hover:bg-neutral transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-tertiary text-lg">{contest.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-mono text-xs text-slate-500">{contest.date}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="font-mono text-xs text-slate-500">{contest.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      {contest.prizes.map((prize, j) => (
                        <span key={j} className="px-2 py-0.5 bg-neutral border border-outline text-slate-600 font-mono text-[10px]">
                          {prize}
                        </span>
                      ))}
                    </div>
                    <button className="px-4 py-2 border border-tertiary text-tertiary font-mono text-xs uppercase tracking-widest font-bold hover:bg-tertiary hover:text-white transition-colors">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          {/* Leaderboard */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-tertiary text-neutral p-6 border border-tertiary shadow-[4px_4px_0px_0px_rgba(217,119,6,1)]"
          >
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-400 mb-6 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">leaderboard</span>
              Global Top Performers
            </h2>
            
            <div className="space-y-3">
              {leaderboard.map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-outline-variant bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 flex items-center justify-center font-mono text-xs font-bold ${
                      user.rank === 1 ? 'bg-amber-400 text-amber-900' :
                      user.rank === 2 ? 'bg-slate-300 text-slate-800' :
                      user.rank === 3 ? 'bg-amber-700 text-amber-100' :
                      'text-slate-400'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{user.name}</div>
                      <div className="font-mono text-[10px] text-primary">{user.badge}</div>
                    </div>
                  </div>
                  <div className="font-mono text-sm font-bold text-secondary">{user.score}</div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Perks Info */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white border border-outline p-6 shadow-sm"
          >
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-slate-500 mb-4 flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">military_tech</span>
              Why Compete?
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-primary">payments</span>
                <div>
                  <div className="font-bold text-sm text-tertiary">Cash Prizes</div>
                  <div className="text-xs text-slate-500">Win up to ₹50,000 in major contests.</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-secondary">workspace_premium</span>
                <div>
                  <div className="font-bold text-sm text-tertiary">Certifications</div>
                  <div className="text-xs text-slate-500">Earn verified certificates for your resume.</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-amber-500">local_police</span>
                <div>
                  <div className="font-bold text-sm text-tertiary">Exclusive Badges</div>
                  <div className="text-xs text-slate-500">Showcase your rank on your profile.</div>
                </div>
              </li>
            </ul>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}
