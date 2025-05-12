import React from 'react'
import Skeleton from 'react-loading-skeleton'

const BlogSkeleton = () => {
  return (
    <div>
         <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <div className="space-y-4">
            <Skeleton width={"full"} height={300} />

              {Array(3).fill(null).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton width={"full"} />
                </div>
              ))}
            </div>
          </div>
    </div>
  )
}

export default BlogSkeleton