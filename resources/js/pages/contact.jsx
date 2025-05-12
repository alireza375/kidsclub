import React, { useEffect, useState } from 'react';
import ContactUs from '../components/home/ContactUs';
import { PageHeader } from '../components/common/upperSection';
import { useSite } from '../context/site';
import { useTitle } from '../helpers/hooks';

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [contactPage,setContactPage]=useState(null);
  useEffect(() => {
         const fetchData = async () => {
             setLoading(true);
             try {
                 const res = await fetch(
                     `${import.meta.env.VITE_BACKEND_URL}/page?slug=contact`
                 );
                 const response = await res.json();
                 const data = response?.data || null;
                 setLoading(false);
                 setContactPage(data);
             } catch (error) {
                 setLoading(false);

                 console.error("Failed to fetch data:", error);
             } finally {
                 setLoading(false);
             }
         };

         fetchData();
     }, []);
     const {sitedata} = useSite();
     useTitle(`${sitedata?.title || "KidStick"} | Contact`)
    return (
        <div>
            <PageHeader title="Contact" />{" "}
            <ContactUs contact_data={contactPage?.content}/>
        </div>
    );
};

export default Contact;
