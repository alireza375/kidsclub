import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import bg from "../../../images/numberBg.png";
import { useI18n } from "../../providers/i18n";

const Number = () => {
    const i18n = useI18n();
    const [page, setPage] = useState(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Ref and InView Hook
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, threshold: 0.2 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/page?slug=overview`
                );
                const response = await res.json();
                const data = response?.data || null;
                setPage(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Animation Variants
    const numberVariant = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1 },
    };

    const textVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div
            ref={sectionRef}
            className="flex items-center justify-center bg-cover md:h-[40vh] bg-[#FFF1F1] -mt-3 md:pb-0 pb-20 md:pt-0 pt-10"
            style={{ backgroundImage: isSmallScreen ? "none" : `url(${bg})` }}
        >
            <div className="container grid grid-cols-2 gap-6 md:grid-cols-4 justify-stretch md:gap-0 sm:gap-20 last:text-center">
                {["services", "teachers", "students", "experience"].map(
                    (key, index) => (
                        <motion.div
                            key={key}
                            className="text-[#0C1A40]"
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            variants={numberVariant}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <motion.h1
                                className="heading3"
                                variants={numberVariant}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                {page?.content?.[key] ? page?.content?.[key] > 99 ? "99+" : page?.content?.[key] : 0}
                            </motion.h1>
                            <motion.p
                                className="description !font-bold"
                                variants={textVariant}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                {i18n?.t(
                                    key === "services"
                                        ? "Total Services"
                                        : key === "teachers"
                                        ? "Qualified Teachers"
                                        : key === "students"
                                        ? "Students Enrolled"
                                        : "Years of Experience"
                                )}
                            </motion.p>
                        </motion.div>
                    )
                )}
            </div>
        </div>
    );
};

export default Number;
