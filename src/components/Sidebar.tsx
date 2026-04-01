import { Module, Lecture } from '../types';
import { ChevronDown, ChevronRight, PlayCircle, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface SidebarProps {
  courseData: Module[];
  currentLecture: Lecture;
  onSelectLecture: (lecture: Lecture) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ courseData, currentLecture, onSelectLecture, isOpen = true, onClose }: SidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [courseData[0].id]: true
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-black/60 backdrop-blur-xl text-slate-300 h-full overflow-y-auto border-r border-white/10 flex flex-col custom-scrollbar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center backdrop-blur-md">
          <div>
            <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Course Curriculum</h2>
            <p className="text-lg font-bold text-white tracking-tight">Python Masterclass</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex-1 py-4">
          {courseData.map((module, index) => (
            <div key={module.id} className="mb-2">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-white/5 transition-colors text-left group"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400/80 mb-1">Section {index + 1}</span>
                  <span className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">{module.title}</span>
                </div>
                {expandedModules[module.id] ? (
                  <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform" />
                )}
              </button>
              
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                expandedModules[module.id] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="bg-black/40 py-2 border-y border-white/5">
                  {module.lectures.map((lecture, lIndex) => {
                    const isActive = currentLecture.id === lecture.id;
                    return (
                      <button
                        key={lecture.id}
                        onClick={() => {
                          onSelectLecture(lecture);
                          if (onClose) onClose(); // Close sidebar on mobile after selection
                        }}
                        className={cn(
                          "w-full flex items-start gap-3 px-6 py-3 text-left text-sm transition-all duration-200 relative group",
                          isActive 
                            ? "bg-indigo-500/10 text-indigo-300" 
                            : "hover:bg-white/5 text-slate-400"
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                        )}
                        
                        {isActive ? (
                          <PlayCircle className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400 animate-pulse" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        )}
                        
                        <div className="flex flex-col">
                          <span className={cn("leading-snug font-medium transition-colors", isActive ? "text-white" : "text-slate-300 group-hover:text-white")}>
                            {lIndex + 1}. {lecture.title}
                          </span>
                          <span className="text-[11px] text-slate-500 mt-1">
                            {Math.floor((lecture.endTime - lecture.startTime) / 60)} min
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
