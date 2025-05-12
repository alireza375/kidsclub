import React from "react";
import { useI18n } from "../providers/i18n";

import { PageHeader } from "../components/common/upperSection";

import { Link } from "react-router-dom";
import successImage from "../../images/succ.gif";
import { useSite } from "../context/site";
import { useTitle } from "../helpers/hooks";


const PaymentSuccessPage = () => {
    const i18n = useI18n();
  const {sitedata} = useSite();
  useTitle(`${sitedata?.title || "KidStick"} | Payment Success`);

    return (
        <div>
            <PageHeader title="Payement-Success" />

                <div className="md:py-10 py-5 lg:py-10">
                    <img
                        width={1000}
                        height={1000}
                        className="mx-auto md:w-[400px] w-[300px] h-auto"
                        src={successImage}
                        alt="Payment Success"
                    />
                    <h1 className="heading lg:mt-12 text-2xl mt-6 font-poppins text-green-500 text-textMain text-center">
                        {i18n?.t("Payment Success")}
                    </h1>
                    <div className="lg:mt-12 mt-4 flex items-center justify-center">
                        <Link
                            to={"/"}
                            className="underline text-xl font-poppins text-primary"
                        >
                            {i18n?.t("Back To Home")}
                        </Link>
                    </div>
                </div>

        </div>
    );
};

export default PaymentSuccessPage;
