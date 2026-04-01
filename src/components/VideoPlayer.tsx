import { Lecture } from '../types';
import { ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  lecture: Lecture;
}

export default function VideoPlayer({ lecture }: VideoPlayerProps) {
  const watchUrl = `https://www.youtube.com/watch?v=${lecture.videoId}&t=${lecture.startTime}s`;
  const embedUrl = `https://www.youtube.com/embed/${lecture.videoId}?start=${lecture.startTime}&end=${lecture.endTime}&rel=0&modestbranding=1`;

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <iframe
          src={embedUrl}
          title={lecture.title}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="flex justify-end px-2">
        <a 
          href={watchUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1.5 transition-colors font-medium"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Video not playing? Watch directly on YouTube
        </a>
      </div>
    </div>
  );
}
