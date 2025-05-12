import React, { useEffect, useState } from 'react'
import KidPainting2 from "./../../../images/kid-painting2 (1).svg"
import ContactForm from './ContactForm'
import HeaderTitle from '../common/HeaderTitle'
import ContactBg from "./../../../images/contactBg.png";
import BackgroundImage from '../common/BackgroundImage'
import { columnFormatter } from '../../helpers/utils';
import { motion } from 'framer-motion';
import { Skeleton } from 'antd';

const HeaderStyles = {
    titleS: 'bg-[#FFE3AC]'
}

export default function ContactUs() {
    const [contactPage, setContactPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/page?slug=contact`);
                const response = await res.json();
                const data = response?.data || null;
                setContactPage(data);
            } catch (error) {
                setError("Failed to fetch data.");
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Loading state
    if (loading) {
        return <div className='custom-container my-20'><Skeleton/></div>;
    }

    // Error state
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="relative z-50 md:mb-[120px] mb-20">
            <BackgroundImage src={ContactBg} alt={"Contact Background"} />
            <div className="custom-container section-padding">
                <div className="flex 1xl:gap-0 gap-5">
                    {/* Image Section with animation */}
                    <motion.div 
                        className="lg:w-1/2 lg:flex hidden flex-col justify-start 2xl:gap-y-12 1xl:gap-y-5 gap-10"
                        initial={{ opacity: 0, x: -100 }} // Initial state
                        animate={{ opacity: 1, x: 0 }} // Final state
                        transition={{ duration: 0.8 }} // Animation duration
                    >
                        <img
                            src={Array.isArray(contactPage?.content?.contact_image1) ? contactPage?.content?.contact_image1[0]?.url : contactPage?.content?.contact_image1}
                            alt="Contact Image 1"
                            className="xl:w-[90%] xl:h-[100%] 2xl:-ml-[33%] 3xl:-ml-[45%] 1xl:-ml-5 z-10 rounded-[25px]"
                        />
                        <img
                            src={Array.isArray(contactPage?.content?.contact_image2) ? contactPage?.content?.contact_image2[0]?.url : contactPage?.content?.contact_image2}
                            alt="Contact Image 2"
                            className="xl:w-[90%] xl:h-[100%] 2xl:-ml-10 xl:ml-10 z-10 rounded-[25px]"
                        />
                    </motion.div>

                    {/* Contact Info Section with animation */}
                    <motion.div 
                        className="lg:w-1/2 w-full 1xl:space-y-12 space-y-7"
                        initial={{ opacity: 0, y: 50 }} // Initial state
                        animate={{ opacity: 1, y: 0 }} // Final state
                        transition={{ duration: 0.8, delay: 0.3 }} // Animation duration and delay
                    >
                        <HeaderTitle
                            header={columnFormatter(contactPage?.content?.contact_section?.title)}
                            title={columnFormatter(contactPage?.content?.contact_section?.heading)}
                            styles={HeaderStyles}
                            description={columnFormatter(contactPage?.content?.contact_section?.description)}
                            contact
                        />

                        <ContactForm />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
