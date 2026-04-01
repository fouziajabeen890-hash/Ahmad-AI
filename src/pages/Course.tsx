import { useState } from 'react';
import { courseData } from '../data/courseData';
import { Lecture } from '../types';
import Sidebar from '../components/Sidebar';
import VideoPlayer from '../components/VideoPlayer';
import AITutor from '../components/AITutor';
import { BookOpen, Video, Code2, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Course() {
  const [currentLecture, setCurrentLecture] = useState<Lecture>(courseData[0].lectures[0]);
  const [activeTab, setActiveTab] = useState<'video' | 'practice'>('video');
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
          setActiveTab('video'); // Switch back to video when changing lecture
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
            <BookOpen className="w-4 h-4 hidden sm:block" />
            <span className="font-medium text-xs uppercase tracking-wider hidden sm:block">Current Lesson</span>
          </div>
          <div className="h-4 w-px bg-white/10 mx-4 hidden sm:block"></div>
          <h2 className="font-semibold text-slate-200 truncate">{currentLecture.title}</h2>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            
            {/* Tabs */}
            <div className="flex items-center gap-2 sm:gap-4 mb-6 border-b border-white/10 pb-4 overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveTab('video')}
                className={cn(
                  "flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm sm:text-base", 
                  activeTab === 'video' ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Video className="w-4 h-4" />
                Video Lecture
              </button>
              <button
                onClick={() => setActiveTab('practice')}
                className={cn(
                  "flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm sm:text-base", 
                  activeTab === 'practice' ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Code2 className="w-4 h-4" />
                Practice Code
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'video' ? (
              <div className="space-y-8 animate-in fade-in duration-300">
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
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-start gap-3 backdrop-blur-sm">
                  <Code2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-emerald-400 font-medium tracking-tight">Live Python Compiler</h4>
                    <p className="text-sm text-slate-300 mt-1 font-light">Write and run your Python code directly in the browser. Try practicing what you learned in the video!</p>
                  </div>
                </div>
                <div className="h-[500px] sm:h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#1e1e1e]">
                  <iframe 
                    src="https://onecompiler.com/embed/python?theme=dark&hideLanguageSelection=true&hideNew=true&hideTitle=true" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0"
                    title="Python Compiler"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Tutor Panel */}
      <div className="hidden xl:block w-[400px] shrink-0 h-full border-l border-white/10 shadow-2xl z-10 bg-black/40 backdrop-blur-xl">
        <AITutor currentLecture={currentLecture} />
      </div>
    </div>
  );
}
