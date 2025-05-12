import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Slider({swiperRef, dataItems, breakpoints, SliderItem, classNames, onSlideChange, component }) {
  return (
      <div className={`${classNames?.root} relative w-full`}>
          <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={classNames?.pagination}
              breakpoints={breakpoints}
              onSlideChange={(swiper) => onSlideChange(swiper)}
          >

              {dataItems?.docs?.map((data, index) => (
                  <SwiperSlide key={data?.id}>
                      <SliderItem data={data} index={index}/>
                  </SwiperSlide>
              ))}

          </Swiper>
          {component && component()}

          <div className={`${classNames?.custom} flex justify-center mt-4 gap-2`}></div>
      </div>
  )
}
