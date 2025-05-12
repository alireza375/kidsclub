import React, { useEffect, useState } from "react";
import Hero from "../components/home/Hero";
import ContactUs from "../components/home/ContactUs";
import Blog from "../components/home/blog";
import Services from "../components/home/Services";
import Question from "../components/home/Question";
import Review from "../components/home/Review";
import Teacher from "../components/home/Teacher";
import Service from "../components/home/Service";
import Event from "../components/home/Event";
import Explore from "../components/home/Explore";
import ImageGallery from "../components/home/ImageGallery";
import Number from "../components/home/Number";
import Chose from "../components/home/Chose";
import Adventure from "../components/home/Adventure";
import Price from "../components/home/Price";
import KidStick from "../components/home/kidStick";
import ShopSection from "../components/home/Shop";
import { useTitle } from "../helpers/hooks";
import { useSite } from "../context/site";
import Approach from "../components/home/Approach";


const Index = () => {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const {sitedata} = useSite();
    useTitle(`${sitedata?.title || "KidStick"} | Home`);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/page?slug=home`
                );
                const response = await res.json();
                const data = response?.data || null;
                setPage(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);





    return (
        <>
            <Hero herodata={page?.content?.hero_section} />
            <Services/>
            <ImageGallery />
            <Approach aboutdata={page?.content?.about_section} />
            <Number  />
            <Service  servicedata={page?.content?.service_section}/>
            <Chose chooseData={page?.content?.join_section} />
            <Event eventdata={page?.content?.event_section}/>
            <Adventure adventuredata={page?.content?.join_section2} />
            <Review testimonial_data={page?.content?.testimonial_section}/>
            <Question faqdata={page?.content} />
            <Teacher teacherdata={page?.content?.teacher_section}/>
            <KidStick joindata={page?.content?.join_section3} />
            <Price  pricingdata={page?.content?.pricing_section}/>
            <Explore  gallerydata={page?.content?.gallery_section}/>
            <ShopSection shopdata={page?.content?.shop_section}/>
            <Blog blogdata={page?.content?.blog_section}/>
            <ContactUs />
        </>
    );
};

export default Index;
