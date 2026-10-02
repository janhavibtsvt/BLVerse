import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AiChatModal } from './components/AiChatModal';
import { AddWorkModal } from './components/AddWorkModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { MobileBottomNav } from './components/MobileBottomNav';

import { HomePage } from './pages/HomePage';
import { SeriesListPage } from './pages/SeriesListPage';
import { SeriesDetailPage } from './pages/SeriesDetailPage';
import { MangaListPage } from './pages/MangaListPage';
import { ManhwaListPage } from './pages/ManhwaListPage';
import { ManhuaListPage } from './pages/ManhuaListPage';
import { NovelsListPage } from './pages/NovelsListPage';
import { WorkDetailPage } from './pages/WorkDetailPage';
import { AdaptationsPage } from './pages/AdaptationsPage';
import { CharactersPage } from './pages/CharactersPage';
import { CharacterDetailPage } from './pages/CharacterDetailPage';
import { ActorsPage } from './pages/ActorsPage';
import { ActorDetailPage } from './pages/ActorDetailPage';
import { UpcomingPage } from './pages/UpcomingPage';
import { CalendarPage } from './pages/CalendarPage';
import { SearchPage } from './pages/SearchPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAddWorkOpen, setIsAddWorkOpen] = useState(false);

  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#0B0712] text-[#F8F5FC] flex flex-col font-sans selection:bg-[#9F7AEA]/40 selection:text-[#F8F5FC] relative overflow-hidden">
            {/* Dynamic Customizable Atmospheric Background */}
            <AtmosphericBackground />

            {/* Main Global Navigation */}
            <Navbar 
              onOpenAiChat={() => setIsAiChatOpen(true)} 
              onOpenAddWork={() => setIsAddWorkOpen(true)}
            />

            {/* Primary View Routing */}
            <main className="flex-1 relative z-10 pb-16 lg:pb-0">
              <Routes>
                <Route path="/" element={<HomePage onOpenAiChat={() => setIsAiChatOpen(true)} />} />
                
                {/* Live-Action BL Series */}
                <Route path="/series" element={<SeriesListPage />} />
                <Route path="/series/:id" element={<SeriesDetailPage />} />

                {/* Comics & Novels */}
                <Route path="/manga" element={<MangaListPage />} />
                <Route path="/manga/:id" element={<WorkDetailPage forcedType="manga" />} />

                <Route path="/manhwa" element={<ManhwaListPage />} />
                <Route path="/manhwa/:id" element={<WorkDetailPage forcedType="manhwa" />} />

                <Route path="/manhua" element={<ManhuaListPage />} />
                <Route path="/manhua/:id" element={<WorkDetailPage forcedType="manhua" />} />

                <Route path="/novels" element={<NovelsListPage />} />
                <Route path="/novels/:id" element={<WorkDetailPage forcedType="novel" />} />

                {/* Cross-Media Adaptation Intelligence */}
                <Route path="/adaptations" element={<AdaptationsPage />} />
                <Route path="/adaptations/:id" element={<AdaptationsPage />} />

                {/* Characters & Actors */}
                <Route path="/characters" element={<CharactersPage />} />
                <Route path="/characters/:id" element={<CharacterDetailPage />} />
                <Route path="/actors" element={<ActorsPage />} />
                <Route path="/actors/:id" element={<ActorDetailPage />} />

                {/* Upcoming & Calendar Schedule */}
                <Route path="/upcoming" element={<UpcomingPage />} />
                <Route path="/calendar" element={<CalendarPage />} />

                {/* Search & User Collection */}
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Fallback */}
                <Route path="*" element={<HomePage onOpenAiChat={() => setIsAiChatOpen(true)} />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />

            {/* Mobile Bottom Bar for one-thumb navigation */}
            <MobileBottomNav onOpenAiChat={() => setIsAiChatOpen(true)} />

            {/* Ask BLVerse AI Modal */}
            <AiChatModal
              isOpen={isAiChatOpen}
              onClose={() => setIsAiChatOpen(false)}
            />

            {/* Add Missing Work Modal */}
            <AddWorkModal
              isOpen={isAddWorkOpen}
              onClose={() => setIsAddWorkOpen(false)}
              onAdded={() => {
                // Trigger reload of local states or re-render
                window.dispatchEvent(new Event('custom-works-updated'));
              }}
            />

            {/* Theme Customizer Modal */}
            <ThemeCustomizerModal />
          </div>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}
