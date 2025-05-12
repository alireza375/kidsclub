import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import HeaderTitle from "../common/HeaderTitle";
import EventCard from "../card/EventCard";
import eventBg from "../../../images/eventBg.png";
import eshape1 from "../../../images/eshape2.png";
import eshape2 from "../../../images/eshape3.png";
import clock from "../../../images/clock.png";
import { columnFormatter } from "../../helpers/utils";
import { useFetch } from "../../helpers/hooks";
import { fetchPublicEvents } from "../../helpers/backend";
import { useI18n } from "../../providers/i18n";

const HeaderStyles = {
    titleS: "bg-[#FCCDDA]",
};

const Event = ({ eventdata }) => {
    const [events, getEvent] = useFetch(fetchPublicEvents);
    const i18n = useI18n();
    const borderColors = ["49D574", "FDB157", "FF6B6D"];

    // Ref and InView hook
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, threshold: 0.2 });

    // Animation Variants
    const containerVariant = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } },
    };

    const slideVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.2, duration: 0.8 },
        }),
    };

    const imageVariant = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
    };

    return (
        <motion.section
            ref={sectionRef}
            className="bg-cover bg-center mt-16 lg:mt-20 xl:mt-24 2xl:mt-28 pt-20 lg:pt-24 xl:pt-32 2xl:pt-40"
            style={{ backgroundImage: `url(${eventBg})` }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariant}
        >
            <div className="pt-16 pb-20 relative z-30">
                <div className="custom-container mx-auto">
                    <HeaderTitle
                        header={columnFormatter(eventdata?.title)}
                        title={columnFormatter(eventdata?.heading)}
                        center={true}
                        styles={HeaderStyles}
                    />
                </div>

                <div className="relative mt-6 lg:mt-8 xl:mt-10 2xl:mt-14">
                    <div className="relative z-50 custom-container event">
                        <Swiper
                            modules={[Pagination, Keyboard]}
                            spaceBetween={20}
                            slidesPerView={1}
                            pagination={{
                                clickable: true,
                                el: ".custom-pagination",
                                bulletClass: "custom-bullet",
                                bulletActiveClass: "custom-bullet-active",
                            }}
                            keyboard={{ enabled: true }}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                        >
                            {events?.docs?.map((item, idx) => (
                                <SwiperSlide key={idx}>
                                    <motion.div
                                        custom={idx}
                                        variants={slideVariant}
                                    >
                                        <EventCard
                                            borderColor={
                                                borderColors[
                                                    idx % borderColors.length
                                                ]
                                            }
                                            data={item}
                                            i18n={i18n}
                                        />
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="custom-pagination flex justify-center mt-4 gap-2"></div>
                    </div>

                    {/* Decorative Images */}
                    <motion.img
                        src={clock}
                        className="hidden z-10 2.5xl:block absolute -top-64 right-0"
                        alt="event shape"
                        variants={imageVariant}
                    />
                    <motion.img
                        src={eshape1}
                        className="hidden z-10 2.5xl:block absolute -top-24 left-48"
                        alt="event shape"
                        variants={imageVariant}
                    />
                    <motion.img
                        src={eshape2}
                        className="hidden 2.5xl:block absolute bottom-4 right-36"
                        alt="event shape"
                        variants={imageVariant}
                    />
                </div>
            </div>
        </motion.section>
    );
};

export default Event;
