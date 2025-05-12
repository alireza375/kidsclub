import React, { useEffect, useState } from "react";
import AboutHero from "../components/about/aboutHero";
import Mission from "../components/about/mission";
import Review from "../components/home/Review";
import Event from "../components/home/Event";
import Price from "../components/home/Price";
import ContactUs from "../components/home/ContactUs";
import { PageHeader } from "../components/common/upperSection";
import Number from "../components/home/Number";
import { useTitle } from "../helpers/hooks";
import { useSite } from "../context/site";
import { Skeleton } from "antd";

const About = () => {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/page?slug=about`
                );
                const response = await res.json();
                const data = response?.data || null;
                setLoading(false);
                setPage(data);
            } catch (error) {
                setLoading(false);

                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const [homePage, sethomePage] = useState(null);
    const { sitedata } = useSite();
    useTitle(`${sitedata?.title || "KidStick"} | About`);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/page?slug=home`
                );
                const response = await res.json();
                const data = response?.data || null;
                setLoading(false);
                sethomePage(data);
            } catch (error) {
                setLoading(false);

                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    return (
        <div>
            <PageHeader title="About Us" />
            {loading ? (
                <div className="lg:my-[120px] my-16 custom-container">
                <Skeleton active paragraph={{ rows: 6 }} />
                </div>
            ) : (
                <>
                    <AboutHero aboutdata={page?.content?.about_page} />
                    <Mission missionData={page?.content?.about_page} />
                    <Review
                        testimonial_data={
                            homePage?.content?.testimonial_section
                        }
                    />
                    <Number />
                    <Event eventdata={homePage?.content?.event_section} />
                    <ContactUs />
                    <Price pricingdata={homePage?.content?.pricing_section} />
                </>
            )}
        </div>
    );
};

export default About;
