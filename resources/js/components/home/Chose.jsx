import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { columnFormatter } from "../../helpers/utils";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../providers/i18n";

const Chose = ({ chooseData }) => {
    const i18n = useI18n();
    const heading = columnFormatter(chooseData?.heading);
    const firstWord = heading.split(" ")[0];
    const lastWord = heading.split(" ").slice(-1)[0];
    const styledHeading = `<span class="text-primary ">${firstWord}</span> <span class="text-black">${heading.slice(firstWord.length, -lastWord.length)}</span> <span class="text-primary ms-2">${lastWord}</span>`;
    const navigator = useNavigate();

    // Ref and InView hook for animation trigger
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, threshold: 0.2 });

    // Animation Variants
    const containerVariant = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } },
    };

    const textVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.2 } },
    };

    return (
        <motion.div
            ref={sectionRef}
            className="relative bg-cover bg-center"
            style={{
                backgroundImage: `url(${
                    Array.isArray(chooseData?.join_banner)
                        ? chooseData?.join_banner[0]?.url
                        : chooseData?.join_banner
                })`,
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariant}
        >
            <div className="absolute inset-0 bg-[#D9D9D9] bg-opacity-80"></div>{" "}
            {/* Background color with opacity */}
            <div className="flex items-center justify-center h-full relative">
                <div className="custom-container py-10 flex items-center flex-col md:flex-row gap-6">
                    <motion.div
                        className="w-full md:w-[50%]"
                        variants={textVariant}
                    >
                        <h1
                            className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[60px] font-bold font-nunito !leading-[121%] md:text-right text-center  "
                            dangerouslySetInnerHTML={{
                                __html: styledHeading,
                            }}
                        ></h1>
                    </motion.div>

                    <motion.div
                        className="md:pl-6 w-full md:w-[50%] max-w-[565px] md:border-l-[3px] border-[#49D574] border-dashed"
                        variants={textVariant}
                    >
                        <p
                            className="description"
                            dangerouslySetInnerHTML={{
                                __html: columnFormatter(chooseData?.description),
                            }}
                        ></p>

                        <motion.button
                            onClick={() => {
                                navigator("/package");
                            }}
                            className="kids-button mt-10"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {i18n.t("Join Now")}
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Chose;
