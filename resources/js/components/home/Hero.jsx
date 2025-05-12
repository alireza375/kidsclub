import React from "react";
import welcomeBg from "../../../images/welcomeBg.png";
import { columnFormatter } from "../../helpers/utils";
import { useI18n } from "../../providers/i18n";
import { useNavigate } from "react-router-dom";
import { stripHtml } from "string-strip-html";
import { motion } from "framer-motion";

const Hero = ({ herodata }) => {
    const i18n = useI18n();
    const navigate = useNavigate();
    const formattedDescription = columnFormatter(herodata?.description);
    const plainText = stripHtml(formattedDescription).result;
    const truncatedText =
        plainText.length > 209 ? `${plainText.slice(0, 209)}...` : plainText;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="bg-[#FFFDF5] relative"
        >
            <section
                className="relative bg-cover bg-center md:min-h-[90vh] sm:min-h-[50vh] min-h-[60vh] w-full mt-4"
                style={{
                    backgroundImage: `url(${
                        Array.isArray(herodata?.hero_section_image_banner)
                            ? herodata?.hero_section_image_banner[0]?.url
                            : herodata?.hero_section_image_banner
                    })`,
                }}
            >
                {/* Animated Image */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5 }}
                    className="hidden md:absolute md:block bottom-0 right-0 -z-0"
                >
                    {herodata?.hero_section_image_group && (
                        <img
                            className="w-full h-full object-fill 2xl:pe-[25px]"
                            src={
                                Array.isArray(
                                    herodata?.hero_section_image_group
                                )
                                    ? herodata?.hero_section_image_group[0]?.url
                                    : herodata?.hero_section_image_group
                            }
                            alt="Welcome Background"
                        />
                    )}
                </motion.div>

                {/* Animated Content */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="custom-container pt-5 md:pt-12 lg:pt-16 xl:pt-20 2xl:pt-32 md:basis-1/2 relative z-10"
                >
                    <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="w-[230px] md:w-[220px] lg:w-[250px] xl:w-[270px] 2xl:w-[292px]"
                        src={welcomeBg}
                        alt="Welcome Background"
                    />
                    <h1 className="heading2 text-[#373737] ml-2 md:ml-3 lg:ml-4 xl:ml-5 -mt-8 lg:-mt-9 xl:-mt-10">
                        {columnFormatter(herodata?.welcome_text)}
                    </h1>
                    <h1 className="hero-heading md:mt-12 mt-8 text-[#0C1A40]">
                        {columnFormatter(herodata?.heading)
                            .split(" ")
                            .slice(0, 3)
                            .join(" ")}{" "}
                        <br className="hidden md:block" />
                        {columnFormatter(herodata?.heading)
                            .split(" ")
                            .slice(3)
                            .join(" ")}{" "}
                    </h1>
                    <p
                        className="description mt-5 text-[#2E3C63] md:max-w-[375px] lg:max-w-[450px] xl:max-w-[624px]"
                        dangerouslySetInnerHTML={{ __html: truncatedText }}
                    ></p>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        onClick={() => navigate("/service")}
                        className="kids-button lg:mt-10 md:mt-8 mt-5"
                    >
                        {i18n.t("Find Out More")}
                    </motion.button>
                </motion.div>
            </section>
        </motion.div>
    );
};

export default Hero;
