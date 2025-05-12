import React, { useEffect, useRef, useState } from "react";
import circle from "./../../../images/circle1.png";
import designDots from "./../../../images/shape1.png";
import GalleryCard from "../card/GalleryCard";
import { useFetch } from "../../helpers/hooks";
import { fetchPublicServices } from "../../helpers/backend";
import { columnFormatter } from "../../helpers/utils";
import Slider from "../common/Slider";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const colors = ["49D574", "71D4E9", "FDBA21", "4CAF50"];

const Services = () => {
    const [services] = useFetch(fetchPublicServices, { limit: 9 });
    const swiperRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleSlideChange = (swiper) => {
        setCurrentSlide(swiper.snapIndex);
    };

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.update();
        }
    }, []);

    const goNext = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };

    const goPrev = () => {

        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    const navigateComponent = () => {
        return (
            <div
                className={`${
                    services?.docs?.length <= 4 || services?.docs.length === 0
                        ? services?.docs?.length <= 2
                            ? "md:hidden"
                            : "md:flex lg:hidden "
                        : "md:flex hidden"
                }text-[18px] font-bold  absolute inset-0 2xl:left-[-2.5rem] hidden md:flex justify-between items-center z-20 2xl:w-[106%] w-full`}
            >
                <button
                    onClick={goPrev}
                    className={`box-shadow flex h-[70px] w-[30px] border-[#FF6B6D] border items-center justify-center rounded-full text-[#5BA8FD]  duration-500 hover:bg-[#FF6B6D] hover:text-[#5BA8FD] ${
                        currentSlide === 0
                            ? "bg-[#FF6B6D] text-[#5BA8FD]"
                            : "bg-white text-[#5BA8FD]"
                    }`}
                >
                    <MdKeyboardArrowLeft size={30} />
                </button>
                <button
                    onClick={goNext}
                    className={`box-shadow flex h-[70px] w-[30px] border-[#FF6B6D] border  items-center justify-center rounded-full text-[#5BA8FD]  duration-500 hover:bg-[#FF6B6D] hover:text-[#5BA8FD] ${
                        currentSlide === 1
                            ? "bg-[#FF6B6D] text-[#5BA8FD]"
                            : "bg-white text-[#5BA8FD]"
                    }`}
                >
                    <MdKeyboardArrowRight className="text-[18px] font-bold" />
                </button>
            </div>
        );
    };

    return (
        <div>
            {services?.docs?.length > 0 && (
                <section className="relative mt-16 md:mt-20 lg:mt-24 xl:mt-28 flex justify-center items-center">
                    <img
                        className="absolute hidden 2xl:block bottom-10 left-6"
                        src={circle}
                        alt="circle"
                    />
                    <div className="custom-container w-full max-w-screen-xl px-4 md:px-6">
                        <div className="">
                            <Slider
                                swiperRef={swiperRef} // Pass swiperRef as prop
                                onSlideChange={handleSlideChange}
                                dataItems={services}
                                SliderItem={GalleryCardItem}
                                component={navigateComponent}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 1,
                                        spaceBetween: 20,
                                    },
                                    768: {
                                        slidesPerView: 2,
                                        spaceBetween: 30,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        spaceBetween: 40,
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <img
                        className="absolute hidden 2xl:block bottom-0 right-0"
                        src={designDots}
                        alt="designDots"
                    />
                </section>
            )}
        </div>
    );
};

export default Services;

export const GalleryCardItem = ({ data, index }) => {
    return (
        <GalleryCard
            key={data?.id}
            heading={columnFormatter(data?.name)}
            bg={"#" + colors[index % colors.length]}
            border={colors[index % colors.length]}
            image={data?.image}
            id={data?.id}
        />
    );
};
