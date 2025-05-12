import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useI18n } from "../../../providers/i18n";
import { Button, Card, Form, Input, message } from "antd";
import { fetchContactDetail, replyContact } from "../../../helpers/backend";
import { HiOutlineMailOpen } from "react-icons/hi";
import { HiddenInput } from "../../common/form/input";
import { useFetch, useTitle } from "../../../helpers/hooks";
import { useEffect } from "react";
import TextArea from "antd/es/input/TextArea";
import FormButton from "../../common/form/form-button";
import dayjs from "dayjs";
import { useSite } from "../../../context/site";

const ContactReply = () => {
    const i18n = useI18n()
    const params = useParams()
    const [form] = Form.useForm();
    const [contactMsg, getcontactMsg] = useFetch(fetchContactDetail, {}, false)
    const [loading , setLoading] = useState(false);
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Contact Reply") + " - " + i18n.t("Admin"));
    useEffect(() => {
        if (params?.id) {
            getcontactMsg({
                id: params?.id
            })
        }
    }, [params?.id])

    useEffect(() => {
        if (contactMsg?.email) {
            form.setFieldsValue({
                id: contactMsg?.id,
                email: contactMsg?.email,
                subject: contactMsg?.subject || `${i18n?.t('Reply From Admin')}`,
                message: contactMsg?.reply?.message || ``,
            })
        }
    }, [contactMsg?.email])

    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <Card title={i18n?.t('Contact Us SMS Reply')} className={'shadow-sm'}>
                <div className="flex justify-between lg:flex-row flex-col gap-x-8 mt-8 font-nunito">
                    <div className="flex flex-col lg:w-[680px] ">
                        <div className='bg-secondary_gray relative rounded'>
                            <div className='h-12 bg-gray-200'>
                                <div className='absolute w-16 h-16 bg-teal-blue shadow-md rounded flex items-center justify-center text-white -top-5'>
                                    <span> <HiOutlineMailOpen size={35} /> </span>
                                </div>
                                <span className='capitalize ml-20 text-[18px] font-bold'>
                                    {i18n?.t("View Quote Details Information")}
                                </span>
                            </div>
                            <div className='px-[5%] py-[3%] bg-gray-200 rounded flex flex-col space-y-2'>
                                <p className='text-[14px]'>{i18n?.t("Status")} :
                                    {contactMsg?.status == false ? <span className='bg-yellow-500 text-white px-2 py-1 rounded ml-2'>
                                        {i18n?.t('Pending')}
                                    </span> : <span className='bg-green-500 text-white px-2 py-1 rounded ml-2'>
                                        {i18n?.t('Replied')}
                                    </span>}
                                </p>
                                <p className='text-[14px]'>{i18n?.t("Client Name")} : {contactMsg?.name}</p>
                                <p className='text-[14px]'>{i18n?.t("Client Email")} : {contactMsg?.email}</p>
                                <p className='text-[14px]'>{i18n?.t("Client Phone")} : {contactMsg?.phone}</p>
                                <p className='text-[14px]'>{i18n?.t("Subject")} : {contactMsg?.subject}</p>
                                <p className='text-[14px]'>{i18n?.t("Date")} : {dayjs(contactMsg?.created_at).format('MMM D, YYYY h:mm A')} </p>
                                <p className='text-[14px]'>{i18n?.t("Reply")} : { contactMsg?.reply?.message && dayjs(contactMsg?.updated_at).format('MMM D, YYYY h:mm A')} </p>
                                <p className='text-[14px]'>{i18n?.t("Subject")} : {contactMsg?.subject}</p>
                                <p className='text-[14px]'>{i18n?.t("Message")} :</p>
                                <div className='px-[4%] py-[2%] rounded bg-gray-50 text-[14px] text-justify'>
                                    {contactMsg?.message}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:mt-0 mt-8 w-full">
                        <div className='bg-gray-200 relative rounded'>
                            <div className='h-12'>
                                <div className='absolute w-16 h-16 bg-teal-blue shadow-md rounded flex items-center justify-center text-white -top-5'>
                                    <span> <HiOutlineMailOpen size={35} /> </span>
                                </div>
                                <span className='capitalize ml-20 text-[18px] font-bold'>
                                    {i18n?.t("Query")}
                                </span>
                            </div>
                            <div className='p-[2%] bg-gray-200 rounded'>
                                <div className='bg-gray-50 px-[4%] py-[2%] rounded shadow'>
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={async (values) => {
                                            setLoading(true)
                                            let payload = {
                                                id: contactMsg?.id,
                                                email: contactMsg?.email,
                                                subject: contactMsg?.subject,
                                                message: values?.message
                                            }
                                            const res = await replyContact(payload)
                                            if (res?.success === true) {
                                                setLoading(false)
                                                message.success(res?.message);
                                                getcontactMsg({
                                                    id: params?.id
                                                })
                                            } else {
                                                setLoading(false)
                                                message.error(res?.message);
                                            }
                                        }}
                                        autoComplete="off"
                                    >
                                        <HiddenInput name="id" />
                                        <Form.Item
                                            name="email"
                                            label={i18n?.t('Email To')}
                                        >
                                            <Input disabled={contactMsg?.status === true} />
                                        </Form.Item>
                                        <Form.Item name="subject" label={i18n?.t('Subject')} >
                                            <Input disabled={contactMsg?.status === true} />
                                        </Form.Item>
                                        <Form.Item name="message" label={i18n?.t('Message')} className='mb-3' >
                                            <TextArea type='text-area' disabled={contactMsg?.status === true} />
                                        </Form.Item>
                                        {
                                            contactMsg?.status === false &&
                                            <FormButton loading={loading} type="submit" className="!w-fit !py-[6px]" >
                                                {i18n?.t('Send')}
                                            </FormButton>
                                        }
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ContactReply;