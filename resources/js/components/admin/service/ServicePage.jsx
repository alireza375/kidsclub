import React, { useEffect, useState } from "react";
import { useI18n } from "../../../providers/i18n";
import PageTitle from "../../common/page-title";
import Table, { TableImage } from "../../common/form/table";
import { Form, Modal, Button, Tooltip, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { GrAnnounce } from "react-icons/gr";
import { FaTrash } from "react-icons/fa";
import FormButton from "../../common/form/form-button";
import FormInput from "../../common/form/input";
import FAQModal from "./FaqModal";
import {
    deleteService,
    fetchServices,
    updateService,
    fetchServiceFaqs,
    fetchServiceNotices,
    postServiceNotice,
    deleteServiceNotice,
} from "../../../helpers/backend";
import { columnFormatter, noSelected } from "../../../helpers/utils";
import { useAction, useActionConfirm, useFetch, useTitle } from "../../../helpers/hooks";
import Enrollment from "./Enrollment";
import Avatar from "../../common/Avatar";
import { useSite } from "../../../context/site";

const ServicePage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { languages, langCode, t } = useI18n();
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [data, getData, { loading }] = useFetch(fetchServices);
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [open, setOpen] = useState(false);
    const [notices, setNotices] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [openTab, setOpenTab] = useState("service");

    useEffect(() => {
        getData();
    }, []);

    const handleAddFAQ = (newFAQ) => setFaqs([...faqs, newFAQ]);
    const onDeleteFAQ = (index) => setFaqs(faqs.filter((_, i) => i !== index));

    const openFaqModal = async (service) => {
        const faqsData = await fetchServiceFaqs({ service_id: service?.id });
        setServiceId(service.id);
        setFaqs(faqsData?.data?.docs || []);
        setIsFaqModalOpen(true);
    };
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Service") + " - " + i18n.t("Admin"));
    // Notice
    const handleAddNotice = (values) => {
        const noticeData = {
            title: values?.title,
            description: values?.description,
            service_id: serviceId,
            is_active: true,
        };
        useAction(postServiceNotice, noticeData);
        setNotices(noticeData); // Add the new notice
        form.resetFields();
    };


    const closeModal = () => {
        setOpen(false);
    };

    const handleDeleteNotice = async (id) => {
        await useActionConfirm(deleteServiceNotice, {
            id: id,
            service_id: serviceId,
        });
        const updatedNotices = notices.filter((notice) => notice.id !== id);
        setNotices(updatedNotices); // Remove the deleted notice
    };

    const columns = [
        {
            text: "Image",
            dataField: "image",
            formatter: (_, service) => <TableImage url={service?.image} />,
        },
        {
            text: "Name",
            dataField: "name",
            formatter: (name) => (
                <Tooltip title={name?.length > 30 ? name : ""}>
                    <span>{columnFormatter(name)?.slice(0, 30)}...</span>
                </Tooltip>
            ),
        },
        {
            text: "Session",
            dataField: "session",
            formatter: (_, service) => <span>{service?.session}</span>,
        },
        {
            text: "FAQ",
            formatter: (_, service) => (
                <button
                    onClick={() => openFaqModal(service)}
                    className="px-3 py-1 border text-primary border-primary"
                >
                    {i18n.t("View")}
                </button>
            ),
        },
        {
            text: "children",
            dataField: "children",
            formatter: (_, children) => {
                const displayedChildren = children?.children?.slice(0, 4) || [];
                const remainingCount = (children?.children?.length || 0) - 4;

                return (
                    <div className="flex items-center -space-x-3">
                        {displayedChildren.map((child, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-center w-8 h-8 border rounded-full b"
                            >
                                
                                {
                                    child?.image ? <img
                                    src={child?.image}
                                    alt={child?.name}
                                    className="w-full h-full rounded-full"
                                /> : <Avatar classes="w-10 h-10" name={child?.name}></Avatar>
                                }
                            </div>
                        ))}
                        {remainingCount > 0 && (
                            <div className="flex items-center justify-center w-6 h-6 font-semibold text-gray-600 bg-gray-100 border border-black rounded-full mbtext-xs b">
                                {`+${remainingCount}`}
                            </div>
                        )}
                        {children?.children?.length === 0 && (
                            <p>{i18n.t("No children")}</p>
                        )}
                    </div>
                );
            }
        }

        ,
        {
            text: "Status",
            dataField: "status",
            formatter: (_, service) => (
                <Switch
                    checkedChildren={i18n.t("Active")}
                    unCheckedChildren={i18n.t("Inactive")}
                    checked={service?.is_active}
                    onChange={async () => {
                        await updateService({
                            id: service.id,
                            is_active:
                                service?.is_active === true ? false : true,
                        });
                        getData();
                    }}
                    className="bg-gray-500"
                />
            ),
        },
    ];

    return (
        <div className="min-h-full p-4 bg-gray-100 rounded-md">
                <div className="flex items-center justify-center gap-12 p-2 mb-8 border">
                <div
                    onClick={() => setOpenTab("service")}
                    className={`w-full border-2 border-transparent py-2 border-teal-blue cursor-pointer hover:text-white hover:bg-teal-blue text-xl font-nunito duration-300 ease-in-out text-center
                        ${
                            openTab === "service"
                                ? "bg-teal-blue text-white border-teal-blue"
                                : "text-gray-700 border-gray-300"
                        }
                        transition-all`}
                >
                    <h1>{i18n?.t("All Services")}</h1>
                </div>
                <div
                    onClick={() => setOpenTab("enrollment")}
                    className={`w-full border-2 border-transparent py-2 border-teal-blue cursor-pointer hover:text-white hover:bg-teal-blue text-xl font-nunito duration-300 ease-in-out text-center
                        ${
                            openTab === "enrollment"
                                ? "bg-teal-blue text-white border-teal-blue"
                                : "text-gray-700 border-gray-300"
                        }
                        transition-all`}
                >
                    <h1>{i18n?.t("Enrollment")}</h1>
                </div>
            </div>
            {openTab === "service" && (
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    onDelete={deleteService}
                    action={
                        <button
                            type="primary"
                            className="admin-btn"
                            onClick={() => navigate("/admin/service/add")}
                        >
                            {i18n?.t("Add New")}
                        </button>
                    }
                    onView={(service) =>
                        navigate(`/admin/service/view/${service?.id}`)
                    }
                    actions={(service) => (
                        <div className="flex justify-end gap-2.5">
                            <button
                                className="p-2 text-indigo-700 border border-indigo-700 rounded hover:bg-indigo-700 hover:text-white"
                                title="Announcement"
                                onClick={() => navigate(`/admin/service/notice/${service?.id}`)}
                            >
                                <GrAnnounce size={12} />
                            </button>
                        </div>
                    )}
                    onEdit={(service) =>
                        navigate(`/admin/service/edit/${service?.id}`)
                    }
                    indexed
                    pagination
                    i18n={i18n}
                />
            )}

            {openTab === "enrollment" && (
                <Enrollment></Enrollment>

            )}

            {/* Notice Modal */}
            <Modal
                title={`${i18n?.t("Notices for")} ${
                    columnFormatter(selectedEvent?.title) || "Service"
                }`}
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                className="adminForm"
            >
                <div>
                    {/* Language Switcher */}
                    <div className="flex flex-wrap justify-start gap-3 mt-10">
                        {languages?.docs?.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setSelectedLang(lang.code)}
                                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                                    lang.code === selectedLang
                                        ? "bg-secondary text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {lang.name}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleAddNotice}
                    >
                        <div className="space-y-4">
                            {languages?.docs?.map((lang) => (
                                <div
                                    key={lang.code}
                                    className={`transition-all duration-300 ${
                                        lang.code === selectedLang
                                            ? "block"
                                            : "hidden"
                                    }`}
                                >
                                    <FormInput
                                        required
                                        name={["title", lang.code]}
                                        label={i18n?.t("Title")}
                                        placeholder="Enter title"
                                    />
                                    <FormInput
                                        required
                                        name={["description", lang.code]}
                                        label={i18n?.t("Description")}
                                        placeholder="Enter description"
                                        textArea
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end mt-8 mb-10">
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
                    {notices?.length ? (
                        notices.map((notice) => (
                            <div
                                key={notice?.id}
                                className="flex items-center justify-between mb-4 border-[1px] border-gray-300 rounded-md p-4"
                            >
                                <div>
                                    <p className="font-semibold">
                                        {columnFormatter(notice?.title)}
                                    </p>
                                    <p className="font-semibold">
                                        {columnFormatter(notice?.description)}
                                    </p>
                                </div>

                                <button
                                    className="p-2 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white"
                                    onClick={() =>
                                        handleDeleteNotice(notice?.id)
                                    }
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">
                            {i18n?.t("No notices found")}
                        </p>
                    )}
                </div>
            </Modal>

            <FAQModal
                isVisible={isFaqModalOpen}
                onClose={() => setIsFaqModalOpen(false)}
                faqs={faqs}
                onAddFAQ={handleAddFAQ}
                onDeleteFAQ={onDeleteFAQ}
                serviceId={serviceId}
            />
        </div>
    );
};

export default ServicePage;
