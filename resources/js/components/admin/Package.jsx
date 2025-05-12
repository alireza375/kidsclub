import React, { useEffect, useState } from "react";
import Table, { TableImage } from "../common/form/table";
import { deleteEnrollPackage, deletePackage, enrollPackageList, fetchAdminPackages, fetchServices, postPackage, postSingleImage, updatePackage } from "../../helpers/backend";
import FormButton from "../common/form/form-button";
import { Form, Modal, notification, Switch } from "antd";
import FormInput, { HiddenInput } from "../common/form/input";
import MultipleImageInput from "../common/form/multiImage";
import FormSelect from "../common/form/select";
import { useFetch, useTitle } from "../../helpers/hooks";
import { useI18n } from "../../providers/i18n";
import { columnFormatter, noSelected } from "../../helpers/utils";
import { useSite } from "../../context/site";

const Package = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const {sitedata,currencySymbol} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Package") + " - " + i18n.t("Admin"));
    let { languages, langCode } = i18n;
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [selectedPackage, setSelectedPackage] = useState("");
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [packages, getpackages, { loading }] = useFetch(fetchAdminPackages);
    const [enrollPackage,getEnrollPackage,{loading:enrollLoading}]=useFetch(enrollPackageList);
    const [service, setService] =useFetch(fetchServices);

    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode])

    const[openTab,setOpenTab]=useState('package');
    const columns = [
        { text: "Name", dataField: "name", formatter: (_,record) => columnFormatter(record?.name) },
        { text: "Price", dataField: "price", formatter: (_,record) => record?.currencySymbol +" "+ record?.price },
        {
            text: "Image",
            dataField: "image",
            formatter: (_, record) => <TableImage url={record?.image} />,
        },
        {
            text: "Status",
            dataField: "is_active",
            formatter: (_, record) => (
                <Switch
                    checkedChildren={"Active"}
                    unCheckedChildren={"Inactive"}
                    defaultChecked ={record.is_active}
                    onChange={async (status) => {
                        const {success,message}=  await  updatePackage({
                            id: record.id,
                            is_active: status,
                        });

                        if(success){
                            notification.success({message:message});
                            getpackages();
                            handleModalClose();
                           }
                           else{
                            notification.error({message:message});

                           }
                    }}
                    className="bg-gray-500"
                />
            ),
        },
    ];
    const columns2 = [
        { text: "Name", dataField: "name", formatter: (_,record) => columnFormatter(record?.package_id?.name) },
        { text: "Price", dataField: "price",formatter: (_,record) => (<span>{currencySymbol}{record?.package_id?.price}</span>) },
        {
            text: 'Services',
            dataField: 'services',
            formatter: (_,features) => (
                <span>
                    {(features?.package_id?.my_services)?.map((feature, index) => (
                        <p key={index}>{columnFormatter(feature)}</p>
                    ))}
                </span>
            ),
        },
        {text: "Payment Method",
        dataField: "payemnt",
        formatter: (_, d) => (
            <div>
                {d?.method}
            </div>
        ),
    },
    {
        text: "Payment Status",
        dataField: "is_paid",
        formatter: (_, d) => (
            <div>
                {d?.is_paid ? <span class='text-green-500'>{i18n?.t("Paid")}</span> : <span class='text-red-500'>{i18n?.t("Unpaid")}</span>}
            </div>
        ),
    },
    {
        text: "Status",
        dataField: "status",
        formatter: (_, d) => (
            <span>{d?.status}</span>
          )}
    ];
    const handleModalClose = () => {
        setIsOpen(false);
        form.resetFields();
        setSelectedPackage("");
        setIsEdit(false);
    };

    const handleFormSubmit = async (values) => {
        values.is_active= isEdit
        ? values.is_active || form.getFieldValue('is_active')
        : true;
        if (values.image?.[0]?.originFileObj) {
            const { data } = await postSingleImage({
                file: values.image[0].originFileObj,
            });
            values.image = data;
        } else {
            values.image = values.image?.[0]?.url || "";
        }

        const apiPayload = isEdit
            ? { ...values, id: values.id }
            : { ...values };

    //    isEdit ? await updatePackage(apiPayload) : await postPackage(apiPayload);
       const postMethod=isEdit ? updatePackage :postPackage;
       const {success,message}=await postMethod (apiPayload);
       if(success){
        notification.success({message:message});
        getpackages();
        handleModalClose();
       }
       else{
        notification.error({message:message});

       }

    };

    const handleEdit = (record) => {
       setIsOpen(true);
       setIsEdit(true);

       form.setFieldsValue({
        ...record,
        service_id: record.service_id?.map((i,index) => ({value:i.id})), // Ensure this is an array
        image: record.image
            ? [
                  {
                      uid: record.id,
                      name: "Uploaded Image",
                      status: "done",
                      url: record.image,
                  },
              ]
            : [],
    });


    }

    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <div className="flex justify-center items-center gap-12 mb-8 border p-2">
                <div
                    onClick={() => setOpenTab("package")}
                    className={`w-full border-2 border-transparent py-2 border-teal-blue cursor-pointer hover:text-white hover:bg-teal-blue text-xl font-nunito duration-300 ease-in-out text-center
                        ${
                            openTab === "package"
                                ? "bg-teal-blue text-white border-teal-blue"
                                : "text-gray-700 border-gray-300"
                        }
                        transition-all`}
                >
                    <h1>{i18n?.t("All Pakages")}</h1>
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
            {
                openTab === "package" ?
                (<Table
                    columns={columns}
                    data={packages}
                    onReload={getpackages}
                    loading={loading}
                    pagination
                    indexed
                    action={
                        <button onClick={() => setIsOpen(true)}
                         className="admin-btn"
                        >
                            {i18n?.t("Add Package")}
                        </button>
                    }
                    onDelete={deletePackage}
                    // onView={handleView}
                    onEdit={(record) => handleEdit(record)}
                    title={"Package"}
                    i18n={i18n}
                />) :(
                    <Table
                columns={columns2}
                data={enrollPackage}
                onReload={getEnrollPackage}
                loading={enrollLoading}
                pagination
                indexed
                title={"Enroll Packages"}
                i18n={i18n}
                onDelete={deleteEnrollPackage}
            />
                )
            }


            <Modal
                open={isOpen}
                title={isEdit ? i18n?.t("Edit Package") : i18n?.t("Add Package")}
                width={600}
                onCancel={handleModalClose}
                footer={null}
                className="adminForm"
            >
                <div className="flex flex-wrap justify-start gap-3 mt-4 mb-4">
                    {languages?.docs?.map((l, index) => (
                        <div
                            onClick={() => setSelectedLang(l?.code)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l?.code === (selectedLang || langCode)
                                ? 'bg-teal-blue text-white cursor-pointer'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                                }`}
                            key={index}
                        >
                            {l?.name}
                        </div>
                    ))}
                </div>
                <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="!admin-switch">
                    {isEdit && <HiddenInput name="id" />}

                    {languages?.docs?.map((l, index) => (
                        <div key={index} style={{ display: l.code === (selectedLang || langCode) ? 'block' : 'none' }}>
                            <FormInput
                                name={['name', l.code]}
                                label={`${i18n?.t('Name')} (${l.name})`}
                                required={true}
                            />



                    <MultipleImageInput
                        name="image"
                        label={i18n?.t("Image")}
                        required
                    />
                    <FormSelect
                        name='service_id'
                        label={i18n.t("select services")}
                        className={'pb-1'}

                        options={
                            service?.docs?.map((item) => ({
                                label:item?.name[l.code] || item?.name[langCode],
                                value: item.id,
                            })) || []
                        }
                        required={true}
                        allowClear
                        multi={true}
                    /> </div> ))}

                    <FormInput
                        name="price"
                        type={"number"}
                        label={i18n?.t("Price")}
                        required
                    />
                          {isEdit && (
                                    <Form.Item
                                        name='is_active'
                                        label='Active'
                                        valuePropName='checked'
                                        initialValue={true}
                                    >
                                        <Switch
                                            checkedChildren='Active'
                                            unCheckedChildren='Inactive'
                                            className='!rounded-full bg-[#505d69] text-black !admin-switch'
                                        />
                                    </Form.Item>
                                )}

                    <button type="submit" onClick={() => noSelected({ form, setSelectedLang })} className="mt-5 admin-btn">
                        {i18n?.t(isEdit ? "Update" : "Submit")}
                    </button>
                </Form>
            </Modal>
        </div>
    );
};

export default Package;
