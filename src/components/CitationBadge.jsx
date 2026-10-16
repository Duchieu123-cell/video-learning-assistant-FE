import { PlayCircle } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

function formatTimestamp(seconds) {
  if (seconds === null || seconds === undefined) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const CitationBadge = ({ citations }) => {
    if (!citations || citations.length === 0) return null;

    const handleClick = (start_seconds) => {
        if (start_seconds !== null && start_seconds !== undefined) {
            usePlayerStore.getState().actions.seekVideo(start_seconds);
        }
    }

    return (
        <div className="mt-2.5 pt-2.5 border-t border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5 uppercase tracking-wider">
                Nguồn bài giảng:
            </span>
            <div className="flex flex-wrap gap-1.5">
                {citations.map((cite, idx) => (
                    <button
                        key={cite.chunk_id || idx}
                        onClick={() => handleClick(cite.start_seconds)}
                        title={`Xem đoạn: ${cite.lesson_title}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900 hover:text-indigo-100 transition shadow-sm"
                    >
                        <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="truncate max-w-35">{cite.lesson_title}</span>
                        <span className="text-indigo-400 font-mono">
                            ({formatTimestamp(cite.start_seconds)})
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CitationBadge;