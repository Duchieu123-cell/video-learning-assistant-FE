import { axiosClient } from './axiosClient';

export const courseApi = {
    getCourses: () => {
        return axiosClient.get('/courses');
    },
    getCourseDetail: (courseId) => {
        return axiosClient.get(`/courses/${courseId}`);
    },
    getChatHistory: (courseId) => {
        return axiosClient.get(`/chat/history/${courseId}`);
    },
};