import React from 'react';
import { FaYoutube, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';


export default function Instructor({data}) {
  return (
    <div className="lg:w-[648px]">
      {/* {instructors.map((instructor) => ( */}
        <div className="relative group overflow-hidden">
          {/* Main Image */}
          <div className="relative rounded-3xl h-[300px]">
            <img
              src={data?.instructor?.image}
              alt="Profile Picture"
              className="object-fill w-full h-full"
            />
          </div>

          <div className="absolute top-0 right-10 transform translate-x-32 group-hover:translate-x-0 transition-transform duration-300">
            <div className="bg-emerald-400 rounded-b-full p-5 flex flex-col gap-6">
              {/* <a href={data?.instructor.social.youtube} className="text-white hover:text-[#FF6B6D] transition-colors">
                <FaYoutube size={24} />
              </a>
              <a href={instructor.social.linkedin} className="text-white hover:text-[#FF6B6D] transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href={instructor.social.twitter} className="text-white hover:text-[#FF6B6D] transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href={instructor.social.heart} className="text-white hover:text-[#FF6B6D] transition-colors">
                <FaHeart size={24} />
              </a> */}
            </div>
          </div>
          {/* Profile Info */}
          <div className="rounded bg-[#FBF1E3] mt-6 p-6 text-center">
            <Link to={`/instructor/${data?.instructor?.id}`}>
              <h2 className="text-2xl font-bold text-text mb-1">{data?.instructor?.name}</h2>
            </Link>
            <p className="header-description text-text font-semibold">{data?.instructor?.role}</p>
          </div>
        </div>
      {/* ))} */}
    </div>
  );
}