import React, { useEffect } from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"
import { useFetch } from '../../../helpers/hooks';
import { fetchinstractor } from '../../../helpers/backend';
import { useParams } from 'react-router-dom';

const InstructorDetails = () => {

  const { id } = useParams();
  const [instructor, getInstructor, { loading }] = useFetch(fetchinstractor, { id });

  useEffect(() => {
    getInstructor();
  }, [id]);
  return (
    <div className=" bg-[#fdf6ec] md:p-8 p-4">
      <div className="custom-container grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <img
              src={instructor?.image}
              alt="Profile photo of hiking coach"

              className="object-cover w-full h-full border-2 rounded-[20px] border-primary border-dashed"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-[28px] font-nunito font-bold">About Me</h2>
            <p className="midtitle !text-breadcrumb leading-relaxed">
              {instructor?.about}
            </p>
          </div>
        </div>

        <div className="">
          <div className="text-center mb-6 pt-5 pb-[50px] rounded-[20px] bg-[#FBF1E3]">
            <h1 className="title-about text-text mb-2 ">{instructor?.name}</h1>
            <p className="mb-4 text-breadcrumb midtitle !font-bold">{"ksdfjlskdf"}</p>
            <div className="flex justify-center gap-4">
              <a href={instructor?.facebook} className={'p-1 h-6 w-6 rounded-full'}><FaFacebook />
              </a>
              <a href={instructor?.twitter} className={'p-1 h-6 w-6 rounded-full'}><FaTwitter />
              </a>
              <a href={instructor?.instagram} className={'p-1 h-6 w-6 rounded-full'}><FaInstagram />
              </a>
              <a href={instructor?.linkedin} className={'p-1 h-6 w-6 rounded-full'}><FaLinkedin />
              </a>
            </div>
          </div>

          <div className="rounded-[20px] border border-text space-y-6 md:px-14 px-5 py-[30px] bg-white">
            <section >
              <h2 className="midtitle !text-text !font-bold mb-3">Education </h2>
              <div className="list-disc pl-5 space-y-2 text-breadcrumb">
                <p>{instructor?.education}</p>
              </div>
            </section>
            <section >
              <h2 className="midtitle !text-text !font-bold mb-3">Philosophy </h2>
              <div className="list-disc pl-5 space-y-2 text-breadcrumb">
                <p>{instructor?.philosophy}</p>
              </div>
            </section>
            <section >
              <h2 className="midtitle !text-text !font-bold mb-3">Achievements </h2>
              <div className="list-disc pl-5 space-y-2 text-breadcrumb">
                <p>{instructor?.achievement}</p>
              </div>
            </section>
            <section >
              <h2 className="midtitle !text-text !font-bold mb-3">Description</h2>
              <div className="list-disc pl-5 space-y-2 text-breadcrumb">
                <p>{instructor?.description}</p>
              </div>
            </section>
            <section >
              <h2 className="midtitle !text-text !font-bold mb-3">Experience</h2>
              <div className="list-disc pl-5 space-y-2 text-breadcrumb">
                <p>{instructor?.experience}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorDetails