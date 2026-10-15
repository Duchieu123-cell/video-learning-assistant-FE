import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { courseApi } from '../api/courseApi';
import { usePlayerStore } from '../store/usePlayerStore';
import VideoPlayer from '../components/VideoPlayer';
import { BookOpen, Sparkles } from 'lucide-react';
import { useParams } from "react-router-dom"
import ChatSidebar from '../components/ChatSidebar';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';

const CourseDetail = () => {
    // const courseDetail = {
    //     id: 1,
    //     title: "Khóa học ReactJS cơ bản",
    //     lessons: [
    //         { id: 1, title: "Giới thiệu về ReactJS", video_url: "https://example.com/reactjs-intro", duration_seconds: 300 },
    //         { id: 2, title: "JSX và Component", video_url: "https://example.com/jsx-and-components", duration_seconds: 600 },
    //     ]
    // }

    const currentLesson = usePlayerStore((state) => state.currentLesson);
    const setCurrentLesson = usePlayerStore.getState().actions.setCurrentLesson;
    const { course_id: activeCourseId } = useParams();

    const { 
        data: courseDetail, 
        isLoading: isLoadingDetail
    } = useQuery({
        queryKey: ['courseDetail', activeCourseId],
        queryFn: () => courseApi.getCourseDetail(activeCourseId),
        enabled: !!activeCourseId,
    });

    // Tự động set bài học đầu tiên khi fetch xong
    useEffect(() => {
        if (courseDetail?.lessons?.length && !currentLesson) {
            setCurrentLesson(courseDetail.lessons[0]);
        }
    }, [courseDetail, currentLesson]);

    if (isLoadingDetail) {
        return (
            <div className="flex h-screen items-center justify-center text-slate-400">
                Đang tải khóa học...
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-slate-900">
            <div className="flex h-14 items-center justify-between border-b border-slate-800 px-6">
                
                <Link
                    to="/courses"
                    className="flex items-center justify-center text-indigo-400 bg-indigo-500/10 w-6 h-6 rounded-full hover:bg-blue-200"
                >
                    <FontAwesomeIcon icon={faCircleArrowLeft} />
                </Link>
                
                <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-500" />
                    <span className="font-semibold text-slate-200">
                        {courseDetail?.title || 'E-Learning Platform'}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Học cùng AI</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden p-6 gap-6">
                <div className="w-100 flex flex-col overflow-y-auto pr-2">
                    <VideoPlayer />

                    <div className="mt-6">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                            Danh sách bài học
                        </h3>
                        <div className="flex flex-col gap-2">
                            {courseDetail?.lessons?.map((lesson) => (
                                <button
                                    key={lesson.id}
                                    onClick={() => setCurrentLesson(lesson)}
                                    className={`flex items-center justify-between rounded-lg p-3 text-left transition border ${
                                        currentLesson?.id === lesson.id
                                        ? 'bg-blue-600 border-white text-white'
                                        : 'bg-slate-900 border-slate-800/60 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                    }`}
                                >
                                    <span className="text-sm font-medium">{lesson.title}</span>
                                    <span className="text-xs">
                                        {Math.floor(lesson.duration_seconds / 60)}:{(lesson.duration_seconds % 60).toString().padStart(2, '0')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="flex-1 rounded-xl border-2 border-slate-800">
                    <ChatSidebar
                        courseId={activeCourseId}
                    />
                </aside>
            </div>
        </div>
    );
}

export default CourseDetail;