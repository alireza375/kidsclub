import React, { useState } from "react";
import { Form, Modal, Switch } from "antd";
import {
    deleteCurrency,
    fetchCurrency,
    postCurrency,
    updateCurrency,
} from "../../helpers/backend";
import { useAction, useActionConfirm, useFetch, useTitle } from "../../helpers/hooks";
import Table from "../../components/common/form/table";
import { useI18n } from "../../providers/i18n";
import FormInput, { HiddenInput } from "../common/form/input";
import FormSelect from "../common/form/select";
import PageTitle from "../common/page-title";
import { useSite } from "../../context/site";

const Currency = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchCurrency);
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n?.t("Currencies") + " - " + i18n?.t("Admin"));
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const columns = [
        { text: i18n?.t('Name'), dataField: 'name' },
        { text: i18n?.t('Symbol'), dataField: 'symbol' },
        { text: i18n?.t('Code'), dataField: 'code' },
        { text: i18n?.t('Placement'), dataField: 'placement' },
        { text: i18n?.t('Rate'), dataField: 'rate' },
        {
            text: i18n?.t('Default'),
            dataField: 'default',
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t('Default')}
                    unCheckedChildren={i18n?.t('Not Default')}
                    checked={d?.default}
                    onChange={async (e) => {
                        await useActionConfirm(
                            updateCurrency,
                            { id: d.id, default: e },
                            () => getData(),
                            i18n?.t('Are you sure you want to change default status?'),
                            'Yes, Change'
                        );

                    }}
                    className='bg-gray-500' />
            ),
        },
    ];

    return (
        <div className='p-4 bg-gray-100 min-h-full rounded-md'>
        <PageTitle title='Currency List' />
        <Table
            columns={columns}
            data={data}
            loading={loading}
            onReload={getData}
            action={
                <button
                className="admin-btn"
                    onClick={() => {
                        form.resetFields();
                        setOpen(true);
                        setIsEdit(false);
                    }}>
                    {i18n?.t('Add New')}
                </button>
            }
            onEdit={(values) => {
                form.resetFields();
                form.setFieldsValue({
                    ...values,
                });
                setOpen(true);
                setIsEdit(true);
            }}
            onDelete={deleteCurrency}
            indexed
            i18n={i18n}
        />

        <Modal
            open={open}
            onCancel={() => setOpen(false)}
            title={isEdit ? i18n?.t('Edit Currency') : i18n?.t('Add Currency')}
            footer={null}
            className="adminForm"
        >
            <Form
                form={form}
                layout='vertical'
                onFinish={(values) => {
                    return useAction(
                        values?.id ? updateCurrency : postCurrency,
                        {
                            ...values,
                        },
                        () => {
                            setOpen(false);
                            getData();
                        }
                    );
                }}
            >
                {isEdit && <HiddenInput name='id' />}
                <FormInput label={('Name')} name='name' required />
                <FormInput label={('Symbol')} name='symbol' required />
                <FormInput label={('Code')} name='code' required />
                <div className="Form-select-customization">
                 <FormSelect
                    name='placement'
                    label={i18n?.t("Select a placement")}
                    required={true}
                    placeholder={i18n?.t("Select a placement")}
                    options={[
                        { label: i18n?.t("Before"), value: 'Before' },
                        { label: i18n?.t("After"), value: 'After' },
                    ]}
                /></div>
                <FormInput label={'Rate'} name='rate' type='number' required />
                <button type='submit' className='mt-2.5 admin-btn'>{isEdit ? i18n?.t('Update') : i18n?.t('Submit')}</button>
            </Form>
        </Modal>
    </div>
    );
};

export default Currency;
