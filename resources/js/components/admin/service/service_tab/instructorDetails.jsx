import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"
import profile from '../../../../../images/profile.png'

const InstructorDetails = () => {
    const instructorDetails = {
        name: 'Mr.Debora',
        role: 'Hiking Coach',
        social: [
          { icon: FaFacebook, className: 'bg-blue-600', link: '#' },
          { icon: FaTwitter, className: 'bg-sky-500', link: '#' },
          { icon: FaInstagram, className: 'bg-pink-600', link: '#' },
          { icon: FaYoutube, className: 'bg-red-600', link: '#' }
        ],
        sections: [
          {
            title: 'Education:',
            items: [
              'Degree in Outdoor Leadership and Education',
              'Certificate in Wilderness First Aid and Child Psychology',
              'Advanced Certification in Adventure-based Learning'
            ]
          },
          {
            title: 'Experience:',
            items: [
              '10+ years in outdoor education and child-focused adventure programs',
              'Successfully led over 200 hiking expeditions tailored to children\'s learning and development',
              'Extensive experience in designing safe, engaging, and skill-focused activities'
            ]
          },
          {
            title: 'Skills:',
            items: [
              'Leadership in adventure-based group programs',
              'Expertise in safety protocols, risk assessment, and crisis management',
              'Proficient in mentoring and motivating children of all ages',
              'Deep knowledge of trail mapping, navigation, and outdoor survival skills',
              'Ability to build trust and teamwork among young participants'
            ]
          },
          {
            title: 'Achievements:',
            items: [
              'Designed and implemented innovative hiking and adventure programs for KidKick',
              'Recognized for creating transformative outdoor experiences for children',
              'Developed a successful assistants to outdoor safety and activity planning',
              'Received numerous parent and student accolades for impactful coaching'
            ]
          },
          {
            title: 'Philosophy:',
            items: [
              'Believes in the power of nature to educate, inspire, and transform young minds',
              'Strives to create meaningful experiences that promote physical, emotional, and social development'
            ]
          }
        ]
      };
  return (
    <div className=" bg-[#fdf6ec] md:p-8 p-4">
    <div className="custom-container grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - Image and About */}
      <div className="space-y-6">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={profile}
            alt="Profile photo of hiking coach"
            
            className="object-cover w-full h-full border-2 rounded-[20px] border-primary border-dashed"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-[28px] font-nunito font-bold">About Me</h2>
          <p className="midtitle !text-breadcrumb leading-relaxed">
            Meet Mr. Debora, our expert hiking coach at KidKick. With years of experience in outdoor adventures and a passion for nurturing young explorers, Mr. Debora ensures every hiking session is safe, educational, and fun. His dedication to fostering teamwork, resilience, and a love for nature makes him an integral part of our mission to inspire growth through adventure.
          </p>
        </div>
      </div>

      {/* Right Column - Details */}
      <div className="">
      <div className="text-center mb-6 pt-5 pb-[50px] rounded-[20px] bg-[#FBF1E3]">
        <h1 className="title-about text-text mb-2 ">{instructorDetails.name}</h1>
        <p className="mb-4 text-breadcrumb midtitle !font-bold">{instructorDetails.role}</p>
        <div className="flex justify-center gap-4">
          {instructorDetails.social.map((social, index) => (
            <a key={index} href={social.link} className={`${social.className} p-1 text-white h-6 w-6 rounded-full`}>
              <social.icon />
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-[20px] border border-text space-y-6 md:px-14 px-5 py-[30px] bg-white">
        {instructorDetails.sections.map((section, index) => (
          <section key={index}>
            <h2 className="midtitle !text-text !font-bold mb-3">{section.title}</h2>
            <ul className="list-disc pl-5 space-y-2 text-breadcrumb">
              {section.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
    </div>
  </div>
  )
}

export default InstructorDetails