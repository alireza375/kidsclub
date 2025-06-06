import React from 'react';

const MainLoader = () => {
    return (
        <div
            style={{ zIndex: 99999 }}
            className="fixed left-0 w-full top-0 h-screen flex justify-center items-center bg-gray-500 bg-opacity-25"
            id="main-loader"
        >
            <Loader />
        </div>
    );
};

export const showLoader = () => document.getElementById("main-loader").classList.remove('hidden');
export const hideLoader = () => document.getElementById('main-loader').classList.add('hidden');

export default MainLoader;

export const Loader = () => {
    return (
        <div
            aria-label="Loading..."
            role="status"
            className="flex items-center space-x-3"
        >
            <div className="relative flex justify-center items-center">
                <svg
                    className="h-16 w-16 animate-spin stroke-secondary opacity-75"
                    viewBox="0 0 256 256"
                    style={{ animationDuration: '2s', animationTimingFunction: 'linear' }}
                >
                    <line
                        x1="128"
                        y1="32"
                        x2="128"
                        y2="64"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                    ></line>
                    <line
                        x1="195.9"
                        y1="60.1"
                        x2="173.3"
                        y2="82.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                    ></line>
                    <line
                        x1="224"
                        y1="128"
                        x2="192"
                        y2="128"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                    ></line>
                    <line
                        x1="195.9"
                        y1="195.9"
                        x2="173.3"
                        y2="173.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                    ></line>
                    <line
                        x1="128"
                        y1="224"
                        x2="128"
                        y2="192"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                    ></line>
                    <line
                        x1="60.1"
                        y1="195.9"
                        x2="82.7"
                        y2="173.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                    ></line>
                    <line
                        x1="32"
                        y1="128"
                        x2="64"
                        y2="128"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                    ></line>
                    <line
                        x1="60.1"
                        y1="60.1"
                        x2="82.7"
                        y2="82.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                    ></line>
                </svg>
                {/* Optional: Add a glowing effect */}
                <div className="absolute inset-0 border-2 border-secondary rounded-full animate-pulse"></div>
            </div>
        </div>
    );
};

