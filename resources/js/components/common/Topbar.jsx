import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa'
import { IoCall } from 'react-icons/io5'
import { MdOutlineEmail } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useSite } from '../../context/site'
import { useI18n } from '../../providers/i18n'


const Topbar = () => {
  const i18n = useI18n();
  const {sitedata} = useSite();
  return (
    <div className='bg-navbar bg-opacity-50 border-b-[1px] lg:block hidden border-white py-3 font-nunito'>
      <div className='flex items-center justify-between custom-container'>
        <div className='flex gap-5 lg:gap-10'>
          <div className='flex items-center gap-2'>
            <MdOutlineEmail className='text-2xl text-white' />
            <p><span className='font-bold text-[12px] uppercase text-[#373737]'>{i18n?.t("Email us")} :</span> <a href={`mailto:${sitedata?.email}`} className='text-[15px] text-[#343839] opacity-70'>{sitedata?.email}</a></p>
          </div>
          <div className='flex items-center gap-2'>
            <IoCall className='text-2xl text-white' />
            <p><span className='font-bold text-[12px] uppercase text-[#373737]'>{i18n?.t("Call us")} :</span> <a href={`tel:${sitedata?.phone}`} className='text-[15px] text-[#343839] opacity-70'>{sitedata?.phone}</a></p>
          </div>
        </div>
        <div className='flex items-center gap-5 lg:gap-10'>
          <p className='font-normal opacity-70' >{i18n?.t("Visit us on social networks")}</p>
          <div className='flex gap-2'>
            <Link to={sitedata?.facebook} className={' bg-[#5BA8FD] text-white rounded-full p-2'}><FaFacebookF /></Link>
            <Link to={sitedata?.instagram} className={' bg-[#60E188] text-white rounded-full p-2'} ><FaInstagram /></Link>
            <Link to={sitedata?.twitter} className={' bg-[#FDB157] text-white rounded-full p-2'} ><FaTwitter /></Link>
            <Link to={sitedata?.linkedin} className={' bg-[#FF6B6D] text-white rounded-full p-2'} ><FaLinkedinIn /></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar


