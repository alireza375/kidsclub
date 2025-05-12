import React from 'react'


const Organizer = ({data}) => {
  return (
    <div className="xl:w-[648px]">
      <div className="relative group overflow-hidden">
        {/* Main Image */}
        <div className="relative rounded-3xl">
          <img
            src={data?.organizer?.image}
            alt="Profile Picture"
            className="object-fill w-full h-full"
          />
        </div>
        {/* Profile Info */}
        <div className="rounded bg-[#FBF1E3] mt-6 p-6 text-center">
            <h2 className="text-2xl font-bold text-text mb-1">{data?.organizer?.name}</h2>
        </div>
      </div>
  </div>
  )
}

export default Organizer
