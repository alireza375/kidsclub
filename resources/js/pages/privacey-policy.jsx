import React from 'react'
import { Skeleton } from "antd";
import { PageHeader } from "../components/common/upperSection";
import { useEffect, useState } from "react";
import { columnFormatter } from "../helpers/utils";
import { useSite } from '../context/site';
import { useTitle } from '../helpers/hooks';

const PrivacyPolicy = () => {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(false);
    const {sitedata} = useSite();
    useTitle(`${sitedata?.title || "KidStick"} | Privacy Policy`);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/page?slug=privacy_policy`
                );
                const response = await res.json();
                const data = response?.data || null;
                setLoading(false);
                setPage(data);
            } catch (error) {
                setLoading(false);

                console.error("Failed to fetch data:", error);
            } finally {
                //setLoading(false); // Stop loading after fetching data
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    return (
        <div >
            <PageHeader title="Privacy Policy" />{" "}
            <div className='lg:my-[120px] my-16 custom-container'>
            {loading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
                <div
                    dangerouslySetInnerHTML={{
                        __html: columnFormatter(page?.content),
                    }}
                ></div>
            )}
        </div>
        </div>
    );
};

export default PrivacyPolicy;
