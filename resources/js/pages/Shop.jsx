import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ShopSection from '../components/home/Shop'
import MoreProduct from '../components/common/MoreProduct'
import ContactUs from '../components/home/ContactUs'
import { PageHeader } from '../components/common/upperSection'
import { useSite } from '../context/site'
import { useTitle } from '../helpers/hooks'

export default function Shop() {
    const path = useLocation();
    const [contactPage, setContactPage] = useState(null);
 const {sitedata} = useSite();
  useTitle(`${sitedata?.title || "KidStick"} | Shop`);
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const res = await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/page?slug=contact`
                    );
                    const response = await res.json();
                    const data = response?.data || null;
                    setContactPage(data);
                } catch (error) {
                    console.error("Failed to fetch data:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, []);
  return (
    <div>
      <PageHeader title="Product" />

          <ShopSection path={"shop"}/>

          <ContactUs contact_data={contactPage?.content}/>
    </div>
  )
}
