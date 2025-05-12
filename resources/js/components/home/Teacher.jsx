import React, { useEffect, useState } from 'react';
import HeaderTitle from '../common/HeaderTitle';
import TeacherBg from "../../../images/teacher-bg.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import TeacherItem from './TeacherItem';
import BackgroundImage from '../common/BackgroundImage';
import Slider from '../common/Slider';
import { columnFormatter } from '../../helpers/utils';
import { useFetch } from '../../helpers/hooks';
import { publicCoachList } from '../../helpers/backend';
import { motion } from 'framer-motion';

const HeaderStyles = {
    titleS: 'bg-[#FFE3AC]',
};

const styles = {
    root: 'teacher lg:mt-14 mt-5',
    pagination: {
        clickable: true,
        el: ".custom-pagination3",
        bulletClass: "custom-bullet3",
        bulletActiveClass: "custom-bullet-active3",
    },
    custom: 'custom-pagination3',
};

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Teacher({ teacherdata }) {
    const [data, getdata] = useFetch(publicCoachList);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getdata();
                setLoading(false);
            } catch (err) {
                setError('Failed to load teacher data');
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    

    if (loading) return <div className="text-center">Loading teachers...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className='relative z-50 md:my-[120px] my-20'
        >
            <BackgroundImage src={TeacherBg} alt={"Teacher Background"} />
            <div className='custom-container mx-auto pb-10 pt-[61px]'>
                <motion.div variants={fadeIn}>
                    <HeaderTitle 
                        header={columnFormatter(teacherdata?.title)}
                        title={columnFormatter(teacherdata?.heading)}
                        center={true}
                        description={columnFormatter(teacherdata?.description)}
                        styles={HeaderStyles} 
                    />
                </motion.div>
                <div>
                    <motion.div variants={fadeIn}>
                        <Slider
                            dataItems={data}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            SliderItem={TeacherItem}
                            classNames={styles}
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
