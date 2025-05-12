import { Form } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import FormInput from "../common/form/input";
import FormButton from "../common/form/form-button";
import { useI18n } from "../../providers/i18n";

const Notice = () => {
    const { id } = useParams();
    const i18n = useI18n();
    const [notices, setNotices] = useState([]);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [noticeData, setNoticeData] = useState({
        title: "",
        description: "",
    });

    const [isEditMode, setIsEditMode] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNoticeData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Submit
    const handleSubmit = () => {
        if (noticeData.title && noticeData.description) {
            if (isEditMode) {
                // Update the selected notice
                setNotices((prev) =>
                    prev.map((notice) =>
                        notice.id === selectedNotice.id
                            ? { ...notice, ...noticeData }
                            : notice
                    )
                );
                setIsEditMode(false);
            } else {
                // Add new notice
                setNotices((prev) => [
                    ...prev,
                    { id: Date.now(), ...noticeData },
                ]);
            }
            setNoticeData({ title: "", description: "" });
        } else {
            alert("Please fill in all fields.");
        }
    };

    // Handle Delete
    const handleDelete = (id) => {
        setNotices((prev) => prev.filter((notice) => notice.id !== id));
    };

    // Handle Edit
    const handleEdit = (notice) => {
        setSelectedNotice(notice);
        setNoticeData({ title: notice.title, description: notice.description });
        setIsEditMode(true);
    };

    return (
        <div className="max-w-4xl p-6 mx-auto space-y-6 rounded-md shadow-dashboard">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
                {i18n.t("Manage Notices")}
            </h1>

            {/* Notice Form */}
            <Form className="space-y-4 adminForm">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {i18n.t("Title")}
                    </label>
                    <FormInput
                        name="title"
                        value={noticeData.title}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {i18n.t("Description")}
                    </label>
                    <FormInput
                        name="description"
                        value={noticeData.description}
                        onChange={handleChange}
                        textArea={true}
                        className="w-full border-gray-300 rounded-lg"
                    />
                </div>
                <div className="flex justify-end">
                    <FormButton
                        onClick={handleSubmit}
                        className="px-4 py-2 text-white transition-all duration-300 rounded-lg bg-primary hover:bg-primary-dark"
                    >
                        {isEditMode ? i18n.t("Update") : i18n.t("Submit")}
                    </FormButton>
                </div>
            </Form>

            {/* Notice List */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    {i18n.t("Notices")}
                </h2>
                <ul className="space-y-4">
                    {notices.map((notice) => (
                        <li
                            key={notice.id}
                            className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {notice.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    {notice.description}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleEdit(notice)}
                                    className="px-3 py-1 text-sm text-white transition-all bg-blue-500 rounded-md hover:bg-blue-600"
                                >
                                    {i18n.t("Edit")}
                                </button>
                                <button
                                    onClick={() => handleDelete(notice.id)}
                                    className="px-3 py-1 text-sm text-white transition-all bg-red-500 rounded-md hover:bg-red-600"
                                >
                                    {i18n.t("Delete")}
                                </button>
                            </div>
                        </li>
                    ))}

                    {notices.length === 0 && (
                        <div className="text-sm text-center text-gray-500">
                            {i18n.t("No notices available")}.
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Notice;
