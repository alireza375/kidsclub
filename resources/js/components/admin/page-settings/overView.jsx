import React, { useEffect, useState } from "react";
import { Card, Form, message, notification } from "antd";
import {
    fetchSinglePage,
    postPage,
    translateLanguage,
} from "../../../helpers/backend";
import { useI18n } from "../../../providers/i18n";
import { useFetch } from "../../../helpers/hooks";
import FormInput, { HiddenInput } from "../../common/form/input";
import { noSelected } from "../../../helpers/utils";
import FormButton from "../../common/form/form-button";
import JodiEditor from "../../common/form/jodiEditor";

const Overview = ({ slug }) => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const [page, getPage] = useFetch(fetchSinglePage, {}, false);
    let { languages, langCode } = useI18n();
    const [selectedLang, setSelectedLang] = useState("");
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        setSelectedLang(langCode || "");
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
        // Create the final payload
        const submitData = {
            id: values?.id || undefined,
            title: values?.title || "Overview",
            slug: values?.slug,
            content_type: "json",
            content: values?.content, 
        };
    
        // Submit the data
        setLoading(true);
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
                
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <HiddenInput name="id" />
                    <HiddenInput name="slug" />
                   <FormInput
                        name={['content','services']}
                        label="Total Services"
                        required={true}
                        type={"number"}
                        initialValue={page?.content?.services || ''}
                        
                    />
                    <FormInput
                        name={['content','teachers']}
                        label="Qualified Teachers"
                        required={true}
                        type={"number"}
                        initialValue={page?.content?.teachers || ''}
                        
                    />
                    <FormInput
                        name={['content','students']}
                        label="Students Enrolled"
                        required={true}
                        type={"number"}
                        initialValue={page?.content?.students || ''}
                        
                    />
                    <FormInput
                        name={['content','experience']}
                        label="Years of Experience"
                        required={true}
                        type={"number"}
                        initialValue={page?.content?.experience || ''}
                        
                    />
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

export default Overview;
