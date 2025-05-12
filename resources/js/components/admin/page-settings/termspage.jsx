import React, { useEffect, useState } from "react";
import { Card, Form, message, notification } from "antd";
import {
    fetchSinglePage,
    postPage,
    translateLanguage,
} from "../../../helpers/backend";
import { useI18n } from "../../../providers/i18n";
import { useFetch } from "../../../helpers/hooks";
import { HiddenInput } from "../../../components/common/form/input";
import { noSelected } from "../../../helpers/utils";
import FormButton from "../../common/form/form-button";
import JodiEditor from "../../common/form/jodiEditor";

const TermsPage = ({ slug }) => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const [page, getPage] = useFetch(fetchSinglePage, {}, false);
    let { languages, langCode } = useI18n();
    const [selectedLang, setSelectedLang] = useState("en");
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        setSelectedLang(langCode || "en");
    }, [langCode]);
    useEffect(() => {
        getPage({ slug: slug });
    }, [slug]);

    useEffect(() => {
        if (page?.id) {
            form.setFieldsValue({
                id: page?.id,
                title: page?.title,
                slug: page?.slug ,
                content: page?.content,
            });
        }
    }, [page?.slug]);

    const handleSubmit = async (values) => {
        setLoading(true);
        const submitData = {
            id: values?.id ? values?.id : undefined,
            title: values?.title || "Terms & Condition",
            slug: values?.slug ,
            content_type: "json",
            content: values?.content,
        };
        const { message, success } = await postPage(submitData);
        if (success) {
            getPage({ slug: slug });

            setLoading(false);
            notification.success({
                message: message,
            });
        } else {
            setLoading(false);
            notification.error({
                message: message,
            });
        }
    };

    return (
        <div>
            <Card>
                <div className="flex justify-start flex-wrap gap-3 mb-4 mt-4">
                    {languages?.docs?.map((l, index) => (
                        <div
                            onClick={() => setSelectedLang(l.code || "en")}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                                l.code === selectedLang
                                    ? "bg-teal-blue text-white cursor-pointer"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                            }`}
                            key={index}
                        >
                            {l.name}
                        </div>
                    ))}
                </div>

                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <HiddenInput name="id" />
                    <HiddenInput name="slug" />
                    {languages?.docs?.map((l, index) => (
                        <div
                            key={index}
                            style={{
                                display:
                                    l.code === selectedLang ? "block" : "none",
                            }}
                        >
                            <JodiEditor
                                name={["content", l.code]}
                                label={i18n?.t("Content")}
                                required={l.code === langCode}
                            />
                        </div>
                    ))}
                    <button
                        loading={loading}
                        onClick={() => noSelected({ form, setSelectedLang })}
                        type="submit"
                       className="admin-btn"
                    >
                        {i18n.t("Submit")}
                    </button>
                </Form>
            </Card>
        </div>
    );
};

export default TermsPage;
