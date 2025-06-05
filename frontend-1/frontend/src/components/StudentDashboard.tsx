/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { DocListItem, DocListResponse, ErrorResponse, StructuredDoc, StructuredDocResponse } from '../types/api';

interface CourseViewProps {
    docId: string;
    onBack: () => void;
}

const CourseView = ({ docId, onBack }: CourseViewProps) => {
    const [course, setCourse] = useState<StructuredDoc | null>(null);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        loadCourse();
        // Check system preference for dark mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
    }, [docId]);

    const loadCourse = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<StructuredDocResponse>(`/courses/${docId}`);
            if (response.data.data) {
                setCourse(response.data.data);
                setCurrentModuleIndex(0);
                setCurrentLessonIndex(0);
            }
        } catch (err: any) {
            const errorResponse = err.response?.data as ErrorResponse;
            setError(errorResponse?.message || 'Failed to load course');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (!course) return;
        const currentModule = course.modules[currentModuleIndex];
        if (currentLessonIndex < currentModule.lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
        } else if (currentModuleIndex < course.modules.length - 1) {
            setCurrentModuleIndex(currentModuleIndex + 1);
            setCurrentLessonIndex(0);
        }
    };

    const handlePrevious = () => {
        if (!course) return;
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(currentLessonIndex - 1);
        } else if (currentModuleIndex > 0) {
            setCurrentModuleIndex(currentModuleIndex - 1);
            const previousModule = course.modules[currentModuleIndex - 1];
            setCurrentLessonIndex(previousModule.lessons.length - 1);
        }
    };

    const handleModuleSelect = (moduleIndex: number) => {
        setCurrentModuleIndex(moduleIndex);
        setCurrentLessonIndex(0);
    };

    const handleLessonSelect = (lessonIndex: number) => {
        setCurrentLessonIndex(lessonIndex);
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
                <div className="text-xl">Loading your course...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-4 ${isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-700'} rounded-lg`}>
                {error}
            </div>
        );
    }

    if (!course) {
        return (
            <div className={`p-4 ${isDarkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-700'} rounded-lg`}>
                Course not found
            </div>
        );
    }

    const currentModule = course.modules[currentModuleIndex];
    const currentLesson = currentModule.lessons[currentLessonIndex];
    const isFirstLesson = currentModuleIndex === 0 && currentLessonIndex === 0;
    const isLastLesson = 
        currentModuleIndex === course.modules.length - 1 && 
        currentLessonIndex === currentModule.lessons.length - 1;

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            {/* Top Navigation Bar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                                className={`p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className={`ml-4 text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {course.courseTitle}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className={`p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                {isDarkMode ? (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                            <button
                                onClick={onBack}
                                className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                                Back to Courses
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-16 flex">
                {/* Sidebar */}
                <aside className={`fixed left-0 top-16 bottom-0 w-64 transform transition-transform duration-200 ease-in-out ${
                    showSidebar ? 'translate-x-0' : '-translate-x-full'
                } ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r overflow-y-auto`}>
                    <div className="p-4">
                        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Course Content
                        </h2>
                        <nav className="space-y-2">
                            {course.modules.map((module, moduleIndex) => (
                                <div key={moduleIndex}>
                                    <button
                                        onClick={() => handleModuleSelect(moduleIndex)}
                                        className={`w-full text-left px-4 py-2 rounded-md ${
                                            currentModuleIndex === moduleIndex
                                                ? isDarkMode
                                                    ? 'bg-blue-900 text-white'
                                                    : 'bg-blue-100 text-blue-900'
                                                : isDarkMode
                                                    ? 'hover:bg-gray-700'
                                                    : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        {module.moduleTitle}
                                    </button>
                                    {currentModuleIndex === moduleIndex && (
                                        <div className="ml-4 mt-2 space-y-1">
                                            {module.lessons.map((lesson, lessonIndex) => (
                                                <button
                                                    key={lessonIndex}
                                                    onClick={() => handleLessonSelect(lessonIndex)}
                                                    className={`w-full text-left px-4 py-2 rounded-md ${
                                                        currentLessonIndex === lessonIndex
                                                            ? isDarkMode
                                                                ? 'bg-blue-800 text-white'
                                                                : 'bg-blue-50 text-blue-900'
                                                            : isDarkMode
                                                                ? 'hover:bg-gray-700'
                                                                : 'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {lesson.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className={`flex-1 transition-all duration-200 ${showSidebar ? 'ml-64' : 'ml-0'}`}>
                    <div className="max-w-4xl mx-auto p-6">
                        <div className={`rounded-lg shadow-lg overflow-hidden ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <div className="p-6">
                                <div className="mb-6">
                                    <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {currentModule.moduleTitle}
                                    </h2>
                                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                        {currentLesson.title}
                                    </h3>
                                </div>

                                <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
                                    <div className={`whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {currentLesson.content}
                                    </div>
                                    {currentLesson.example && (
                                        <div className={`mt-6 p-4 rounded-lg ${
                                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                        }`}>
                                            <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                Example:
                                            </h4>
                                            <pre className={`whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {currentLesson.example}
                                            </pre>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex justify-between items-center pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={isFirstLesson}
                                        className={`px-6 py-2 rounded-lg ${
                                            isFirstLesson
                                                ? isDarkMode
                                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : isDarkMode
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Lesson {currentLessonIndex + 1} of {currentModule.lessons.length}
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        disabled={isLastLesson}
                                        className={`px-6 py-2 rounded-lg ${
                                            isLastLesson
                                                ? isDarkMode
                                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : isDarkMode
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default function StudentDashboard() {
    const [courses, setCourses] = useState<DocListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        fetchCourses();
        // Check system preference for dark mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<DocListResponse>('/courses/available');
            if (response.data.data) {
                setCourses(response.data.data);
            }
        } catch (err: any) {
            const errorResponse = err.response?.data as ErrorResponse;
            setError(errorResponse?.message || 'Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const handleCourseSelect = (courseId: string) => {
        setSelectedCourseId(courseId);
    };

    const handleBackToCourses = () => {
        setSelectedCourseId(null);
    };

    if (selectedCourseId) {
        return <CourseView docId={selectedCourseId} onBack={handleBackToCourses} />;
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <nav className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Available Courses
                        </h1>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            {isDarkMode ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className={`flex justify-center items-center min-h-[400px] ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                            <div className="text-xl">Loading courses...</div>
                        </div>
                    ) : error ? (
                        <div className={`p-4 ${isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-700'} rounded-lg`}>
                            {error}
                        </div>
                    ) : courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div
                                    key={course._id}
                                    onClick={() => handleCourseSelect(course._id)}
                                    className={`rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 cursor-pointer ${
                                        isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="p-6">
                                        <h2 className={`text-xl font-semibold mb-3 ${
                                            isDarkMode ? 'text-white' : 'text-gray-800'
                                        }`}>
                                            {course.courseTitle}
                                        </h2>
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>
                                            <p>Last updated: {new Date(course.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                        <button
                                            className={`mt-4 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                                                isDarkMode
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                        >
                                            Start Learning
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            No courses available at the moment.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 