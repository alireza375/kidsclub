import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "../../../providers/i18n";
import FormInput from "../../common/form/input";
import FormButton from "../../common/form/form-button";
import { Form } from "antd";
import { useAction, useFetch, useTitle } from "../../../helpers/hooks";
import {
    deleteServiceNotice,
    fetchServiceNotices,
    postServiceNotice,
    updateServiceNotice,
} from "../../../helpers/backend";
import { columnFormatter, noSelected } from "../../../helpers/utils";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { useUser } from "../../../context/user";
import dayjs from "dayjs";
import { useSite } from "../../../context/site";

const Notice = () => {
    const { user } = useUser();
    const { id } = useParams();
    const [notices, setNotices] = useFetch(fetchServiceNotices, { id });
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    const [selectedLang, setSelectedLang] = useState("");
    const [selectedNotice, setSelectedNotice] = useState(null); // For editing
    const [form] = Form.useForm(); // Ant Design Form instance
    const [isEdit, setIsEdit] = useState(false);
    const navigate = useNavigate();
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Notice") + " - " + user?.role === "admin" ? i18n.t("Admin") : i18n.t("Coach"));

    const handleSubmit = (values) => {
        values.service_id = id;
        values.is_active = true;
        if (isEdit) {
            values.id = selectedNotice.id;
        }
        useAction(
            isEdit ? updateServiceNotice : postServiceNotice,
            values,
            () => {
                setNotices((prev) => [...prev, values]);
                form.resetFields();
                setIsEdit(false);
            }
        );
    };

    const handleEdit = (notice) => {
        setIsEdit(true);
        setSelectedNotice(notice);
        form.setFieldsValue({
            title: notice.title,
            description: notice.description,
        });
    };

    const handleDelete = (noticeId) => {
        useAction(deleteServiceNotice, { id: noticeId }, () =>
            setNotices((prev) => prev.filter((n) => n.id !== noticeId))
        );
    };

    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode]);

    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    {i18n.t("Manage Notices")}
                </h1>
                <button
                    className="bg-secondary px-3 py-1 flex items-center gap-1 text-white rounded w-fit"
                    onClick={() => navigate(-1)}
                >
                    {" "}
                    {i18n?.t("Back")}{" "}
                </button>
            </div>

            {/* Notice Form */}
            <div className="flex justify-start flex-wrap gap-3">
                {languages?.docs?.map((l, index) => (
                    <button
                        onClick={() => setSelectedLang(l.code)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
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
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                className="space-y-4 adminForm"
            >
                {languages?.docs?.map((l, index) => (
                    <div
                        key={index}
                        style={{
                            display: l.code === selectedLang ? "block" : "none",
                        }}
                    >
                        <FormInput
                            name={["title", l.code]}
                            label={`${i18n?.t("Title")}`}
                            required
                        ></FormInput>
                        <div className="mt-6 mb-3">
                            <FormInput
                                name={["description", l.code]}
                                label={`${i18n?.t("Description")}`}
                                rules={[
                                    {
                                        required: true,
                                        message: i18n?.t(
                                            "Please provide a description"
                                        ),
                                    },
                                ]}
                                textArea
                            >
                            
                            </FormInput>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    <FormButton
                        onClick={() => noSelected({ form, setSelectedLang })}
                        className="px-4 py-2  rounded-lg hover:bg-primary-dark transition-all duration-300"
                    >
                        {selectedNotice ? i18n?.t("Update") : i18n?.t("Submit")}
                    </FormButton>
                </div>
            </Form>

            {/* Notice List */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {i18n?.t("Notices")}
                </h2>
                <ul className="space-y-4">
                    {notices?.docs?.map((notice) => (
                        <li
                            key={notice.id}
                            className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-shadow duration-200"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {columnFormatter(notice.title)}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {columnFormatter(notice.description)}
                                </p>
                                <p className="text-xs text-gray-400 mt-2 italic">
                                    {dayjs(notice.created_at).format(
                                        "YYYY-MM-DD HH:mm:ss"
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {user?.id === notice?.user?.id || user?.role === "admin" && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(notice)}
                                            className="px-3 py-1 border-blue-600 border text-blue-600 rounded-md text-sm hover:bg-blue-600 hover:text-white transition-all"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(notice.id)
                                            }
                                            className="px-3 py-1 border-secondary border text-secondary rounded-md text-sm hover:bg-secondary hover:text-white transition-all"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}

                    {notices?.docs?.length === 0 && (
                        <div className="text-center text-gray-500 text-sm">
                            {i18n.t("No notices available.")}
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Notice;
