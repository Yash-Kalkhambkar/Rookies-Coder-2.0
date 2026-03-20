/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LearningPath } from './pages/LearningPath';
import { Lesson } from './pages/Lesson';
import { Community } from './pages/Community';
import { Progress } from './pages/Progress';
import { Contests } from './pages/Contests';
import { Admin } from './pages/Admin';

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ className: 'font-mono text-sm border border-outline rounded-none shadow-[4px_4px_0px_0px_rgba(30,30,47,1)]' }} />
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/path" element={<LearningPath />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/community" element={<Community />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}
