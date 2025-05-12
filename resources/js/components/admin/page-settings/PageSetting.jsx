import React, { useState } from 'react';
import { AiOutlineContacts } from "react-icons/ai";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { GoCodeOfConduct } from "react-icons/go";
import { LiaBorderStyleSolid } from "react-icons/lia";
import { IoHomeOutline } from "react-icons/io5";
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../common/page-title';
import { useTitle } from '../../../helpers/hooks';
import HomePageSetting from './homepage';
import AboutPageSetting from './aboutPage';
import PrivacyPage from './privacypage';
import TermsPage from './termspage';
import { useSite } from '../../../context/site';
import ContactPage from './contactpage';
import Overview from './overView';
import { FiAward } from "react-icons/fi";

const PageSettings = () => {
    const [tab, setTab] = useState(0);
    const i18n = useI18n()  ;
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Pages") + " - " + i18n.t("Admin"));

    const methods = [

        {
            label: ("Home"),
            icon: <IoHomeOutline />,
            form: <HomePageSetting slug={'home'} />
        },
        {
            label: ("About Us"),
            icon: <LiaBorderStyleSolid />,
            form: <AboutPageSetting slug={'about'} />
        },

        {
            label: ("Contact Us"),
            icon: <AiOutlineContacts />,
            form: <ContactPage slug={'contact'} />
        },
        {
            label: ("Privacy Policy"),
            icon: <MdOutlinePrivacyTip />,
            form: <PrivacyPage slug={'privacy_policy'} />
        },
        {
            label: ("Terms & Conditions"),
            icon: <GoCodeOfConduct />,
            form: <TermsPage slug={'terms_condition'} />
        },
        {
            label: ("Overview"),
            icon:<FiAward />,
            form: <Overview slug={'overview'} />
        },
    ];



    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <div className='flex justify-between'>
                <PageTitle title="Pages List" />

            </div>
            <div className="flex flex-col gap-4">
                <div className="w-full">
                    <div className="flex flex-row flex-wrap xl:flex-nowrap  bg-white">
                        {methods.map((method, index) => (
                            <div
                                key={index}
                                className={`w-full  border-2 border-transparent py-2 border-[#376179] cursor-pointer hover:text-white hover:bg-[#376179] text-xl font-nunito duration-300 ease-in-out text-center ${tab === index ? "bg-[#376179] text-white border-[#376179]" : "text-gray-700 border-gray-300"}`}
                                onClick={() => setTab(index)}>
                                <div className='flex justify-center items-center'>
                                <div className="mr-4">{method.icon}</div>
                                <div>{i18n.t(method.label)}</div></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    {methods[tab].form}
                </div>
            </div>
        </div>
    );
};

export default PageSettings;
