import React, { useEffect, useState } from "react";
import { useI18n } from "../../../providers/i18n";
import PageTitle from "../../common/page-title";
import Table, { TableImage } from "../../common/form/table";
import { Form, Modal, Input, Button, List, Tooltip, Switch } from "antd";
import {
    useAction,
    useActionConfirm,
    useFetch,
    useTitle,
} from "../../../helpers/hooks";
import { Link, useNavigate } from "react-router-dom";
import {
    deleteEvent,
    deleteEventNotice,
    fetchEvents,
    postEventNotice,
    updateEventStatus,
} from "../../../helpers/backend";
import dayjs from "dayjs";
import { GrAnnounce } from "react-icons/gr";
import { columnFormatter, noSelected } from "../../../helpers/utils";
import FormButton from "../../common/form/form-button";
import FormInput from "../../common/form/input";
import { FaEye, FaTrash } from "react-icons/fa";
import { useSite } from "../../../context/site";

const EventPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { languages, langCode, t } = useI18n();

    const [data, getData, { loading }] = useFetch(fetchEvents);
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [open, setOpen] = useState(false); // Modal open state
    const [notices, setNotices] = useState(data?.event_news || []); // List of notices
    const [newNotice, setNewNotice] = useState(""); // New notice input value
    const [selectedEvent, setSelectedEvent] = useState(null); // Selected event for notices
    const { sitedata } = useSite();
    useTitle(
        sitedata?.title + " | " + i18n.t("Event") + " - " + i18n.t("Admin")
    );
    const handleAddNotice = (values) => {
        const updatedNotices = [
            ...notices,
            { id: notices.length + 1, title: values?.notice },
        ];
        useAction(postEventNotice, {
            id: selectedEvent?.id,
            notices: updatedNotices,
        });
        setNotices(updatedNotices); // Add the new notice
        form.resetFields();
    };

    const handleAnnouncement = async (data) => {
        const events = await fetchEvents({ id: data?.id });
        setSelectedEvent(events?.data); // Set the selected event
        setNotices(events?.data?.event_news || []); // Load notices from the event or an empty array
        setOpen(true); // Open modal
    };

    const closeModal = () => {
        setOpen(false);
    };

    const handleDeleteNotice = async (id) => {
        const updatedNotices = notices.filter((notice) => notice.id !== id);
        await useActionConfirm(deleteEventNotice, {
            id: selectedEvent?.id,
            updatedNotices,
        });
        setNotices(updatedNotices); // Remove the deleted notice
    };

    useEffect(() => {
        getData();
    }, []);

    const columns = [
        {
            text: "Image",
            dataField: "image",
            formatter: (_, d) => (
                <div className="flex space-x-1">
                    <TableImage url={d?.image} />
                </div>
            ),
        },
        {
            text: "Title",
            dataField: "title",
            formatter: (title) => (
                <span className="">
                    <Tooltip title={title?.length > 30 ? title : ""}>
                        <span className="cursor-help">
                            {columnFormatter(title)?.length > 30
                                ? columnFormatter(title).slice(0, 30) + "..."
                                : columnFormatter(title)}
                        </span>
                    </Tooltip>
                </span>
            ),
        },
        {
            text: "Date",
            dataField: "event_date",
            formatter: (_, d) => (
                <div className="flex space-x-1">
                    <span>{dayjs(d?.event_date).format("MMM DD, YYYY")} </span>
                </div>
            ),
        },
        {
            text: "Type",
            dataField: "type",
            formatter: (_, d) => (
                <div className="flex space-x-1">
                    <span
                        className={`${
                            d?.type === "free"
                                ? "text-green-600"
                                : "text-red-600"
                        } capitalize`}
                    >
                        {d?.type}{" "}
                    </span>
                </div>
            ),
        },
        {
            text: "Ticket Sell",
            dataField: "ticket_sold",
            formatter: (_, d) => (
                <div className="flex space-x-1">
                    <Link to={`/admin/event/tickets/${d?.id}`}>
                        {" "}
                        <span
                            className={`${
                                d?.type === "free"
                                    ? "text-green-600"
                                    : "text-red-600"
                            } capitalize`}
                        >
                            {i18n?.t("View Tickets")} ({d?.ticket_sold}){" "}
                        </span>
                    </Link>
                </div>
            ),
        },
        {
            text: "Status",
            dataField: "status",
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t("Active")}
                    unCheckedChildren={i18n?.t("Inactive")}
                    checked={d?.is_active}
                    onChange={async () => {
                        await updateEventStatus({
                            id: d.id,
                            is_active: d?.is_active ? 0 : 1,
                        });
                        getData();
                    }}
                    className="bg-gray-500"
                />
            ),
        },
    ];

    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <PageTitle title="Event List" />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                onDelete={deleteEvent}
                action={
                    <button
                        className="admin-btn"
                        type="primary"
                        onClick={() => navigate("/admin/event/add")}
                    >
                        {i18n?.t("Add New")}
                    </button>
                }
                actions={(data) => (
                    <div className="flex justify-end gap-2.5">
                        <button
                            className="p-2 text-indigo-700 transition border border-indigo-700 rounded hover:bg-indigo-700 hover:text-white focus:shadow-none"
                            title="Announcement"
                            onClick={() => handleAnnouncement(data)}
                        >
                            <GrAnnounce size={12} />
                        </button>
                        <button
                            className="p-2 text-red-600 transition border border-red-700 rounded hover:bg-red-700 hover:text-white focus:shadow-none"
                            title="Delete"
                            onClick={() =>
                                navigate(`/admin/event/details/${data?.id}`)
                            }
                        >
                            <FaEye size={12} />
                        </button>
                    </div>
                )}
                onEdit={(data) => navigate(`/admin/event/edit/${data?.id}`)}
                indexed
                pagination
                i18n={i18n}
            />

            {/* Notice Modal */}
            <Modal
                title={`${i18n?.t("Notices for")} ${
                    columnFormatter(selectedEvent?.title) || "Event"
                }`}
                open={open}
                onCancel={closeModal}
                footer={null}
                className="adminForm"
            >
                {/* Add Notice */}
                <div>
                    {/* Language Switcher */}
                    <div className="flex flex-wrap justify-start gap-3 mt-10">
                        {languages?.docs?.map((l, index) => (
                            <button
                                onClick={() => setSelectedLang(l.code)}
                                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                                    l.code === selectedLang
                                        ? "bg-secondary text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                                key={index}
                            >
                                {l.name}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleAddNotice}
                    >
                        {/* Multilingual Inputs */}
                        <div className="space-y-4">
                            {languages?.docs?.map((l, index) => (
                                <div
                                    key={index}
                                    className={`transition-all duration-300 ${
                                        l.code === selectedLang
                                            ? "block"
                                            : "hidden"
                                    }`}
                                >
                                    <div className="">
                                        <FormInput
                                            required
                                            name={["notice", l.code]}
                                            label={i18n?.t("Notice")}
                                            placeholder="Enter description"
                                            textArea
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end mb-10">
                            <button
                                className="admin-btn"
                                type="submit"
                                onClick={() =>
                                    noSelected({ form, setSelectedLang })
                                }
                            >
                                {t("Add Notice")}
                            </button>
                        </div>
                    </Form>
                </div>
                {/* Notices List */}
                <div className="border-[1px] border-gray-300 rounded-md p-4">
                    {notices?.map((notice, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between mb-4 border-[1px] border-gray-300 rounded-md p-4"
                        >
                            <p className="font-semibold">
                                {columnFormatter(notice?.title)}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    className="p-2 text-red-600 transition border border-red-600 rounded hover:bg-red-600 hover:text-white focus:shadow-none"
                                    title="Delete"
                                    onClick={() =>
                                        handleDeleteNotice(notice?.id)
                                    }
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {notices?.length === 0 && (
                        <p className="text-center text-gray-500">
                            {i18n?.t("No notices found")}
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default EventPage;
