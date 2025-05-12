import React, { useEffect, useState } from "react";
import { Button, message, Modal } from "antd";
import { FaRegClock, FaRegCopy } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { useI18n } from "../../providers/i18n";
import { useFetch, useTitle } from "../../helpers/hooks";
import { joinEventList } from "../../helpers/backend";
import dayjs from "dayjs";
import { columnFormatter } from "../../helpers/utils";
import { useNavigate } from "react-router-dom";
import { useSite } from "../../context/site";
import FormButton from "../common/form/form-button";
import Pagination from "../common/pagination";

export default function Events() {
    const [event, getEvent] = useFetch(joinEventList, {},false);
    const navigate = useNavigate();
    const i18n = useI18n();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [eventData, setEventData] = useState(null);
    const { sitedata } = useSite();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    useTitle(
        sitedata?.title + " | " + i18n.t("Events") + " - " + i18n.t("User")
    );
    const showModal = (eventData) => {
        setIsModalVisible(true);
        setEventData(eventData);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleCopyTicketId = (ticketId) => {
        navigator.clipboard
            .writeText(ticketId)
            .then(() => {
                message.success(`Ticket ID: ${ticketId} copied to clipboard!`);
            })
            .catch((err) => {
                alert("Failed to copy Ticket ID. Please try again.");
                message.error(err);
            });
    };
    const onPageChange = (page) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getEvent({ page, limit: pageSize });
    };

    useEffect(() => {
        getEvent({
            page: currentPage,
            limit: pageSize,
        });
    }, [currentPage, pageSize]);

    const EventCard = ({ event }) => {
        return (
            <div className="md:flex items-center justify-between p-4 border rounded-lg ">
                <div className="flex items-center gap-8">
                    <div className="text-center min-w-[60px] pl-5 pr-10 border-r-2 font-nunito">
                        <div className="text-secondary font-medium text-2xl">
                            {dayjs(event?.event?.event_date).format("ddd")}
                        </div>
                        <div className="text-[32px] text-primary font-bold">
                            {dayjs(event?.event?.event_date).format("DD")}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-col gap-3 text-muted-foreground font-nunito">
                            <div className="flex items-center gap-1">
                                <FaRegClock className="w-4 h-4" />
                                {dayjs(
                                    event?.event?.start_time,
                                    "HH:mm:ss"
                                ).format("hh:mm A")}{" "}
                                -{" "}
                                {dayjs(
                                    event?.event?.end_time,
                                    "HH:mm:ss"
                                ).format("hh:mm A")}
                            </div>
                            <div className="flex items-center gap-1 -ml-[2px]">
                                <IoLocationOutline className="size-5" />
                                <span>
                                    {event?.location?.length > 20
                                        ? event?.event?.location?.slice(0, 20) +
                                          "..."
                                        : event?.event?.location}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:my-0 my-5">
                    <h2 className="font-semibold font-nunito text-secondary">
                        {columnFormatter(event?.event?.title)}
                    </h2>

                    <div className="flex -space-x-2">
                        {event?.event?.members?.map((_, i) => (
                            <div
                                key={i}
                                className="w-8 h-8 rounded-full border-2 border-background overflow-hidden"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
                                    alt="Participant"
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={() => navigate(`/event/${event?.event?.id}`)}
                        className="px-3 py-1 w-full border-secondary border  text-secondary hover:bg-secondary hover:text-white ease-in-out duration-300 "
                    >
                        {i18n?.t("View")}
                    </button>
                    <button
                        onClick={() => showModal(event)}
                        className="px-3 py-1 w-full border-secondary border  text-secondary hover:bg-secondary hover:text-white ease-in-out duration-300 "
                    >
                        {i18n?.t("Join Info")}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full p-5">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
                <h1 className="text-xl font-semibold text-gray-800">
                    {i18n?.t("Events")}
                </h1>
            </div>

            <div className="space-y-4">
                {event?.docs?.length > 0 ? (
                    event?.docs?.map((eventItem) => (
                        <EventCard key={eventItem.id} event={eventItem} />
                    ))
                ) : (
                    <div className="flex items-center justify-evenly p-6 border border-gray-300 rounded-md bg-gray-50">
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-[16px] font-medium !text-[#0C1A40] font-poppins leading-[25.6px] mb-5">
                                {i18n?.t("No Events found")}
                            </p>
                            <button
                                onClick={() => navigate("/event")}
                                className="bg-secondary text-white py-2 rounded-lg px-4"
                            >
                                {i18n?.t("Find Events")}
                            </button>
                        </div>
                    </div>
                )}
                {event?.totalDocs > 0 && (
                            <Pagination
                                align="center"
                                className="!mt-[100px] body-paginate"
                                page={currentPage}
                                pageSize={pageSize}
                                total={event?.totalDocs}
                                onPageChange={onPageChange}
                                totalPages={event?.totalPages}
                            />
                        )}
            </div>

            <Modal
                title="Event Join Information"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                className="!rounded-xl !shadow-lg !p-6 !w-96" // Added width for better control
            >
                <div className="space-y-6 font-nunito text-secondary">
                    <div className="space-y-2 my-5">
                        <p className="text-sm">
                            <strong>{i18n?.t("Event Name")}:</strong>{" "}
                            {columnFormatter(eventData?.event?.title)}
                        </p>
                        <p className="text-sm text-muted">
                            <strong>{i18n?.t("Ticket")}: </strong>
                            <span className="text-xs">{eventData?.ticket}</span>
                            <button
                                onClick={() =>
                                    handleCopyTicketId(eventData?.ticket)
                                }
                                className="ml-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
                            >
                                <FaRegCopy className="w-4 h-4" />
                                {i18n?.t("Copy")}
                            </button>
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm">
                            <strong>{i18n?.t("Start Time")}:</strong>{" "}
                            {dayjs(
                                eventData?.event?.start_time,
                                "HH:mm:ss"
                            ).format("hh:mm A")}
                        </p>
                        <p className="text-sm">
                            <strong>{i18n?.t("Location")}:</strong>{" "}
                            {eventData?.event?.location}
                        </p>
                    </div>

                    {/* Button Section */}
                    <div className="mt-4 flex justify-end gap-4">
                        <button
                            type="default"
                            onClick={handleCancel}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-6 rounded-lg text-sm transition duration-300 ease-in-out"
                        >
                            {i18n?.t("Close")}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
