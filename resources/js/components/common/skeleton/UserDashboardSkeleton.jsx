import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UserDashboardSkeleton = () => {
  return (
    <div className="md:flex bg-[#fdf3ee] px-20">
      {/* Sidebar Skeleton */}
      <aside className="w-64 text-white flex flex-col py-6 px-4">
        <Skeleton height={32} width={120} className="mb-6" />
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} height={40} className="rounded-md" />
          ))}
        </div>
        <div className="mt-auto space-y-2">
          <Skeleton height={40} className="rounded-md" />
          <Skeleton height={40} className="rounded-md" />
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 p-6">
        {/* Top Section Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton circle={true} height={100} width={100} />
          <Skeleton height={40} width={200} />
        </div>

        {/* Statistics Cards Skeleton */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="p-4 bg-white shadow rounded-lg flex items-center justify-between"
            >
              <Skeleton height={40} width={60} />
              <Skeleton height={20} width={100} />
            </div>
          ))}
        </div>

        {/* Upcoming Events Table Skeleton */}
        <div className="bg-white p-4 rounded-lg shadow">
          <Skeleton height={30} width={150} className="mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-6 items-center"
              >
                <Skeleton height={20} width="80%" />
                <Skeleton height={20} width="60%" />
                <Skeleton height={20} width="70%" />
                <Skeleton height={20} width="50%" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboardSkeleton;
