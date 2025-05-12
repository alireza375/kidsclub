import { Card, Form, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import {
    fetchSinglePage,
    postPage,
    postSingleImage,
} from "../../../helpers/backend";
import { useI18n } from "../../../providers/i18n";
import { useFetch } from "../../../helpers/hooks";
import FormInput, { HiddenInput } from "../../../components/common/form/input";
import MultipleImageInput from "../../../components/common/form/multiImage";
import { noSelected } from "../../../helpers/utils";
import FormButton from "../../common/form/form-button";
import JodiEditor from "../../common/form/jodiEditor";

const AboutPageSetting = ({ slug }) => {
    const [form] = Form.useForm();
    const [page, getPage] = useFetch(fetchSinglePage, {}, false);
    const i18n = useI18n();
    const { langCode, languages } = useI18n();
    const [selectedLang, setSelectedLang] = useState();
    const [formValues, setFormValues] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getPage({ slug: slug });
    }, [slug]);

    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode]);

    useEffect(() => {
        if (page?.id) {
            let initialFormValues = {
                id: page.id,
                title: page.title,
                slug: page.slug,
                gallery_1: Array.isArray(
                    page?.content?.about_page?.gallary?.image1
                )
                    ? page?.content?.about_page?.gallary?.image1?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page?.content?.about_page?.gallary?.image1 }],
                gallery_2: Array.isArray(
                    page?.content?.about_page?.gallary?.image2
                )
                    ? page?.content?.about_page?.gallary?.image2?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page?.content?.about_page?.gallary?.image2 }],
                gallery_3: Array.isArray(
                    page?.content?.about_page?.gallary?.image3
                )
                    ? page?.content?.about_page?.gallary?.image3?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page?.content?.about_page?.gallary?.image3 }],
                gallery_4: Array.isArray(
                    page?.content?.about_page?.gallary?.image4
                )
                    ? page?.content?.about_page?.gallary?.image4?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page?.content?.about_page?.gallary?.image4 }],

                mission_image: Array.isArray(
                    page?.content?.about_page?.mission?.image
                )
                    ? page.content?.about_page?.mission?.image?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.about_page?.mission?.image }],
                mission_icon: Array.isArray(
                    page?.content?.about_page?.mission?.icon
                )
                    ? page.content?.about_page?.mission?.icon?.map((image) => ({
                          url: image.url,
                      }))
                    : [{ url: page.content?.about_page?.mission?.icon }],
                vision_image: Array.isArray(
                    page.content?.about_page?.vision?.image
                )
                    ? page.content?.about_page?.vision?.image.map((image) => ({
                          url: image.url,
                      }))
                    : [{ url: page.content?.about_page?.vision?.image }],
                vision_icon: Array.isArray(
                    page.content?.about_page?.vision?.icon
                )
                    ? page.content?.about_page?.vision?.icon.map((image) => ({
                          url: image.url,
                      }))
                    : [{ url: page.content?.about_page?.vision?.icon }],
                icon_1: Array.isArray(
                    page.content?.about_page?.features[0]?.icon
                )
                    ? page.content?.about_page?.features[0]?.icon.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.about_page?.features[0]?.icon }],
                icon_2: Array.isArray(
                    page.content?.about_page?.features[1]?.icon
                )
                    ? page.content?.about_page?.features[1]?.icon.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.about_page?.features[1]?.icon }],
                icon_3: Array.isArray(
                    page.content?.about_page?.features[2]?.icon
                )
                    ? page.content?.about_page?.features[2]?.icon.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.about_page?.features[2]?.icon }],
                icon_4: Array.isArray(
                    page.content?.about_page?.features[3]?.icon
                )
                    ? page.content?.about_page?.features[3]?.icon.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.about_page?.features[3]?.icon }],
                icon_5: Array.isArray(
                    page.content?.about_page?.features[4]?.icon
                )
                    ? page.content?.about_page?.features[4]?.icon.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.about_page?.features[4]?.icon }],
                icon_6: Array.isArray(
                    page.content?.about_page?.features[5]?.icon
                )
                    ? page.content?.about_page?.features[5]?.icon.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.about_page?.features[5]?.icon }],
            };

            form.setFieldsValue({
                about_page: {
                    heading: page.content?.about_page?.heading,
                    description: page?.content?.about_page?.description,
                    mission_description:
                        page?.content?.about_page?.mission?.description,
                    mission_heading:
                        page?.content?.about_page?.mission?.heading,
                    vision_heading: page?.content?.about_page?.vision?.heading,
                    vision_description:
                        page?.content?.about_page?.vision?.description,
                    title_1: page?.content?.about_page?.features[0]?.title,
                    title_2: page?.content?.about_page?.features[1]?.title,
                    title_3: page?.content?.about_page?.features[2]?.title,
                    title_4: page?.content?.about_page?.features[3]?.title,
                    title_5: page?.content?.about_page?.features[4]?.title,
                    title_6: page?.content?.about_page?.features[5]?.title,
                },
            });

            setFormValues(initialFormValues);
            form.setFieldsValue(initialFormValues);
        }
    }, [page?.slug]);

    // useEffect(() => {
    //     form.setFieldsValue(formValues);
    // }, [selectedLang, formValues]);

    return (
        <div>
            <Card>
                {/* <h6 className="py-2 text-secondary header_4">{i18n.t('About Page')}</h6> */}
                <div className="flex flex-wrap justify-start gap-3 mt-4 mb-4">
                    {languages?.docs?.map((l, index) => (
                        <div
                            onClick={() => setSelectedLang(l.code || "en")}
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

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={async (values) => {
                        setLoading(true);
                        const uploadImage = async (imageField, imageName) => {
                            if (values?.[imageField]?.[0]?.originFileObj) {
                                const image = {
                                    file: values[imageField][0].originFileObj,
                                    image_name: imageName,
                                };
                                const { data } = await postSingleImage(image);
                                values[imageField] = data;
                            }
                        };
                        await uploadImage("gallery_1", "about_page");
                        await uploadImage("gallery_2", "about_page");
                        await uploadImage("gallery_3", "about_page");
                        await uploadImage("gallery_4", "about_page");
                        await uploadImage("icon_1", "about_page");
                        await uploadImage("icon_2", "about_page");
                        await uploadImage("icon_3", "about_page");
                        await uploadImage("icon_4", "about_page");
                        await uploadImage("icon_5", "about_page");
                        await uploadImage("icon_6", "about_page");
                        await uploadImage("mission_image", "about_page");
                        await uploadImage("mission_icon", "about_page");
                        await uploadImage("vision_image", "about_page");
                        await uploadImage("vision_icon", "about_page");

                        const formData = {
                            title: values?.title || "About",
                            slug: values?.slug,
                            content: {
                                about_page: {
                                    heading: values?.about_page?.heading,
                                    description:
                                        values?.about_page?.description,
                                    gallary: {
                                        image1: values?.gallery_1,
                                        image2: values?.gallery_2,
                                        image3: values?.gallery_3,
                                        image4: values?.gallery_4,
                                    },
                                    features: [
                                        {
                                            icon: values?.icon_1,
                                            title: values?.about_page?.title_1,
                                        },
                                        {
                                            icon: values?.icon_2,
                                            title: values?.about_page?.title_2,
                                        },
                                        {
                                            icon: values?.icon_3,
                                            title: values?.about_page?.title_3,
                                        },
                                        {
                                            icon: values?.icon_4,
                                            title: values?.about_page?.title_4,
                                        },
                                        {
                                            icon: values?.icon_5,
                                            title: values?.about_page?.title_5,
                                        },
                                        {
                                            icon: values?.icon_6,
                                            title: values?.about_page?.title_6,
                                        },
                                    ],

                                    mission: {
                                        heading:
                                            values?.about_page?.mission_heading,
                                        description:
                                            values?.about_page
                                                ?.mission_description,
                                        image: values?.mission_image,
                                        icon: values?.mission_icon,
                                    },
                                    vision: {
                                        heading:
                                            values?.about_page?.vision_heading,
                                        description:
                                            values?.about_page
                                                ?.vision_description,
                                        image: values?.vision_image,
                                        icon: values?.vision_icon,
                                    },
                                },
                            },
                            content_type: "json",
                        };

                        if (values?.id) {
                            formData.id = page?.id;
                        }
                        const { message, success } = await postPage(formData);
                        if (success) {
                            setLoading(false);
                            getPage({ slug: slug });

                            notification.success({
                                message: message,
                            });
                        } else {
                            setLoading(false);
                            notification.error({
                                message: message,
                            });
                        }
                    }}
                    // onFinish={(values) => console.log(values)}
                >
                    <HiddenInput name="slug" />
                    <HiddenInput name="id" />
                    <div className="p-3 mt-5 border rounded">
                        {languages?.docs?.map((l, index) => (
                            <div
                                key={index}
                                style={{
                                    display:
                                        l.code === (selectedLang || "en")
                                            ? "block"
                                            : "none",
                                }}
                            >
                                <h2 className="mb-4 text-lg font-semibold border-b">
                                    {i18n.t("About Page")}
                                </h2>
                                <label className="text-secondary">
                                    {i18n.t("Heading")}
                                </label>
                                <FormInput
                                    name={["about_page", "heading", l.code]}
                                    placeholder="Enter heading"
                                />
                                <label className="text-secondary">
                                    {i18n.t("Description")}
                                </label>
                                <FormInput
                                    name={["about_page", "description", l.code]}
                                    placeholder="Enter description"
                                    textArea
                                />
                                <h2 className="mb-4 text-lg font-semibold border-b">
                                    {i18n.t("Gallery")}
                                </h2>
                                <div className="flex flex-wrap items-center gap-4">
                                    <MultipleImageInput
                                        name="gallery_1"
                                        label="Image 1"
                                    />
                                    <MultipleImageInput
                                        name="gallery_2"
                                        label="Image 2"
                                    />
                                    <MultipleImageInput
                                        name="gallery_3"
                                        label="Image 3"
                                    />
                                    <MultipleImageInput
                                        name="gallery_4"
                                        label="Image 4"
                                    />
                                </div>
                                <h2 className="mb-4 text-lg font-semibold border-b">
                                    {i18n.t("Features")}
                                </h2>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div>
                                        <MultipleImageInput
                                            name="icon_1"
                                            label="Icon 1"
                                        />
                                        <FormInput
                                            name={[
                                                "about_page",
                                                "title_1",
                                                l.code,
                                            ]}
                                            label="Title 1"
                                            placeholder="Enter title"
                                        />
                                    </div>
                                    <div>
                                        <MultipleImageInput
                                            name="icon_2"
                                            label="Icon 2"
                                        />
                                        <FormInput
                                            name={[
                                                "about_page",
                                                "title_2",
                                                l.code,
                                            ]}
                                            label="Title 2"
                                            placeholder="Enter title"
                                        />
                                    </div>
                                    <div>
                                        <MultipleImageInput
                                            name="icon_3"
                                            label="Icon 3"
                                        />
                                        <FormInput
                                            name={[
                                                "about_page",
                                                "title_3",
                                                l.code,
                                            ]}
                                            label="Title 3"
                                            placeholder="Enter title"
                                        />
                                    </div>
                                    <div>
                                        <MultipleImageInput
                                            name="icon_4"
                                            label="Icon 4"
                                        />
                                        <FormInput
                                            name={[
                                                "about_page",
                                                "title_4",
                                                l.code,
                                            ]}
                                            label="Title 4"
                                            placeholder="Enter title"
                                        />
                                    </div>
                                    <div>
                                        <MultipleImageInput
                                            name="icon_5"
                                            label="Icon 5"
                                        />
                                        <FormInput
                                            name={[
                                                "about_page",
                                                "title_5",
                                                l.code,
                                            ]}
                                            label="Title 5"
                                            placeholder="Enter title"
                                        />
                                    </div>
                                    <div>
                                        <MultipleImageInput
                                            name="icon_6"
                                            label="Icon 6"
                                        />
                                        <FormInput
                                            name={[
                                                "about_page",
                                                "title_6",
                                                l.code,
                                            ]}
                                            label="Title 6"
                                            placeholder="Enter title"
                                        />
                                    </div>
                                </div>
                                <div>
                                    {/* Mission */}
                                    <div>
                                        <h2 className="mb-4 text-lg font-semibold border-b">
                                            {i18n.t("Mission")}
                                        </h2>
                                        <FormInput
                                            name={[
                                                "about_page",
                                                "mission_heading",
                                                l.code,
                                            ]}
                                            label="Heading"
                                            placeholder="Enter Heading"
                                        />
                                        <JodiEditor
                                            label={"Description"}
                                            name={[
                                                "about_page",
                                                "mission_description",
                                                l.code,
                                            ]}
                                            placeholder={
                                                "Write your description in"
                                            }
                                        />
                                        <div className="flex flex-wrap items-center gap-4">
                                            <MultipleImageInput
                                                name="mission_image"
                                                label="Image"
                                            />
                                            <MultipleImageInput
                                                name="mission_icon"
                                                label="Icon"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="mb-4 text-lg font-semibold border-b">
                                            {i18n.t("Vision")}
                                        </h2>
                                        <FormInput
                                            name={[
                                                "about_page",
                                                "vision_heading",
                                                l.code,
                                            ]}
                                            label="Heading"
                                            placeholder="Enter Heading"
                                        />
                                        <JodiEditor
                                            label={"Description"}
                                            name={[
                                                "about_page",
                                                "vision_description",
                                                l.code,
                                            ]}
                                            placeholder={
                                                "Write your description in"
                                            }
                                        />
                                        <div className="flex flex-wrap items-center gap-4">
                                            <MultipleImageInput
                                                name="vision_image"
                                                label="Image"
                                            />
                                            <MultipleImageInput
                                                name="vision_icon"
                                                label="Icon"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        loading={loading}
                        onClick={() => noSelected({ form, setSelectedLang })}
                        className="mt-3 admin-btn"
                    >
                        {i18n.t("Submit")}
                    </button>
                </Form>
            </Card>
        </div>
    );
};

export default AboutPageSetting;
