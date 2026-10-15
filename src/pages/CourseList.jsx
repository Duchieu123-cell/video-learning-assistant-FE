import { useQuery } from '@tanstack/react-query';
import { courseApi } from '../api/courseApi';
import { authApi } from '../api/authApi';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const CourseList = () => {
    const { 
        data: courses,
        isLoading: isLoadingCourses
    } = useQuery({
        queryKey: ['courses'],
        queryFn: courseApi.getCourses,
    });
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authApi.logout();
        useAuthStore.getState().actions.logout();

        navigate('/', { replace: true });
    }

    if (isLoadingCourses) {
        return (
            <div className="flex h-screen items-center justify-center text-slate-400">
                Đang tải các khóa học...
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-slate-950">
            <div className="flex h-14 items-center justify-between gap-3 border-b border-slate-800 px-6">
                <div>
                    <BookOpen className="h-5 w-5 text-indigo-500" />
                    <span className="font-semibold text-slate-200">
                        Danh sách khóa học
                    </span>
                </div>

                <button
                    onClick={handleLogout}
                    className="rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden p-6 gap-6">
                <div className="flex flex-col gap-2">
                    {courses?.map((course) => (
                        <Link
                            key={course.id}
                            to={`/courses/${course.id}`}
                            className="flex flex-col gap-4 rounded-lg p-3 text-left transition border-2 bg-slate-900 border-slate-800/60 text-slate-500 hover:bg-blue-500 hover:text-white"
                        >
                            <h1 className="text-sm font-medium">{course.title}</h1>
                            <p className="text-xs">{course.description}</p>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default CourseList;