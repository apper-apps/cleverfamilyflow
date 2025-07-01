import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import CalendarPage from '@/components/pages/CalendarPage';
import TodayPage from '@/components/pages/TodayPage';
import ChoresPage from '@/components/pages/ChoresPage';
import FamilyPage from '@/components/pages/FamilyPage';

function App() {
  return (
    <Router>
      <div className="App bg-background min-h-screen">
        <Layout>
          <Routes>
            <Route path="/" element={<TodayPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/chores" element={<ChoresPage />} />
            <Route path="/family" element={<FamilyPage />} />
          </Routes>
        </Layout>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="!z-[9999]"
        />
      </div>
    </Router>
  );
}

export default App;