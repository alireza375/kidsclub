import React from "react";
import HeaderTitle from "../common/HeaderTitle";
import BackgroundImage from "../common/BackgroundImage";
import ExploreBg from "./../../../images/galleryBg.png";
import Slider from "../common/Slider";
import ExploreItem from "./ExploreItem";
import { columnFormatter } from "../../helpers/utils";
import { publicGalleryList } from "../../helpers/backend";
import { useFetch } from "../../helpers/hooks";
import { motion } from "framer-motion"; // Import framer-motion
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const HeaderStyles = {
    titleS: "bg-[#fccdda]",
};

const styles = {
    root: "explore",
    pagination: {
        clickable: true,
        el: ".custom-pagination4",
        bulletClass: "custom-bullet4",
        bulletActiveClass: "custom-bullet-active4",
    },
    custom: "custom-pagination4",
};

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Explore({ gallerydata }) {
    const [gallery, getGallery] = useFetch(publicGalleryList, {});

    return (
        <div className="relative xl:mb-[80px] md:mb-[120px] mb-20">
            <BackgroundImage
                src={ExploreBg}
                alt={"Explore Background"}
                className={""}
            />
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
                className="custom-container mx-auto py-20"
            >
                <HeaderTitle
                    header={columnFormatter(gallerydata?.title)}
                    title={columnFormatter(gallerydata?.heading)}
                    link={"/gallery"}
                    styles={HeaderStyles}
                />
                <div className="lg:flex xl:gap-8 gap-5 lg:mt-14 mt-7 lg:mb-5">
                    <div className="lg:w-1/3 w-full">
                        <p
                            className="description text-[#2E3C63]"
                            dangerouslySetInnerHTML={{
                                __html: columnFormatter(
                                    gallerydata?.description
                                ),
                            }}
                        ></p>
                    </div>
                    <div className="lg:w-2/3 w-full lg:mt-0 mt-5">
                        <Slider
                            slidesPerView={1}
                            dataItems={gallery}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                                el: ".custom-pagination1",
                                bulletClass: "custom-bullet1",
                                bulletActiveClass: "custom-bullet-active1",
                            }}
                            keyboard={{ enabled: true }}
                            navigation={true}
                            modules={[Autoplay, Pagination, Navigation]}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                            }}
                            SliderItem={ExploreItem}
                            classNames={styles}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
