import React, { useState } from "react";
import { columnFormatter } from "../../helpers/utils";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../../providers/i18n";
import { GrAnnounce } from "react-icons/gr";
import { Empty, Form, Modal } from "antd";
import FormButton from "../common/form/form-button";
import FormInput from "../common/form/input";
import { useFetch, useTitle } from "../../helpers/hooks";
import { fetchCoacheService } from "../../helpers/backend";
import { useSite } from "../../context/site";

const ServiceList = () => {
    const [services, getServices] = useFetch(fetchCoacheService);
    const [selectedService, setSelectedService] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const navigate = useNavigate();

    const i18n = useI18n();
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Service List") + " - " + i18n.t("Coach"));
    // const services = [
    //     {
    //         id: 1,
    //         name: {
    //             en: "Yoga",
    //             ar: "يوجا",
    //         },
    //         title: {
    //             en: "Yoga",
    //             ar: "يوجا",
    //         },
    //         image: "https://via.placeholder.com/150",
    //     },
    //     {
    //         id: 2,
    //         name: {
    //             en: "Yoga",
    //             ar: "يوجا",
    //         },
    //         title: {
    //             en: "Yoga",
    //             ar: "يوجا",
    //         },
    //         image: "https://via.placeholder.com/150",
    //     },
    // ];

    // Open modal and set selected service
   

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setNoticeData({ title: "", description: "" });
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNoticeData((prev) => ({ ...prev, [name]: value }));
    };

    // Submit notice
    const handleSubmit = () => {
        if (noticeData.title && noticeData.description) {
            onAddNotice(selectedService.id, noticeData);
            closeModal();
        } else {
            alert("Please fill in all fields");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 shadow-dashboard rounded-md">
            <h1 className="text-2xl font-bold mb-4">{i18n.t("Your Services")}</h1>
            <div className="h-full mt-10">
            {services?.docs?.map((data) => (
                <div
                    key={data?.id}
                    className=" group p-3 lg:p-4 xl:p-5 rounded-[10px] mb-10 shadow-dashboard "
                >
                    <div className="h-[200px]">
                        <img
                            className="max-w-full mx-auto h-full object-cover rounded-md"
                            src={data?.image}
                            alt=""
                        />
                    </div>

                    <div className="mt-5 lg:mt-6 xl:mt-8">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="heading2 group-hover:text-[#49D574] transition-all duration-300">
                                {columnFormatter(data?.name)}
                            </h3>
                        </div>
                        <p className="description mt-4 lg:mt-4">
                            {columnFormatter(data?.title)}
                        </p>
                        <div className="flex justify-between mt-3">
                            <div className=" flex items-center justify-between">
                                <Link
                                    to={`/service/${data?.id}`}
                                    className="text-secondary hover:text-white border-1 border hover:bg-secondary px-5 font-bold py-3 rounded-md"
                                >
                                    {i18n.t("View Details")}
                                </Link>
                            </div>
                            <button
                                onClick={() => navigate(`/coach/notice/${data?.id}`)}
                                className=" flex text-secondary hover:text-white border-1 items-center border hover:bg-secondary  px-5 font-bold py-3 rounded-md"
                            >
                                <GrAnnounce />
                                <span className="ml-2">
                                    {i18n.t("Add Notice")}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {services?.docs?.length === 0 && (
                <div className="text-center text-2xl font-bold">
                   <Empty />
                </div>
            )}    
            </div>
            


        </div>
    );
};

export default ServiceList;
