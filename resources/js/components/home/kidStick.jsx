import React from "react";
import KidStickBg from "./../../../images/kidStickBg.png";
import BackgroundImage from "../common/BackgroundImage";
import { columnFormatter } from "../../helpers/utils";
import { useI18n } from "../../providers/i18n";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 


const slideInFromRight = {
    hidden: { opacity: 0, x: -100 }, 
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }, 
};

export default function KidStick({ joindata }) {
    const i18n = useI18n();
    const navigator = useNavigate();

    return (
        <div className="relative z-50">
            <BackgroundImage src={KidStickBg} alt={"KidStick Background"} />
            <div className=" h-auto lg:grid grid-cols-2 items-center block gap-[22px] relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={slideInFromRight}
                    className="h-full lg:flex hidden justify-end items-end w-full relative bottom-0"
                >
                    <img
                        src={
                            Array.isArray(joindata?.join_image)
                                ? joindata?.join_image[0]?.url
                                : joindata?.join_image
                        }
                        alt="KidStick Girl"
                        className="w-full"
                    />
                </motion.div>

                <div
  
                    className="mx-auto flex items-center xl:py-0 py-10 px-5 md:px-0"
                >
                    <div className="md:w-[70%] sm:w-[80%] w-[100%] text-white lg:space-y-8 space-y-5 mb-5">
                        <h1
                            className={`text-xl md:text-2xl lg:text-5xl  font-bold font-nunito !leading-[121%]`}
                        >
                            {columnFormatter(joindata?.heading)
                                .split(" ")
                                .slice(0, 10)
                                .join(" ")}{" "}
                            <span className="text-primary">
                                {columnFormatter(joindata?.heading)
                                    .split(" ")
                                    .slice(10)
                                    .join(" ")}
                            </span>
                        </h1>
                        <p
                            className="description"
                            dangerouslySetInnerHTML={{
                                __html: columnFormatter(joindata?.description),
                            }}
                        ></p>
                        <button
                            onClick={() => navigator("/about")}
                            className="kids-button whitespace-pre mb-6"
                        >
                            {i18n?.t("Read More")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
