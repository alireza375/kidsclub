import React from "react";
import HeaderTitle from "../common/HeaderTitle";
import faqBg from "../../../images/faqBg.png";
import faqElement from "../../../images/faq_element.png";
import playStore from '../../../images/playstore.png'
import appStore from '../../../images/app-store.png'
import FAQ from "../common/FAQ";
import { Link } from "react-router-dom";
import { FaPhone } from "react-icons/fa";
import { StylesBorder } from "../../styles/styles";
import { columnFormatter } from "../../helpers/utils";
import { useI18n } from "../../providers/i18n";
import { RiContactsBook3Line } from "react-icons/ri";
import { useSite } from "../../context/site";
import { motion } from "framer-motion";

const HeaderStyles = {
    titleS: "bg-[#FCCDDA]",
};

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Question = ({faqdata}) => {
    const i18n = useI18n();
    const {sitedata} = useSite();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="relative  pt-16 pb-20 md:mb-[120px] mb-20 overflow-hidden"
            style={{
                backgroundImage: `url(${faqBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
        <div className="absolute hidden lg:block top-[50%]  transform -translate-y-1/2 -right-14">
            <img className="max-w-[400px] max-h-[400px]" src={faqElement} alt=""></img>
        </div>
            <div className="custom-container mx-auto">
                <HeaderTitle
                    header={columnFormatter(faqdata?.faq_section?.title)}
                    title={columnFormatter(faqdata?.faq_section?.heading)}
                    styles={HeaderStyles}
                />
            </div>
            <div className="custom-container flex flex-col lg:flex-row gap-3 lg:gap-4 xl:gap-6 mt-8 lg:mt-10 xl:mt-12 2xl:mt-14">
                <div className="w-full lg:w-1/2 xl:w-[70%]">
                    <FAQ />
                </div>
                <div className="w-full md:w-1/2 xl:w-[30%] mx-auto">
                    <div className="">
                        <div className="overflow-hidden space-y-4">
                            {/* Support Section */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                variants={fadeInUp}
                                style={StylesBorder("blue")}
                                className="space-y-2 bg-[#7BBFFF] rounded-3xl !px-[32px] !py-[20px]"
                            >
                                <div className="relative w-full flex flex-col items-center rounded-lg overflow-hidden">
                                    <img
                                        src={Array.isArray(faqdata?.faq_section?.faq_image1) ? faqdata?.faq_section?.faq_image1[0]?.url : faqdata?.faq_section?.faq_image1}
                                        alt="Support representative"
                                        className="object-fill"
                                    />
                                </div>
                                <div className="text-center space-y-2">
                                    <h2 className="header4 font-bold text-white">
                                        {i18n?.t('Need Support')}?
                                    </h2>
                                    <p className="text-white small">
                                        {i18n?.t('Contact support for assistance with enrollment or inquiries')}.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => window.location.href = '/contact'} className="bg-gray-900 text-white text-[15px] md:px-6 px-2 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                                        <RiContactsBook3Line />
                                        {i18n?.t('Contact Us')}
                                    </button>
                                    <button onClick={() => window.location.href = 'tel:' + sitedata?.phone} className="bg-purple-600 text-white text-[15px] md:px-6 px-2 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors">
                                        <FaPhone />
                                        {i18n?.t('Call Us')}
                                    </button>
                                </div>
                            </motion.div>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                variants={fadeInUp}
                                style={StylesBorder("black")}
                                className="bg-red-600 !px-[24px] !pt-[12px] !pb-[10px] text-white rounded-3xl"
                            >
                                <div className="text-center mb-4">
                                    <h3 className="header4">
                                        {i18n?.t('Download Our App')}
                                    </h3>
                                    <p className="small">
                                        {i18n?.t('Download the KidStick app for schedules, updates and more')}.
                                    </p>
                                </div>

                                <div className="flex justify-center gap-4">
                                    <Link
                                        to={faqdata?.google_play_url}
                                        className="block"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={playStore}
                                            alt="Get it on Google Play"
                                            width={135}
                                            height={40}
                                            className="h-10 w-auto"
                                        />
                                    </Link>
                                    <Link
                                        to={faqdata?.google_play_url}
                                        className="block"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={appStore}
                                            alt="Download on the App Store"
                                            width={135}
                                            height={40}
                                            className="h-10 w-auto"
                                        />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default Question;
