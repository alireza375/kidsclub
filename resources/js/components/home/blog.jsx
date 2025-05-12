import React from 'react'
import HeaderTitle from '../common/HeaderTitle'
import BlogBg from './../../../images/blogBg.png'
import BackgroundImage from '../common/BackgroundImage'
import { columnFormatter } from '../../helpers/utils'
import { useFetch } from '../../helpers/hooks'
import { fetchPublicBlogs } from '../../helpers/backend'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../providers/i18n'
import { motion } from 'framer-motion' // Import framer-motion

const HeaderStyles = {
  header: '',
  titleS: 'bg-red-300',
}

export default function Blog({ blogdata }) {
  const [blog, getBlog] = useFetch(fetchPublicBlogs)
  const i18n = useI18n()
  const navigate = useNavigate()

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
      className="relative z-30 md:mb-[120px] mb-20"
    >
      <BackgroundImage src={BlogBg} alt={'Blog Background'} />
      <div className="custom-container section-padding">
        <HeaderTitle
          header={columnFormatter(blogdata?.title)}
          title={columnFormatter(blogdata?.heading)}
          link={'/blog'}
          description={''}
          styles={HeaderStyles}
        />
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-14">
          {blog?.docs?.slice(0, 4)?.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="sm:flex lg:h-[300px] border-dashed border-primary overflow-hidden border-[2px] rounded-[25px] h-max"
            >
              <div className="sm:w-1/2 lg:h-[300px] h-[200px] overflow-hidden">
                <img
                  src={item?.image}
                  alt={columnFormatter(item?.title)}
                  className="!h-full object-cover sm:rounded-none rounded-[25px] w-full "
                />
              </div>
              <div className="p-3 sm:w-1/2 flex flex-col justify-between bg-white rounded-r-3xl sm:rounded-bl-none rounded-bl-3xl">
                <h3 className="lg:text-2xl line-clamp-2 text-xl font-nunito font-bold text-secondary">
                  {columnFormatter(item.title)}
                </h3>
                <p className="line-clamp-4 font-poppins text-[#2E3C63]">{columnFormatter(item.short_description)}</p>
                <div>
                  <button
                    className="kids-button"
                    onClick={() => {
                      navigate(`/blog/${item?.id}`)
                    }}
                  >
                    {i18n?.t('Read More')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
