import React, { useEffect, useState } from 'react'
import { PageHeader } from '../components/common/upperSection'
import ContactUs from '../components/home/ContactUs'
import Price from '../components/home/Price'
import Services from '../components/service/services'
import { useSite } from '../context/site'
import { useTitle } from '../helpers/hooks'

const Service = () => {
 const {sitedata} = useSite();
  useTitle(`${sitedata?.title || "KidStick"} | Service`);
  return (
    <div>
        <PageHeader title="Service" />
        <Services />
        <Price />
        <ContactUs />
    </div>
  )
}

export default Service
