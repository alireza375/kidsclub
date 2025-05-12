import React from "react";
import HeaderTitle from "../common/HeaderTitle";
import BackgroundImage from "../common/BackgroundImage";
import ApproachBg from "./../../../images/Approach.png";
import Cow from "./../../../images/cow.png";
import AppElement from "./../../../images/app-element.png";
import Rocket from "./../../../images/line-rocket.png";
import startgreen from "./../../../images/star_green.png";
import startvector from "./../../../images/star_vector.png";
import AppElement2 from "./../../../images/app-ele2.png";
import { columnFormatter } from "../../helpers/utils";
import { StylesBorder2 } from "../../styles/styles";
import { Link } from "react-router-dom";
import { useI18n } from "../../providers/i18n";
import { motion } from "framer-motion";

const HeaderStyles = {
    titleS: "bg-[#FCCDDA]",
    title1S: "bg-[#FFE3AC]",
};

export default function Approach({ aboutdata }) {
    const i18n = useI18n();

    // Animation Variants
    const imageVariant = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
    };

    const textVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    const buttonVariant = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
    };

    return (
        <motion.div
            className="relative z-30 lg:mt-[120px] mt-10 overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <BackgroundImage src={ApproachBg} alt={"Approach Background"} />
            <div className="absolute xl:block hidden -right-7 bottom-0 -z-30">
                <img
                    src={AppElement}
                    alt="App Element"
                    className=""
                />
            </div>
           
            <div className="custom-container mx-auto grid lg:grid-cols-2 lg:gap-8 lg:gap-y-0 gap-y-5 xl:py-[176px] lg:py-14 md:py-28 pb-10">
                {/* Image Section */}
                <motion.div
                    className="h-auto relative lg:order-1 order-2"
                    variants={imageVariant}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <img
                        src={
                            Array?.isArray(aboutdata?.about_image)
                                ? aboutdata?.about_image[0]?.url
                                : aboutdata?.about_image
                        }
                        alt="Approach"
                        className="z-50 h-full rounded-3xl"
                    />
                    <div
                        className="xl:w-[500px] w-[400px] h-full absolute lg:block hidden -top-5 -left-5 -z-10"
                        style={StylesBorder2("FE5C45", 30, 4)}
                    ></div>
                    <div className="absolute -top-[105px] lg:block hidden -left-2">
                        <img src={Cow} alt="cow" />
                    </div>
                    <div className="absolute lg:block hidden -top-[135px] -right-[140px] -z-20">
                        <img src={Rocket} alt="cow" />
                    </div>
                    <div className="absolute lg:block hidden -top-[60px] right-20 -z-20">
                        <img src={startgreen} alt="" />
                    </div>
                </motion.div>

                {/* Text Section */}
                <motion.div
                    className="1xl:space-y-10 space-y-5 lg:order-2 order-1 relative z-10"
                    variants={textVariant}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <HeaderTitle
                        header={columnFormatter(aboutdata?.title)}
                        title={columnFormatter(aboutdata?.heading)
                            .split(" ")
                            .slice(0, 1)
                            .join(" ")}
                        title1={columnFormatter(aboutdata?.heading)
                            .split(" ")
                            .slice(1)
                            .join(" ")}
                        description={columnFormatter(aboutdata?.description)}
                        styles={HeaderStyles}
                    />
                    {/* Button with animation */}
                    <motion.div
                        variants={buttonVariant}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        <Link to={"/service"} className="kids-button">
                            {i18n?.t("Read More")}
                        </Link>
                    </motion.div>
                    <div className="absolute lg:block hidden -top-[30%] left-[50%] transform translate-x-[-50%] -z-20">
                        <img src={startvector} alt="start" />
                    </div>
                    <div className="absolute lg:block hidden top-0 right-0 -z-20">
                        <img src={AppElement2} alt="start" />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
