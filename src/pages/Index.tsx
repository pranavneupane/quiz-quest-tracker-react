
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import HostDashboard from '../components/HostDashboard';
import PlayerLobby from '../components/PlayerLobby';
import SoloQuiz from '../components/SoloQuiz';
import MultiplayerQuiz from '../components/MultiplayerQuiz';
import QuizResults from '../components/QuizResults';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/host" element={<HostDashboard />} />
        <Route path="/join" element={<PlayerLobby />} />
        <Route path="/solo/:quizId" element={<SoloQuiz />} />
        <Route path="/multiplayer/:sessionId" element={<MultiplayerQuiz />} />
        <Route path="/results/:sessionId" element={<QuizResults />} />
      </Routes>
    </div>
  );
};

export default Index;
