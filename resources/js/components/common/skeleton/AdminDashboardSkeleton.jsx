import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function AdminDashboardSkeleton() {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-teal-blue p-4 text-white">
                <Skeleton
                    height={40}
                    className="mb-6 glassy-skeleton"
                    baseColor="#6c757d"
                    highlightColor="#adb5bd"
                />{" "}
                {/* Logo */}
                <div className="space-y-4">
                    {Array(13)
                        .fill(null)
                        .map((_, i) => (
                            <Skeleton
                                key={i}
                                height={24}
                                className="flex items-center justify-between space-y-4 glassy-skeleton"
                                baseColor="#6c757d"
                                highlightColor="#adb5bd"
                            />
                        ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
                    <Skeleton
                        width={200}
                        height={40}
                        className="mb-4 md:mb-0"
                    />
                    <div className="flex items-center space-x-4">
                        <Skeleton width={120} height={40} />
                        <Skeleton circle width={40} height={40} />
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                    {Array(4)
                        .fill(null)
                        .map((_, i) => (
                            <div
                                key={i}
                                className="bg-white p-4 md:p-6 rounded-lg shadow-sm"
                            >
                                <Skeleton width={100} className="mb-2" />
                                <Skeleton height={36} className="mb-1" />
                                <Skeleton width={100} />
                            </div>
                        ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Upcoming Events */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                        <Skeleton width={150} height={24} className="mb-4" />
                        <div className="space-y-4">
                            {Array(3)
                                .fill(null)
                                .map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between"
                                    >
                                        <Skeleton width={150} />
                                        <Skeleton width={80} />
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Popular Activities */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                        <Skeleton width={150} height={24} className="mb-4" />
                        <div className="space-y-4">
                            {Array(4)
                                .fill(null)
                                .map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between"
                                    >
                                        <Skeleton width={120} />
                                        <Skeleton width={60} />
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Top Performing Coaches */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                        <Skeleton width={180} height={24} className="mb-4" />
                        <div className="space-y-4">
                            {Array(3)
                                .fill(null)
                                .map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3"
                                    >
                                        <Skeleton
                                            circle
                                            width={40}
                                            height={40}
                                        />
                                        <div className="flex-1">
                                            <Skeleton
                                                width={120}
                                                className="mb-2"
                                            />
                                            <Skeleton width={60} />
                                        </div>
                                        <Skeleton width={40} />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mt-4 md:mt-6">
                    <Skeleton width={150} height={24} className="mb-4" />
                    <Skeleton height={200} />
                </div>

                {/* Recent Achievements */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mt-4 md:mt-6">
                    <Skeleton width={180} height={24} className="mb-4" />
                    <div className="space-y-4">
                        {Array(3)
                            .fill(null)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3"
                                >
                                    <Skeleton circle width={32} height={32} />
                                    <div className="flex-1">
                                        <Skeleton
                                            width="80%"
                                            className="mb-2"
                                        />
                                        <Skeleton width="60%" />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
