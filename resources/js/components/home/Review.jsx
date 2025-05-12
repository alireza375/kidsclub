import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import HeaderTitle from "../common/HeaderTitle";
import ReviewCard from "../card/ReviewCard";
import rshape1 from "../../../images/rshape1.png";
import rshape2 from "../../../images/rshape2.png";
import { columnFormatter } from "../../helpers/utils";
import { useFetch } from "../../helpers/hooks";
import { fetchPublicTestimonial } from "../../helpers/backend";
import { motion } from "framer-motion";
import { Autoplay, Pagination, Navigation,Keyboard } from 'swiper/modules';


const HeaderStyles = {
    titleS: "bg-[#FFE3AC]",
};

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Review = ({ testimonial_data }) => {
    const [data, getData] = useFetch(fetchPublicTestimonial);
    const borderColors = ["49D574", "FF6B6D", "5BA8FD"];
    const bgColors = ["#198038", "#B24344", "#366CA8"];

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="md:pt-[120px] pt-20 md:pb-[120px] pb-20 relative z-30"
        >
            <div className="custom-container mx-auto">
                <HeaderTitle
                    header={columnFormatter(testimonial_data?.title)}
                    title={columnFormatter(testimonial_data?.heading)}
                    center={true}
                    description={columnFormatter(testimonial_data?.description)}
                    styles={HeaderStyles}
                />
            </div>
            <img
                className="hidden 2.5xl:block absolute bottom-20 left-0"
                src={rshape1}
                alt=""
            />
            <img
                className="hidden 2.5xl:block absolute top-80 right-0"
                src={rshape2}
                alt=""
            />
            <div className="relative custom-container mt-20 review">
                <Swiper
                    spaceBetween={20}
                    slidesPerView={1}

                    pagination={{
                        clickable: true,
                        el: ".custom-pagination1",
                        bulletClass: "custom-bullet1",
                        bulletActiveClass: "custom-bullet-active1",
                    }}
                    keyboard={{ enabled: true }}
                    autoplay={{
                        delay: 3000, // Time between slide transitions in ms
                        disableOnInteraction: false, // Keeps autoplay active even after user interaction
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {data?.map((item, idx) => (
                        <SwiperSlide key={idx}>
                            <ReviewCard
                                data={item}
                                borderColor={
                                    borderColors[idx % borderColors.length]
                                }
                                bgColor={bgColors[idx % bgColors.length]}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="custom-pagination1 flex justify-center mt-4 gap-2"></div>
            </div>
        </motion.div>
    );
};

export default Review;
