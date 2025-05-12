import React, { useEffect, useState } from 'react'
import { useI18n } from '../../providers/i18n';
import {  Form, Modal, Switch } from 'antd';
import { useAction, useActionConfirm, useFetch, useTitle } from '../../helpers/hooks';
import { delSingleuser, fetchCoaches, fetchUsers, postCoach, postSingleImage, updateUser, updateUserStatus } from '../../helpers/backend';
import Table, { TableImage } from '../common/form/table';
import FormInput, { HiddenInput } from '../common/form/input';
import MultipleImageInput from '../common/form/multiImage';
import FormButton from '../common/form/form-button';
import PhoneInput from 'react-phone-number-input/input';
import PhoneNumberInput from '../common/form/phoneNumberInput';
import Avatar from '../common/Avatar';
import dayjs from 'dayjs';
import { useSite } from '../../context/site';

const Users = () => {
    const i18n = useI18n();
    let {  langCode } = i18n;
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchUsers);
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Users") + " - " + i18n.t("Admin"));
    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode]);

    const [modalState, setModalState] = useState({
        isOpen: false,
        isEdit: false,
        record: null,
    });

    const [viewModalState, setViewModalState] = useState({
        isOpen: false,
        record: null,
    });


    const handleModalClose = () => {
        setModalState({ isOpen: false, isEdit: false, record: null });
        form.resetFields();
    };

    const handleView = (record) => {
        setViewModalState({ isOpen: true, record });
    };

    const handleViewClose = () => {
        setViewModalState({ isOpen: false, record: null });
    };

    const handleFormSubmit = async (values) => {
        const apiPayload = modalState.isEdit
            ? { ...values, id: modalState.record.id }
            : values;

        return useAction( postCoach, apiPayload, () => {
            getData();
            handleModalClose();
        });
    };

    const columns = [
        {
            text: "name",
            dataField: "name",
            sort: true,
        },
        {
            text: "Image",
            dataField: "image",
            formatter: (_, d) => d?.image ? <TableImage url={d?.image} /> : <Avatar classes='w-10 h-10' name={d?.name}></Avatar>,
        },
        {
            text: "Email",
            dataField: "email",
            sort: true,
        },
        {
            text: "Join Date",
            dataField: "created_at",
            formatter: (_, d) => dayjs(d?.created_at).format("MMM DD , YYYY"),

        },
        {
            text: 'Status', dataField: 'status', formatter: (_, d) => <Switch
                checkedChildren={i18n?.t("Active")}
                unCheckedChildren={i18n?.t("Inactive")}
                checked={d?.status}
                onChange={async (e) => {
                    await useActionConfirm(updateUserStatus, { id: d.id, status: e }, getData, ('Are you sure you want to change the status?'), 'Yes, Change');
                }}
                className='bg-gray-500'
            />
        }
    ];
  return (
    <div className="min-h-full p-4 bg-gray-100 rounded-md">
    <Table
        columns={columns}
        data={data}
        onReload={getData}
        loading={loading}
        pagination
        indexed
        onDelete={delSingleuser}
        onView={handleView}
        title={"Users List"}
        i18n={i18n}
    />

    <Modal
        open={modalState.isOpen}
        title={
        modalState?.isEdit ? "Edit Coach" : "Add Coach"
        }
            onCancel={handleModalClose}
        footer={null}
        className="adminForm"
    >

        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            {modalState.isEdit && <HiddenInput name="id" />}
            <FormInput
                name="name"
                label={i18n?.t("name")}
                required={true}
            />

            <PhoneNumberInput
                name="phone"
                type={"number"}
                label={i18n?.t("phone")}
                required={true}
            />
            <FormInput
                name="email"
                type={"email"}
                label={i18n?.t("email")}
                required={true}
            />
            <FormInput
                name="password"
                label={i18n?.t("password")}
                required={true}
            />


            <FormButton   type="submit" className="mt-2" >
                {modalState.isEdit ? "Update" : "Submit"}
            </FormButton>
        </Form>
    </Modal>

    {/* View Modal */}
    <Modal
        open={viewModalState.isOpen}
        title={i18n?.t("View User")}
        onCancel={handleViewClose}
        footer={null}
        className="adminView"
    >
        {viewModalState.record && (
            <div className="flex flex-col gap-4 p-4">
    {/* Name Section */}
    <div className="p-4 rounded-lg shadow-md bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">{i18n?.t("Name")}:</h3>
        <p className="text-gray-700">{viewModalState.record.name}</p>
    </div>

    {/* Email Section */}
    <div className="p-4 rounded-lg shadow-md bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">{i18n?.t("Email")}:</h3>
        <p className="text-gray-700">{viewModalState.record.email}</p>
    </div>

    {/* Phone Section */}
    <div className="p-4 rounded-lg shadow-md bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">{i18n?.t("Phone")}:</h3>
        <p className="text-gray-700">{viewModalState.record.phone}</p>
    </div>

    {/* Image Section */}
    <div className="p-4 rounded-lg shadow-md bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">{i18n?.t("Image")}:</h3>
        <img
            src={viewModalState.record.image}
            alt={viewModalState.record.name}
            className="object-cover w-full rounded-lg h-60"
        />
    </div>

    {/* Child Section */}
    <div className="p-4 rounded-lg shadow-md bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">{i18n?.t("Children")}:</h3>
        {viewModalState.record.children.data?.length > 0 ? (
            <div className="mt-2 space-y-4">
                {viewModalState.record.children.data.map((child, index) => (
                    <div
                        key={index}
                        className="p-3 bg-white border border-gray-200 rounded-md shadow"
                    >
                        <h4 className="font-medium text-gray-800 text-md">
                            {i18n?.t("Child Name")}: {child.name}
                        </h4>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-600">{i18n?.t("No children found.")}</p>
        )}
    </div>
</div>

        )}
    </Modal>
</div>
  )
}

export default Users
