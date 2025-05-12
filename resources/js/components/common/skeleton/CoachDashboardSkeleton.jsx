import React from 'react'
import { FaBell, FaBookOpen, FaCalendar, FaDashcube, FaHelicopter, FaUser } from 'react-icons/fa6'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function CoachDashboardSkeleton() {
  return (
    <div className="flex mx-20">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background p-6 space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Skeleton circle width={100} height={100} />
          </div>
          <div className="text-center space-y-2">
            <Skeleton width={120} height={24} />
            <Skeleton width={100} height={20} />
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <div icon={<FaDashcube className="w-4 h-4" />}>
            Dashboard
          </div>
          <div icon={<FaUser className="w-4 h-4" />}>
            Members
          </div>
          <div icon={<FaBell className="w-4 h-4" />}>
            Notice
          </div>
          <div icon={<FaCalendar className="w-4 h-4" />}>
            Events
          </div>
          <div icon={<FaBookOpen className="w-4 h-4" />}>
            Blog
          </div>
          <div icon={<FaHelicopter className="w-4 h-4" />}>
            Help & Support
          </div>
          <div icon={<FaUser className="w-4 h-4" />}>
            Profile
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <Skeleton circle width={80} height={80} />
            <div className="space-y-2">
              <Skeleton width={150} height={24} />
              <Skeleton width={200} height={20} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Notice Section */}
          <div className="col-span-12 xl:col-span-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Notice</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton width={100} />
                    <Skeleton width={80} />
                    <Skeleton width={120} />
                    <Skeleton width={100} />
                    <Skeleton width={80} />
                  </div>
                ))}
              </div>
            </div>

            {/* Newest Members Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
              <h2 className="text-xl font-semibold mb-4">Newest Members</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Skeleton circle width={40} height={40} />
                      <div>
                        <Skeleton width={120} />
                        <Skeleton width={150} />
                      </div>
                    </div>
                    <Skeleton width={100} />
                    <Skeleton width={40} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="col-span-12 xl:col-span-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton circle width={50} height={50} />
                    <div>
                      <Skeleton width={180} />
                      <Skeleton width={100} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// function NavItem({ 
//   icon, 
//   children, 
//   isActive 
// }) {
// if (!icon) {
//   return (
//     <Button
//       variant="ghost"
//       className={cn(
//         "w-full justify-start gap-2",
//         isActive && "bg-accent text-accent-foreground"
//       )}
//     >
//       {children}
//     </Button>
//   )
// }
//   return (
//     <Button
//       variant="ghost"
//       className={cn(
//         "w-full justify-start gap-2",
//         isActive && "bg-accent text-accent-foreground"
//       )}
//     >
//       {icon}
//       {children}
//     </Button>
//   )
// }

