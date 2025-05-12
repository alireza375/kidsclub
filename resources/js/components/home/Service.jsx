import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import HeaderTitle from "../common/HeaderTitle";
import ServiceCard from "../card/ServiceCard";
import { columnFormatter } from "../../helpers/utils";
import { useFetch } from "../../helpers/hooks";
import { fetchPublicServices } from "../../helpers/backend";

const HeaderStyles = {
    titleS: "bg-[#FCCDDA]",
};

const Service = ({ servicedata }) => {
    const [data, getData] = useFetch(fetchPublicServices, {limit : 6});

    // Ref and InView hook for the section
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, threshold: 0.2 });

    // Animation Variants
    const sectionVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    const cardVariant = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
    };

    return (
        <div
            ref={sectionRef}
            className="md:pt-[120px] pt-20 md:pb-[120px] pb-20 relative z-30"
        >
            <motion.div
                className="custom-container mx-auto"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={sectionVariant}
                transition={{ duration: 1 }}
            >
                <HeaderTitle
                    header={columnFormatter(servicedata?.title)}
                    title={columnFormatter(servicedata?.heading)}
                    link={"/service"}
                    button={true}
                    styles={HeaderStyles}
                />
            </motion.div>

            {/* Section with Background */}
            <div className="bg-cover bg-center">
                <motion.div
                    className="inset-0 custom-container mt-20 flex items-start justify-center"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={sectionVariant}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
                        {data?.docs.map((data, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                variants={cardVariant}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.2,
                                }}
                            >
                                <ServiceCard data={data} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Service;
