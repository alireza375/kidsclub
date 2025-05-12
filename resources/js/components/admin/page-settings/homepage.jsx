import { Card, Form, notification } from "antd";
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
import JodiEditor from "../../common/form/jodiEditor";

const HomePageSetting = ({ slug }) => {
    const [form] = Form.useForm();
    const [page, getPage] = useFetch(fetchSinglePage,{});
    const i18n = useI18n();
    const { langCode, languages } = useI18n();
    const [selectedLang, setSelectedLang] = useState(langCode || "en");
    const [formValues, setFormValues] = useState({});
    const [loading,setLoading]=useState(false);
    useEffect(() => {
        getPage({ slug: slug });
        if (page?.id) {
            const initialFormValues = {
                id: page.id,
                title: page.title,
                slug: page?.slug,
                hero_section_image_banner: Array.isArray(
                    page.content?.hero_section?.hero_section_image_banner
                )
                    ? page.content?.hero_section?.hero_section_image_banner.map(
                          (image) => ({ url: image.url })
                      )
                    : [
                          {
                              url: page.content?.hero_section
                                  ?.hero_section_image_banner ,
                          },
                      ]  ,
                hero_section_image_group: Array.isArray(
                    page.content?.hero_section?.hero_section_image_group
                )
                    ? page.content?.hero_section?.hero_section_image_group.map(
                          (image) => ({ url: image.url })
                      )
                    : [
                          {
                              url: page.content?.hero_section
                                  ?.hero_section_image_group,
                          },
                      ],

                about_image: Array.isArray(
                    page.content?.about_section?.about_image
                )
                    ? page?.content?.about_section?.about_image?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.about_section?.about_image }],

                join_section_image: Array.isArray(
                    page.content?.join_section?.join_banner
                )
                    ? page?.content?.join_section?.join_banner?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.join_section?.join_banner }],
                join_section_vector: Array.isArray(
                    page.content?.join_section?.join_image
                )
                    ? page?.content?.join_section?.join_image?.map((image) => ({
                          url: image.url,
                      }))
                    : [{ url: page.content?.join_section?.join_image }],
                join_section2_image: Array.isArray(
                    page.content?.join_section2?.join_image
                )
                    ? page?.content?.join_section2?.join_image?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.join_section2?.join_image }],
                join_section2_vector: Array.isArray(
                    page.content?.join_section2?.join_vector
                )
                    ? page?.content?.join_section2?.join_vector?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.join_section2?.join_vector }],
                join_section3_banner: Array.isArray(
                    page.content?.join_section3?.join_banner
                )
                    ? page?.content?.join_section3?.join_banner?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.join_section3?.join_banner }],
                join_section3_image: Array.isArray(
                    page.content?.join_section3?.join_image
                )
                    ? page?.content?.join_section3?.join_image?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.join_section3?.join_image }],
                faq_image1: Array.isArray(page.content?.faq_section?.faq_image1)
                    ? page?.content?.faq_section?.faq_image1?.map((image) => ({
                          url: image.url,
                      }))
                    : [{ url: page.content?.faq_section?.faq_image1 }],
                google_play: Array.isArray(page.content?.faq_section?.google_play)
                    ? page?.content?.faq_section?.google_play?.map((image) => ({
                          url: image.url,
                      }))
                    : [{ url: page.content?.faq_section?.google_play }],
                app_store: Array.isArray(page.content?.faq_section?.app_store)
                    ? page?.content?.faq_section?.app_store?.map((image) => ({
                          url: image.url,
                      }))
                    : [{ url: page.content?.faq_section?.app_store }],
                contact_image1: Array.isArray(
                    page.content?.contact_section?.contact_image1
                )
                    ? page?.content?.contact_section?.contact_image1?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.contact_section?.contact_image1 }],
                contact_image2: Array.isArray(
                    page.content?.contact_section?.contact_image2
                )
                    ? page?.content?.contact_section?.contact_image2?.map(
                          (image) => ({ url: image.url })
                      )
                    : [{ url: page.content?.contact_section?.contact_image2 }],
            };

            if (Array.isArray(languages?.docs)) {
                languages?.docs?.forEach((lang) => {
                    initialFormValues.hero_section =
                        initialFormValues.hero_section || {};
                    initialFormValues.hero_section.heading =
                        initialFormValues.hero_section.heading || {};
                    initialFormValues.hero_section.heading[lang.code] =
                        page.content?.hero_section?.heading?.[lang.code] || "";
                    initialFormValues.hero_section.welcome_text =
                    initialFormValues.hero_section.welcome_text || {};
                    initialFormValues.hero_section.welcome_text[lang.code] =
                        page.content?.hero_section?.welcome_text?.[lang.code] || "";
                    initialFormValues.hero_section.description =
                        initialFormValues.hero_section.description || {};
                    initialFormValues.hero_section.description[lang.code] =
                        page.content?.hero_section?.description?.[lang.code] ||
                        "";
                   //about section
                    initialFormValues.about_section =
                        initialFormValues.about_section || {};
                    initialFormValues.about_section.heading =
                        initialFormValues.about_section.heading || {};
                    initialFormValues.about_section.heading[lang.code] =
                        page.content?.about_section?.heading?.[lang.code] || "";
                    initialFormValues.about_section.description =
                        initialFormValues.about_section.description || {};
                    initialFormValues.about_section.description[lang.code] =
                        page.content?.about_section?.description?.[lang.code] ||
                        "";
                    initialFormValues.about_section.title =
                        initialFormValues.about_section.title || {};
                    initialFormValues.about_section.title[lang.code] =
                        page.content?.about_section?.title?.[lang.code] || "";
                    //Join Section
                    initialFormValues.join_section =
                        initialFormValues.join_section || {};
                    initialFormValues.join_section.heading =
                        initialFormValues.join_section.heading || {};
                    initialFormValues.join_section.heading[lang.code] =
                        page.content?.join_section?.heading?.[lang.code] || "";
                    initialFormValues.join_section.description =
                        initialFormValues.join_section.description || {};
                    initialFormValues.join_section.description[lang.code] =
                        page.content?.join_section?.description?.[lang.code] ||
                        "";
                    //Join Section2
                    initialFormValues.join_section2 =
                        initialFormValues.join_section2 || {};
                    initialFormValues.join_section2.heading =
                        initialFormValues.join_section2.heading || {};
                    initialFormValues.join_section2.heading[lang.code] =
                        page.content?.join_section2?.heading?.[lang.code] || "";
                    initialFormValues.join_section2.description =
                        initialFormValues.join_section2.description || {};
                    initialFormValues.join_section2.description[lang.code] =
                        page.content?.join_section2?.description?.[lang.code] ||
                        "";
                    initialFormValues.join_section2.welcome_text =
                        initialFormValues.join_section2.welcome_text || {};
                    initialFormValues.join_section2.welcome_text[lang.code] =
                        page.content?.join_section2?.welcome_text?.[lang.code] || "";
                    //Join Section3
                    initialFormValues.join_section3 =
                        initialFormValues.join_section3 || {};
                    initialFormValues.join_section3.heading =
                        initialFormValues.join_section3.heading || {};
                    initialFormValues.join_section3.heading[lang.code] =
                        page.content?.join_section3?.heading?.[lang.code] || "";
                    initialFormValues.join_section3.description =
                        initialFormValues.join_section3.description || {};
                    initialFormValues.join_section3.description[lang.code] =
                        page.content?.join_section3?.description?.[lang.code] ||
                        "";
                        //service section
                        initialFormValues.service_section =
                        initialFormValues?.service_section || {};
                        initialFormValues.service_section.title=initialFormValues.service_section.title || {};
                        initialFormValues.service_section.title[lang?.code]=page?.content?.service_section?.title[lang?.code] || "";

                        initialFormValues.service_section.heading=initialFormValues.service_section.heading || {};
                        initialFormValues.service_section.heading[lang.code]=page?.content?.service_section?.heading[lang.code] || "";
                        //event section
                        initialFormValues.event_section =
                        initialFormValues?.event_section || {};
                        initialFormValues.event_section.title=initialFormValues.event_section.title || {};
                        initialFormValues.event_section.title[lang?.code]=page?.content?.event_section?.title[lang?.code] || "";
                        initialFormValues.event_section.heading=initialFormValues.event_section.heading || {};
                        initialFormValues.event_section.heading[lang.code]=page?.content?.event_section?.heading[lang.code] || "";
                       //testimonial section
                        initialFormValues.testimonial_section =
                        initialFormValues?.testimonial_section || {};
                        initialFormValues.testimonial_section.title=initialFormValues.testimonial_section.title || {};
                        initialFormValues.testimonial_section.title[lang?.code]=page?.content?.testimonial_section?.title[lang?.code] || "";

                        initialFormValues.testimonial_section.heading=initialFormValues.testimonial_section.heading || {};
                        initialFormValues.testimonial_section.heading[lang.code]=page?.content?.testimonial_section?.heading[lang.code] || "";

                        initialFormValues.testimonial_section.description=initialFormValues.testimonial_section.description || {};
                        initialFormValues.testimonial_section.description[lang.code]=page?.content?.testimonial_section?.description[lang.code] || "";
                        //faq section
                        initialFormValues.faq_section =
                        initialFormValues?.faq_section || {};
                        initialFormValues.faq_section.heading=initialFormValues.faq_section.heading || {};
                        initialFormValues.faq_section.heading[lang.code]=page?.content?.faq_section?.heading[lang.code] || "";
                        initialFormValues.faq_section.title=initialFormValues.faq_section.title || {};
                        initialFormValues.faq_section.title[lang.code]=page?.content?.faq_section?.title[lang.code] || "";
                        initialFormValues.google_play_url=initialFormValues.google_play_url || "",
                        initialFormValues.google_play_url=page?.content?.google_play_url || "",
                        initialFormValues.app_store_url=initialFormValues.app_store_url || "",
                        initialFormValues.app_store_url=page?.content?.app_store_url || "",
                        //teacher section
                        initialFormValues.teacher_section =
                        initialFormValues?.teacher_section || {};
                        initialFormValues.teacher_section.title=initialFormValues.teacher_section.title || {};
                        initialFormValues.teacher_section.title[lang?.code]=page?.content?.teacher_section?.title[lang?.code] || "";
                        initialFormValues.teacher_section.heading=initialFormValues.teacher_section.heading || {};
                        initialFormValues.teacher_section.heading[lang.code]=page?.content?.teacher_section?.heading[lang.code] || "";
                        initialFormValues.teacher_section.description=initialFormValues.teacher_section.description || {};
                        initialFormValues.teacher_section.description[lang.code]=page?.content?.teacher_section?.description[lang.code] || "";
                        //pricing section
                        initialFormValues.pricing_section =
                        initialFormValues?.pricing_section || {};
                        initialFormValues.pricing_section.title=initialFormValues.pricing_section.title || {};
                        initialFormValues.pricing_section.title[lang?.code]=page?.content?.pricing_section?.title[lang?.code] || ""
                        initialFormValues.pricing_section.heading=initialFormValues.pricing_section.heading || {};
                        initialFormValues.pricing_section.heading[lang.code]=page?.content?.pricing_section?.heading[lang.code] || ""
                        initialFormValues.pricing_section.description=initialFormValues.pricing_section.description || {};
                        initialFormValues.pricing_section.description[lang.code]=page?.content?.pricing_section?.description[lang.code] || "";
                        //gallery section
                        initialFormValues.gallery_section =
                        initialFormValues?.gallery_section || {};
                        initialFormValues.gallery_section.title=initialFormValues.gallery_section.title || {};
                        initialFormValues.gallery_section.title[lang?.code]=page?.content?.gallery_section?.title[lang?.code] || "";

                        initialFormValues.gallery_section.heading=initialFormValues.gallery_section.heading || {};
                        initialFormValues.gallery_section.heading[lang.code]=page?.content?.gallery_section?.heading[lang.code] || "";

                        initialFormValues.gallery_section.description=initialFormValues.gallery_section.description || {};
                        initialFormValues.gallery_section.description[lang.code]=page?.content?.gallery_section?.description[lang.code] || "";
                        //shop section
                        initialFormValues.shop_section =
                        initialFormValues?.shop_section || {};
                        initialFormValues.shop_section.title=initialFormValues.shop_section.title || {};
                        initialFormValues.shop_section.title[lang?.code]=page?.content?.shop_section?.title[lang?.code] || "";

                        initialFormValues.shop_section.heading=initialFormValues.shop_section.heading || {};
                        initialFormValues.shop_section.heading[lang.code]=page?.content?.shop_section?.heading[lang.code] || "";

                        initialFormValues.shop_section.description=initialFormValues.shop_section.description || {};
                        initialFormValues.shop_section.description[lang.code]=page?.content?.shop_section?.description[lang.code] || "";
                        //blog section
                        initialFormValues.blog_section =
                        initialFormValues?.blog_section || {};
                        initialFormValues.blog_section.title=initialFormValues.blog_section.title || {};
                        initialFormValues.blog_section.title[lang?.code]=page?.content?.blog_section?.title[lang?.code] || "";

                        initialFormValues.blog_section.heading=initialFormValues.blog_section.heading || {};
                        initialFormValues.blog_section.heading[lang.code]=page?.content?.blog_section?.heading[lang.code] || "";

                });
            } else {
                console.error("languages is not an array:", languages);
            }
            setFormValues(initialFormValues);
            form.setFieldsValue(initialFormValues);
        }
    }, [page?.slug]);
    
    return (
        <div>
            <Card>
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
                        values?.hero_section_image_banner && await uploadImage(
                            "hero_section_image_banner",
                            "hero_section"
                        );
                        values?.hero_section_image_group && await uploadImage(
                            "hero_section_image_group",
                            "hero_section"
                        );
                        values?.about_image && await uploadImage("about_image", "about_section");
                        values?.join_banner && await uploadImage("join_banner", "join_section");
                        values?.faq_image1 && await uploadImage("faq_image1", "faq_section");
                        values?.google_play && await uploadImage("google_play", "faq_section");
                        values?.app_store && await uploadImage("app_store", "faq_section");
                        values?.join_section_image && await uploadImage("join_section_image", "join_section");
                        values?.join_section_vector && await uploadImage(
                            "join_section_vector",
                            "join_section"
                        );
                       values?.join_section2_image &&  await uploadImage(
                            "join_section2_image",
                            "join_section2"
                        );
                       values?.join_section3_image && await uploadImage(
                            "join_section3_image",
                            "join_section3"
                        );
                       values?.join_section3_banner && await uploadImage(
                            "join_section3_banner",
                            "join_section3"
                        );

                        let formData = {
                            title: "Home",
                            slug: values?.slug ,
                            content: {
                                hero_section: {
                                    heading: values?.hero_section?.heading,
                                    welcome_text:values?.hero_section?.welcome_text,
                                    description:
                                        values?.hero_section?.description,
                                    hero_section_image_banner:
                                        values.hero_section_image_banner ||
                                        undefined,
                                    hero_section_image_group:
                                        values.hero_section_image_group ||
                                        undefined,
                                },
                                service_section:{
                                    title: values?.service_section?.title,
                                    heading:
                                        values?.service_section?.heading,
                                },
                                event_section:{
                                    title: values?.event_section?.title,
                                    heading:
                                        values?.event_section?.heading,
                                },
                                testimonial_section:{
                                    title: values?.testimonial_section?.title,
                                    heading:
                                        values?.testimonial_section?.heading,
                                    description:
                                        values?.testimonial_section?.description,
                                },
                                about_section: {
                                    title: values?.about_section?.title,
                                    heading: values?.about_section?.heading,
                                    description:
                                        values?.about_section?.description,
                                    about_image: values?.about_image,
                                    about_vector: values?.about_vector,
                                },
                                join_section: {
                                    heading: values?.join_section?.heading,
                                    description:
                                        values?.join_section?.description,
                                    join_banner: values?.join_section_image,
                                    join_image: values?.join_section_vector,
                                },
                                join_section2: {
                                    heading: values?.join_section2?.heading,
                                    welcome_text:values?.join_section2?.welcome_text,
                                    description:
                                        values?.join_section2?.description,
                                    join_image: values?.join_section2_image,
                                },
                                join_section3: {
                                    heading: values?.join_section3?.heading,
                                    description:
                                        values?.join_section3?.description,
                                    join_banner: values?.join_section3_banner,
                                    join_image:  values?.join_section3_image,
                                },
                                faq_section: {
                                    title: values?.faq_section?.title,
                                    heading:
                                        values?.faq_section?.heading,
                                    faq_image1: values?.faq_image1,
                                    google_play: values?.google_play,
                                    app_store: values?.app_store,
                                },
                                teacher_section:{
                                    title: values?.teacher_section?.title,
                                    heading:
                                        values?.teacher_section?.heading,
                                    description:
                                        values?.teacher_section?.description,
                                },
                                pricing_section:{
                                    title: values?.pricing_section?.title,
                                    heading:
                                        values?.pricing_section?.heading,
                                    description:
                                        values?.pricing_section?.description,
                                },
                                gallery_section:{
                                    title: values?.gallery_section?.title,
                                    heading:
                                        values?.gallery_section?.heading,
                                    description:
                                        values?.gallery_section?.description,
                                },
                                shop_section:{
                                    title: values?.shop_section?.title,
                                    heading:
                                        values?.shop_section?.heading,
                                    description:
                                        values?.shop_section?.description,
                                },
                                blog_section:{
                                    title: values?.blog_section?.title,
                                    heading:
                                        values?.blog_section?.heading

                                },
                                google_play_url:values?.google_play_url,
                                app_store_url:values?.app_store_url
                            },
                            content_type: "json",
                        };

                        if (values?.id) {
                            formData.id = page?.id;
                        }
                        const { message, success } = await postPage(formData);
                        if (success) {
                            setLoading(false);
                           getPage({ slug: slug })
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
                >
                    <HiddenInput name="slug" />
                    <HiddenInput name="id" />
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

                    {/* hero section */}
                    <div className="border p-3 rounded">
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
                                <h2 className="font-semibold text-lg mb-4 border-b">
                                    {i18n.t("Hero Section")}
                                </h2>
                                <MultipleImageInput
                                name="hero_section_image_banner"
                                label="Banner"

                            />
                                <label className="text-secondary">
                                    {i18n.t("Welcome Text")}
                                </label>
                                <FormInput
                                    name={["hero_section", "welcome_text", l.code]}
                                    placeholder="Enter Welcome Text"

                                />



                                <label className="text-secondary">
                                    {i18n.t("Heading Text")}
                                </label>
                                <FormInput
                                    name={["hero_section", "heading", l.code]}
                                    placeholder="Enter heading"

                                />

                                <JodiEditor
                                    label={"Description Text"}
                                    name={[
                                        "hero_section",
                                        "description",
                                        l.code,
                                    ]}
                                    placeholder={"Write your description in"}


                                />
                            </div>
                        ))}
                        <div className="flex gap-4">

                            <MultipleImageInput
                                name="hero_section_image_group"
                                label="Image"

                            />
                        </div>
                    </div>

                    {/* about section */}
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
                                <h2 className="font-semibold text-lg mb-4 border-b">
                                    {i18n.t("About Section")}
                                </h2>

                                <MultipleImageInput
                                        name="about_image"
                                        label="About Section Image"

                                    />
                                <label className="text-secondary">
                                    {i18n.t("About title Text")}
                                </label>
                                <FormInput
                                    name={["about_section", "title", l.code]}
                                    placeholder="Enter heading"

                                />

                                <label className="text-secondary">
                                    {i18n.t("About Heading Text")}
                                </label>
                                <FormInput
                                    name={["about_section", "heading", l.code]}
                                    placeholder="Enter heading"

                                />

                                <JodiEditor
                                    label={"About Description Text"}
                                    name={[
                                        "about_section",
                                        "description",
                                        l.code,
                                    ]}

                                />

                            </div>
                        ))}
                    </div>

                    {/* service section */}
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
                                <h2 className="font-semibold text-lg mb-4 border-b">
                                    {i18n.t("Service Section")}
                                </h2>

                                <label className="text-secondary">
                                    {i18n.t("Title")}
                                </label>
                                <FormInput
                                    name={["service_section","title", l.code]}
                                    placeholder="Enter title"

                                />

                               <label className="text-secondary">
                                    {i18n.t(" Heading ")}
                                </label>
                                <FormInput
                                    name={["service_section","heading", l.code]}
                                    placeholder="Enter heading"

                                />

                           </div>
                        ))}
                    </div>


                    {/* Join Section */}
                    <div className="border p-3 rounded mt-5" >
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
                                        <h2 className="font-semibold text-lg mb-4 border-b">
                                            {i18n.t(
                                                `Join Us Section `
                                            )}
                                        </h2>
                                        <div className="flex gap-4">
                                            <MultipleImageInput
                                                name={`join_section_image`}
                                                label="Banner"

                                            />

                                        </div>
                                        <label className="text-secondary">
                                            {i18n.t("Heading")}
                                        </label>
                                        <FormInput
                                            name={["join_section", "heading", l.code]}
                                            placeholder="Enter heading"

                                        />

                                        <JodiEditor
                                            label={"Description"}
                                            name={[
                                                "join_section",
                                                "description",
                                                l.code,
                                            ]}

                                        />

                                    </div>
                                ))}
                    </div>

                    {/* Event section */}
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
                                <h2 className="font-semibold text-lg mb-4 border-b">
                                    {i18n.t("Event Section")}
                                </h2>

                                <label className="text-secondary">
                                    {i18n.t("Title")}
                                </label>
                                <FormInput
                                    name={["event_section","title", l.code]}
                                    placeholder="Enter title"

                                />

                               <label className="text-secondary">
                                    {i18n.t(" Heading ")}
                                </label>
                                <FormInput
                                    name={["event_section","heading", l.code]}
                                    placeholder="Enter heading"

                                />

                           </div>
                        ))}
                    </div>

                    {/* Adventure Section */}
                    <div className="border p-3 rounded mt-5" >
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
                                        <h2 className="font-semibold text-lg mb-4 border-b">
                                            {i18n.t(
                                                `Adventure Section`
                                            )}
                                        </h2>
                                        <MultipleImageInput
                                                name={`join_section2_image`}
                                                label="Image"

                                            />
                                         <label className="text-secondary">
                                            {i18n.t("Welcome Text")}
                                        </label>
                                        <FormInput
                                            name={["join_section2", "welcome_text", l.code]}
                                            placeholder="Enter Welcome Text"

                                        />
                                        <label className="text-secondary">
                                            {i18n.t("Heading")}
                                        </label>
                                        <FormInput
                                            name={["join_section2", "heading", l.code]}
                                            placeholder="Enter heading"

                                        />
                                        <JodiEditor
                                            label={"Description"}
                                            name={[
                                                "join_section2",
                                                "description",
                                                l.code,
                                            ]}

                                        />
                                    </div>
                                ))}
                    </div>
                        {/* Testimonial section */}
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
                                <h2 className="font-semibold text-lg mb-4 border-b">
                                    {i18n.t("Testimonial Section")}
                                </h2>

                                <label className="text-secondary">
                                    {i18n.t("Title")}
                                </label>
                                <FormInput
                                    name={["testimonial_section","title", l.code]}
                                    placeholder="Enter title"

                                />

                               <label className="text-secondary">
                                    {i18n.t(" Heading ")}
                                </label>
                                <FormInput
                                    name={["testimonial_section","heading", l.code]}
                                    placeholder="Enter heading"

                                />
                                   <JodiEditor
                                    label={" Description "}
                                    name={[
                                        "testimonial_section",
                                        "description",
                                        l.code,
                                    ]}

                                />

                           </div>
                        ))}
                    </div>


                    {/* FAQ section */}
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
                                <h2 className="font-semibold text-lg mb-4 border-b">
                                    {i18n.t("FAQ Section")}
                                </h2>
                                <label className="text-secondary">
                                    {i18n.t("Title")}
                                </label>
                                <FormInput
                                    name={["faq_section","title", l.code]}
                                    placeholder="Enter title"

                                />

                               <label className="text-secondary">
                                    {i18n.t(" Heading ")}
                                </label>
                                <FormInput
                                    name={["faq_section","heading", l.code]}
                                    placeholder="Enter heading"

                                />

                                <div className="flex gap-4">
                                    <MultipleImageInput
                                        name="faq_image1"
                                        label="Image"

                                    />
                                </div>
                                <div>
                                <FormInput
                                    label={"Google Play Store Link"}
                                    name={"google_play_url"}
                                    placeholder="Enter google play link "

                                />
                                   <FormInput
                                    label={"App Store Link"}
                                    name={ "app_store_url"}
                                    placeholder="Enter app store url"

                                />
                                </div>
                            </div>
                        ))}
                    </div>
                  {/* Teacher section */}
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
                                <h2 className="font-semibold text-lg mb-4 border-b">
                                    {i18n.t("Teacher Section")}
                                </h2>

                                <label className="text-secondary">
                                    {i18n.t("Title")}
                                </label>
                                <FormInput
                                    name={["teacher_section","title", l.code]}
                                    placeholder="Enter title"

                                />

                               <label className="text-secondary">
                                    {i18n.t(" Heading ")}
                                </label>
                                <FormInput
                                    name={["teacher_section","heading", l.code]}
                                    placeholder="Enter heading"

                                />
                                   <JodiEditor
                                    label={" Description "}
                                    name={[
                                        "teacher_section",
                                        "description",
                                        l.code,
                                    ]}

                                />

                           </div>
                        ))}
                    </div>
                       {/* Enroll Section */}
                       <div className="border p-3 rounded mt-5" >
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
                                        <h2 className="font-semibold text-lg mb-4 border-b">
                                            {i18n.t(
                                                "Enroll Section"
                                            )}
                                        </h2>
                                        <label className="text-secondary">
                                            {i18n.t("Heading")}
                                        </label>
                                        <FormInput
                                            name={["join_section3", "heading", l.code]}
                                            placeholder="Enter heading"

                                        />

                                        <JodiEditor
                                            label={"Description"}
                                            name={[
                                                "join_section3",
                                                "description",
                                                l.code,
                                            ]}

                                        />
                                        <div className="flex gap-4">
                                            <MultipleImageInput
                                                name={`join_section3_image`}
                                                label="Image"

                                            />


                                        </div>
                                    </div>
                                ))}
                       </div>
                         {/* Pricing section */}
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
                                <h2 className="font-semibold text-lg mb-4 border-b">
                                    {i18n.t("Pricing Section")}
                                </h2>

                                <label className="text-secondary">
                                    {i18n.t("Title")}
                                </label>
                                <FormInput
                                    name={["pricing_section","title", l.code]}
                                    placeholder="Enter title"

                                />

                               <label className="text-secondary">
                                    {i18n.t(" Heading ")}
                                </label>
                                <FormInput
                                    name={["pricing_section","heading", l.code]}
                                    placeholder="Enter heading"

                                />
                                   <JodiEditor
                                    label={" Description "}
                                    name={[
                                        "pricing_section",
                                        "description",
                                        l.code,
                                    ]}

                                />

                           </div>
                        ))}
                    </div>
                         {/* gallery section */}
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
                                <h2 className="font-semibold text-lg mb-4 border-b">
                                    {i18n.t("Gallery Section")}
                                </h2>

                                <label className="text-secondary">
                                    {i18n.t("Title")}
                                </label>
                                <FormInput
                                    name={["gallery_section","title", l.code]}
                                    placeholder="Enter title"

                                />

                               <label className="text-secondary">
                                    {i18n.t(" Heading ")}
                                </label>
                                <FormInput
                                    name={["gallery_section","heading", l.code]}
                                    placeholder="Enter heading"

                                />
                                   <JodiEditor
                                    label={" Description "}
                                    name={[
                                        "gallery_section",
                                        "description",
                                        l.code,
                                    ]}

                                />

                           </div>
                        ))}
                    </div>
                          {/* shop section */}
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
                                <h2 className="font-semibold text-lg mb-4 border-b">
                                    {i18n.t("Shop Section")}
                                </h2>

                                <label className="text-secondary">
                                    {i18n.t("Title")}
                                </label>
                                <FormInput
                                    name={["shop_section","title", l.code]}
                                    placeholder="Enter title"

                                />

                               <label className="text-secondary">
                                    {i18n.t(" Heading ")}
                                </label>
                                <FormInput
                                    name={["shop_section","heading", l.code]}
                                    placeholder="Enter heading"

                                />
                                   <JodiEditor
                                    label={" Description "}
                                    name={[
                                        "shop_section",
                                        "description",
                                        l.code,
                                    ]}

                                />

                           </div>
                        ))}
                    </div>
                          {/* blog section */}
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
                                <h2 className="font-semibold text-lg mb-4 border-b">
                                    {i18n.t("Blog Section")}
                                </h2>

                                <label className="text-secondary">
                                    {i18n.t("Title")}
                                </label>
                                <FormInput
                                    name={["blog_section","title", l.code]}
                                    placeholder="Enter title"

                                />

                               <label className="text-secondary">
                                    {i18n.t(" Heading ")}
                                </label>
                                <FormInput
                                    name={["blog_section","heading", l.code]}
                                    placeholder="Enter heading"

                                />


                           </div>
                        ))}
                        </div>

                    <button
                        type="submit"
                        onClick={() => noSelected({ form, setSelectedLang })}
                        className="mt-2.5 admin-btn"
                        loading={loading}
                    >
                        {i18n?.t("Submit")}
                    </button>
                </Form>
            </Card>
        </div>
    );
};

export default HomePageSetting;
