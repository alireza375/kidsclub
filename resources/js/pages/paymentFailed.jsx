import React from "react";
import { PageHeader } from "../components/common/upperSection";
import { useI18n } from "../providers/i18n";
import { Link } from "react-router-dom";
import failImage from '../../images/fail.gif';
import { useSite } from "../context/site";
import { useTitle } from "../helpers/hooks";
const PaymentFailed = () => {
  const i18n = useI18n();
  const {sitedata} = useSite();
  useTitle(`${sitedata?.title || "KidStick"} | Payment Failed`);
  return (
    <div>
      <PageHeader title={'Payment Cancel'} />
      <div className="md:py-20 py-10 lg:py-32">
        <img width={1000} height={1000} className="mx-auto md:w-[400px] w-[300px] h-auto" src={failImage} alt="Payment failed" />
        <h1 className="heading lg:mt-12 text-textMain mt-6  text-center">
            {i18n?.t('Payment Failed')}
        </h1>
        <div className="lg:mt-12 mt-4 flex items-center justify-center">
            <Link to={"/"} className="underline font-poppins text-primary">{i18n?.t( "Back To Dashboard")}</Link>
        </div>
    </div>
    </div>
  );
};

export default PaymentFailed;
