import React, { useRef } from "react";
import ashape from "../../../images/ashape.png";
import star from "../../../images/star.png";
import adventureBg from "../../../images/adventureBg.png";
import ashape2 from "../../../images/ashape2.png";
import { columnFormatter } from "../../helpers/utils";
import { stripHtml } from "string-strip-html";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../providers/i18n";
import { motion, useInView } from "framer-motion";

const Adventure = ({ adventuredata }) => {
    const formattedDescription = columnFormatter(adventuredata?.description);
    const navigator = useNavigate();
    const plainText = stripHtml(formattedDescription).result;
    const i18n = useI18n();
    const truncatedText =
        plainText.length > 386
            ? `${plainText.slice(0, 386)}...`
            : plainText;

    // Ref for the section and in-view trigger
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true });

    return (
        <div
            ref={sectionRef}
            className="relative bg-cover bg-center md:mt-[120px] mt-20 bg-[#3E718C]"
        >
            <img className="absolute w-full bottom-0 z-20" src={ashape2} alt="" />
            <img className="absolute hidden 2xl:block top-0 right-0 w-[100px] 2.5xl:w-[150px] 3xl:w-[250px]" src={star} alt="" />
            <img className="absolute hidden 2xl:block bottom-0 right-0 w-[250px] 2.5xl:w-[370px] 3xl:w-[400px]" src={ashape} alt="" />

            <div className="flex flex-col lg:flex-row items-center h-full">
                <div className="w-full h-full lg:w-1/2 relative z-10 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.5 }}
                        className="relative top-0 h-full"
                    >                        <img
                            className="w-full h-full object-cover relative z-[9]"
                            src={
                                Array.isArray(adventuredata?.join_image)
                                    ? adventuredata?.join_image[0]?.url
                                    : adventuredata?.join_image
                            }
                            alt="adventureImage"
                        />
                    </motion.div>
                </div>
                <div className="w-full lg:w-1/2 py-6 lg:py-8 xl:py-10 lg:p-0 p-4 lg:ml-12 xl:ml-16 2xl:ml-20 text-white">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="w-full xl:max-w-[600px]"
                    >
                        <p className="description !font-bold">
                            {columnFormatter(adventuredata?.welcome_text)}
                        </p>
                        <h2 className="mt-3 lg:mt-5 w-full heading3">
                            {columnFormatter(adventuredata?.heading).split(" ").slice(0, 5).join(" ")}{" "}
                            <span className="text-primary w-full ">
                                {columnFormatter(adventuredata?.heading).split(" ").slice(5).join(" ")}
                            </span>
                        </h2>
                        <p
                            className="description mt-4 w-full lg:mt-5 xl:mt-6 text-wrap pe-2  !h-auto"
                            dangerouslySetInnerHTML={{ __html: truncatedText }}
                        ></p>
                        <button onClick={() => navigator("/service")} className="kids-button md:mt-[24px] mt-3">
                            {i18n?.t("Join Now")}
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Adventure;
