import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Contest = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'upcoming' | 'live' | 'ended';
  starts_at: string;
  ends_at: string;
  prizes: string[];
  registered: boolean;
};

type LeaderboardEntry = {
  rank: number;
  username: string;
  display_name: string | null;
  total_score: number;
};

function useCountdown(endTime: string) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    function calc() {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Ended'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime]);
  return timeLeft;
}

export function Contests() {
  const { profile } = useAuth();
  const [contests, setContests] = useState<Contest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data: contestData } = await supabase
      .from('contests')
      .select('*')
      .order('starts_at');

    let registeredSet = new Set<string>();
    if (profile && contestData) {
      const { data: regs } = await supabase
        .from('contest_registrations')
        .select('contest_id')
        .eq('user_id', profile.id);
      registeredSet = new Set((regs ?? []).map((r: any) => r.contest_id));
    }

    if (contestData) {
      setContests(contestData.map((c: any) => ({ ...c, registered: registeredSet.has(c.id) })));
    }

    // Leaderboard from profiles by XP (global)
    const { data: topUsers } = await supabase
      .from('profiles')
      .select('username, display_name, xp')
      .order('xp', { ascending: false })
      .limit(5);

    if (topUsers) {
      setLeaderboard(topUsers.map((u: any, i: number) => ({
        rank: i + 1,
        username: u.username,
        display_name: u.display_name,
        total_score: u.xp,
      })));
    }

    setLoading(false);
  }

  useEffect(() => { load(); }, [profile]);

  const handleRegister = async (contestId: string, registered: boolean) => {
    if (!profile) { toast.error('Sign in to register'); return; }
    if (registered) {
      await supabase.from('contest_registrations').delete().eq('user_id', profile.id).eq('contest_id', contestId);
      toast.success('Unregistered from contest');
    } else {
      const { error } = await supabase.from('contest_registrations').insert({ user_id: profile.id, contest_id: contestId });
      if (error) toast.error(error.message);
      else toast.success('Registered! Good luck!');
    }
    setContests(contests.map(c => c.id === contestId ? { ...c, registered: !registered } : c));
  };

  const liveContest = contests.find(c => c.status === 'live');
  const upcomingContests = contests.filter(c => c.status === 'upcoming');
  const liveCountdown = useCountdown(liveContest?.ends_at ?? new Date(Date.now() + 86400000).toISOString());

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {[1, 2].map(i => <div key={i} className="h-48 bg-white border border-outline animate-pulse" />)}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-end justify-between border-b-2 border-tertiary pb-6">
        <div>
          <h1 className="text-4xl font-serif font-black tracking-tight text-tertiary mb-2">Arena</h1>
          <p className="font-mono text-sm text-slate-600">Compete, learn, and earn rewards in our coding contests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Live Contest */}
          {liveContest ? (
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border-2 border-primary p-8 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-primary text-white font-mono text-[10px] uppercase tracking-widest font-bold px-3 py-1">
                Live Now
              </div>
              <h2 className="text-3xl font-serif font-bold text-tertiary mb-2">{liveContest.title}</h2>
              <p className="font-mono text-sm text-slate-500 mb-6">{liveContest.type}</p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-1">Time Remaining</span>
                  <span className="font-mono text-2xl font-bold text-secondary">{liveCountdown}</span>
                </div>
              </div>
              <div className="border-t border-outline pt-6 mb-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3 block">Prizes</span>
                <div className="flex gap-3">
                  {liveContest.prizes.map((prize, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-50 border border-primary text-primary font-mono text-xs font-bold">{prize}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleRegister(liveContest.id, liveContest.registered)}
                className={`w-full py-3 font-mono text-sm uppercase tracking-widest font-bold transition-colors ${
                  liveContest.registered
                    ? 'bg-secondary text-white hover:bg-teal-700 border border-secondary'
                    : 'bg-tertiary text-white hover:bg-slate-800 border border-tertiary'
                }`}
              >
                {liveContest.registered ? '✓ Registered — Enter Arena' : 'Register & Enter Arena'}
              </button>
            </motion.section>
          ) : (
            <div className="p-12 bg-white border border-outline text-center">
              <p className="font-mono text-sm text-slate-500">No live contests right now. Check upcoming contests below.</p>
            </div>
          )}

          {/* Upcoming */}
          {upcomingContests.length > 0 && (
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
                {upcomingContests.map((contest) => (
                  <div key={contest.id} className="p-4 border border-outline hover:bg-neutral transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-tertiary text-lg">{contest.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-mono text-xs text-slate-500">{new Date(contest.starts_at).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="font-mono text-xs text-slate-500">{contest.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {contest.prizes.map((prize, j) => (
                          <span key={j} className="px-2 py-0.5 bg-neutral border border-outline text-slate-600 font-mono text-[10px]">{prize}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleRegister(contest.id, contest.registered)}
                        className={`px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold transition-colors ${
                          contest.registered
                            ? 'bg-secondary text-white border border-secondary'
                            : 'border border-tertiary text-tertiary hover:bg-tertiary hover:text-white'
                        }`}
                      >
                        {contest.registered ? '✓ Registered' : 'Register'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Leaderboard */}
        <div className="space-y-8">
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
            {leaderboard.length === 0 ? (
              <p className="font-mono text-xs text-slate-400">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div key={user.username} className="flex items-center justify-between p-3 border border-outline-variant bg-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 flex items-center justify-center font-mono text-xs font-bold ${
                        user.rank === 1 ? 'bg-amber-400 text-amber-900' :
                        user.rank === 2 ? 'bg-slate-300 text-slate-800' :
                        user.rank === 3 ? 'bg-amber-700 text-amber-100' : 'text-slate-400'
                      }`}>{user.rank}</div>
                      <div>
                        <div className="font-bold text-white text-sm">{user.display_name || user.username}</div>
                        <div className="font-mono text-[10px] text-slate-400">@{user.username}</div>
                      </div>
                    </div>
                    <div className="font-mono text-sm font-bold text-secondary">{user.total_score.toLocaleString()} XP</div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

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
