import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

const VideoPlayer = () => {
    const currentLesson = usePlayerStore((state) => state.currentLesson);
    const seekToSeconds = usePlayerStore((state) => state.seekToSeconds);
    const clearSeek = usePlayerStore.getState().actions.clearSeek;
    const videoRef = useRef(null);

    useEffect(() => {
        if (seekToSeconds !== null && videoRef.current) {
            videoRef.current.currentTime = seekToSeconds;
            videoRef.current.play();
            clearSeek();
        }
    }, [seekToSeconds, clearSeek]);

    if (!currentLesson) {
        return (
            <div className="flex h-full min-h-100 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-500">
                Chọn một bài học để bắt đầu
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-slate-800 shadow-lg">
                {currentLesson.video_url ? (
                    <video
                        ref={videoRef}
                        src={currentLesson.video_url}
                        controls
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                        Bài học này không có video
                    </div>
                )}
            </div>
            <div>
                <h3 className="font-semibold text-slate-100">{currentLesson.title}</h3>
                <p className="text-sm text-slate-400">
                    Thời lượng: {Math.floor(currentLesson.duration_seconds / 60)} phút {currentLesson.duration_seconds % 60} giây
                </p>
            </div>
        </div>
    );
};

export default VideoPlayer;