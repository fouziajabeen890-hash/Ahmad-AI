import { useState } from 'react';
import { courseData } from '../data/courseData';
import { Lecture } from '../types';
import Sidebar from '../components/Sidebar';
import VideoPlayer from '../components/VideoPlayer';
import { PlayCircle, Menu } from 'lucide-react';

export default function VideoLectures() {
  const [currentLecture, setCurrentLecture] = useState<Lecture>(courseData[0].lectures[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {/* Sidebar Navigation */}
      <Sidebar 
        courseData={courseData} 
        currentLecture={currentLecture} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectLecture={(lecture) => {
          setCurrentLecture(lecture);
        }} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
        {/* Header */}
        <header className="h-14 border-b border-white/10 flex items-center px-4 sm:px-8 bg-black/40 backdrop-blur-md shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden mr-4 p-2 -ml-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-indigo-400">
            <PlayCircle className="w-4 h-4 hidden sm:block" />
            <span className="font-medium text-xs uppercase tracking-wider hidden sm:block">Video Lecture</span>
          </div>
          <div className="h-4 w-px bg-white/10 mx-4 hidden sm:block"></div>
          <h2 className="font-semibold text-slate-200 truncate">{currentLecture.title}</h2>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="shadow-2xl shadow-black/50 rounded-2xl ring-1 ring-white/10 overflow-hidden">
              <VideoPlayer lecture={currentLecture} />
            </div>
            
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">About this lecture</h3>
              <p className="text-slate-300 leading-relaxed text-base sm:text-lg font-light">
                {currentLecture.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
