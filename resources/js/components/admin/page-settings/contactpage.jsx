import React, { useEffect, useState } from 'react';
import { Card, Form, notification } from 'antd';
import { fetchSinglePage, postPage, postSingleImage} from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import { useFetch } from '../../../helpers/hooks';
import FormInput, { HiddenInput } from '../../../components/common/form/input';
import { noSelected } from '../../../helpers/utils';
import MultipleImageInput from '../../common/form/multiImage';
import JodiEditor from '../../common/form/jodiEditor';

const ContactPage = ({ slug }) => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const [page, getPage] = useFetch(fetchSinglePage, {}, false);
    const [formValues, setFormValues] = useState({});
    let { lang, languages, langCode } = useI18n();
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        getPage({ slug: slug });
    }, [slug]);

    useEffect(() => {
        if (page?.id) {
            const initialFormValues = {
                id: page.id,
                title: page.title,
                slug: page.slug,
                contact_image1: Array.isArray(
                    page.content?.contact_image1
                )
                    ? page?.content?.contact_image1?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.contact_image1 }],
                contact_image2: Array.isArray(
                    page.content?.contact_image2
                )
                    ? page?.content?.contact_image2?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.contact_image2 }],

            };

            if (Array.isArray(languages?.docs)) {
                languages?.docs?.forEach((lang) => {

                    initialFormValues.contact_section =
                    initialFormValues?.contact_section || {};
                    initialFormValues.contact_section.title=initialFormValues.contact_section.title || {};
                    initialFormValues.contact_section.title[lang?.code]=page?.content?.contact_section?.title[lang?.code] || "";

                    initialFormValues.contact_section.heading=initialFormValues.contact_section.heading || {};
                    initialFormValues.contact_section.heading[lang.code]=page?.content?.contact_section?.heading[lang.code] || "";

                    initialFormValues.contact_section.description=initialFormValues.contact_section.description || {};
                    initialFormValues.contact_section.description[lang.code]=page?.content?.contact_section?.description[lang.code] || "";
                })}

            setFormValues(initialFormValues);
            form.setFieldsValue(initialFormValues);
        }
    }, [page?.slug]);


    // useEffect(() => {
    //     form.setFieldsValue(formValues);
    // }, [selectedLang, formValues]);



    const handleSubmit = async(values) => {
          setLoading(true);
          const uploadImage = async (imageField, imageName) => {
                                  if (values?.[imageField]?.[0]?.originFileObj) {
                                      const image = { file: values[imageField][0].originFileObj, image_name: imageName };
                                      const { data } = await postSingleImage(image);
                                      values[imageField] = data;
                                  }
                              };
          await uploadImage('contact_image1', 'contact_page');
          await uploadImage('contact_image2', 'contact_page');

        const submitData = {
            title: "Contact",
            slug: values.slug || page?.slug,
            content_type: 'json',
            content:{
                id: values?.id ? values?.id : undefined,
                contact_image1: values?.contact_image1,
                contact_image2: values?.contact_image2,
                contact_section:{
                    title:values?.contact_section?.title,
                    heading:values?.contact_section?.heading,
                    description:values?.contact_section?.description,
                }
            }

        };

        const { message, success } = await postPage(submitData);
        if (success) {
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



                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <HiddenInput name="slug" />
                    <HiddenInput name="id" />
                    <div className="border p-3 rounded mt-5">
                    <h2 className="font-semibold text-lg mb-4 border-b">
                                    {i18n.t("Contact Page")}
                                </h2>
                    <div className="flex justify-start flex-wrap gap-3 mb-4 mt-4">
                        {languages?.docs?.map((l, index) => (
                            <div
                                onClick={() =>{ setSelectedLang(l.code);}}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                                    l.code === (selectedLang || "en")
                                        ? "bg-teal-blue text-white cursor-pointer"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                                }`}
                                key={index}
                            >
                                {l.name}
                            </div>
                        ))}
                    </div>


                                <div className="border p-3 rounded mt-5">
                        {languages?.docs?.map((l, index) => (
                            <div
                                key={index}
                                style={{
                                    display:
                                        l.code === selectedLang
                                            ? "block"
                                            : "none",
                                }}
                            >


                                <label className="text-secondary">
                                    {i18n.t("Title")}
                                </label>
                                <FormInput
                                    name={["contact_section","title", l.code]}
                                    placeholder="Enter title"

                                />

                               <label className="text-secondary">
                                    {i18n.t(" Heading ")}
                                </label>
                                <FormInput
                                    name={["contact_section","heading", l.code]}
                                    placeholder="Enter heading"

                                />
                                <JodiEditor
                                    label={" Description "}
                                    name={[
                                        "contact_section",
                                        "description",
                                        l.code,
                                    ]}

                                />

                           </div>
                        ))}
                        </div>
                                <div className="flex gap-4">
                                    <MultipleImageInput
                                        name="contact_image1"
                                        label="Image 1"
                                        
                                    />
                                    <MultipleImageInput
                                        name="contact_image2"
                                        label="Image 2"

                                    />
                                </div>
                                 </div>
                    <button loading={loading} onClick={() => noSelected({ form, setSelectedLang })} type='submit' className="mt-3 admin-btn">{i18n.t('Submit')}</button>
                </Form>
            </Card>
        </div>
    );
};

export default ContactPage;

