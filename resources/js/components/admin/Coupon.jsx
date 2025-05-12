import React, { useState } from 'react'
import { useI18n } from '../../providers/i18n';
import { Form, Modal, Switch } from 'antd';
import { useAction, useFetch, useTitle } from '../../helpers/hooks';
import { delCupon, fetchCupons, postCupon, updateCupon } from '../../helpers/backend';
import PageTitle from '../common/page-title';
import FormInput, { HiddenInput } from '../common/form/input';
import Table from '../common/form/table';
import FormButton from '../common/form/form-button';
import FormSelect from '../common/form/select';
import FormDatePicker from '../common/form/date_picker';
import dayjs from 'dayjs';
import { useSite } from '../../context/site';

const Coupon = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchCupons);
    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Coupon") + " - " + i18n.t("Admin"));
    const columns = [
        {
            text: i18n?.t('Name'),
            dataField: 'name',
            formatter: (_, d) => <div>{d?.name}</div>,
        },
        {
            text: i18n?.t('Code'),
            dataField: 'code',
            formatter: (_, d) => <div>{d?.code}</div>,
        },
        {
            text: i18n?.t('Discount'),
            dataField: 'discount',
            formatter: (_, d) => <div>{d?.discount}</div>,
        },
        {
            text: i18n?.t('Type'),
            dataField: 'type',
            formatter: (_, d) => <div>{d?.type}</div>,
        },
        {
            text: i18n?.t('Usage limit per user'),
            dataField: 'usage_limit_per_user',
            formatter: (_, d) => <div>{d?.usage_limit_per_user}</div>,
        },
        {
            text: i18n?.t('Minimum order amount'),
            dataField: 'minimum_order_amount',
            formatter: (_, d) => <div>{d?.minimum_order_amount}</div>,
        },
        {
            text: i18n?.t('Expire at'),
            dataField: 'expire_at',
            formatter: (_, d) => <div>{dayjs(d?.expire_at).format('YYYY-MM-DD')}</div>,
        },
        {
            text: i18n?.t('Status'),
            dataField: 'status',
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t('Active')}
                    unCheckedChildren={i18n?.t('Inactive')}
                    checked={d?.status}
                    onChange={async (e) => {
                        await useAction(updateCupon, { id: d.id, status: e }, () => getData());
                    }}
                    className='bg-gray-500'
                />
            ),
        },

    ]

    const handleSubmit = async (values) => {
        const submitData = {
            id: values?.id,
            name: values?.name,
            code: values?.code,
            discount: values?.discount,
            type: values?.type,
            usage_limit_per_user: values?.usage_limit_per_user,
            minimum_order_amount: values?.minimum_order_amount,
            expire_at: dayjs(values?.expire_at).format('YYYY-MM-DD'),
            status: values?.status,
        }

        return useAction(edit ? updateCupon : postCupon, submitData, () => {
            setOpen(false);
            getData();
            form.resetFields();
        })
    }
  return (
    <div className='p-4 bg-gray-100 min-h-full rounded-md'>
    <PageTitle title={'Coupon List'} />
    <Table
        action={
            <button
             className="admin-btn"
                onClick={() => {
                    form.resetFields();
                    setOpen(true);
                }}
            >
                {i18n?.t('Add Coupon')}
            </button>
        }
        onEdit={(values) => {
            setTimeout(() => {
                form.setFieldsValue({
                    ...values,
                    id: values?.id,
                    expire_at: dayjs(values?.expire_at),
                    status: values?.status === 'Active' || values?.status === true,
                    name: values?.name,
                    code: values?.code,
                    discount: values?.discount,
                    type: values?.type,
                    usage_limit_per_user: values?.usage_limit_per_user,
                    minimum_order_amount: values?.minimum_order_amount,
                });
            }, 0);

            setEdit(true);
            setOpen(true);
        }}

        data={data}
        columns={columns}
        indexed
        pagination
        onReload={getData}
        loading={loading}
        onDelete={delCupon}
        i18n={i18n}
    />

    <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={edit ? i18n?.t('Edit Coupon') : i18n?.t('Add Coupon')}
        footer={null}
        destroyOnClose
        width={700}
        className="adminForm"
    >
        <Form
            layout='vertical'
            form={form}
            onFinish={handleSubmit}
        >
            {edit && <HiddenInput name="id" />}
            <div className="grid grid-cols-2 gap-4">
                <FormInput name="name" label={i18n?.t('Name')} required={true}/>
                <FormInput name="code" label={i18n?.t('Code')} required={true}/>
                <FormInput name="discount" type="number" label={i18n?.t('Discount')} required={true}/>
                <div className="Form-select-customization">

                <FormSelect name="type" type="number" label={i18n?.t('Type')} required={true}
                    options={[
                        { label: i18n?.t('Percentage'), value: 'percentage' },
                        { label: i18n?.t('Flat'), value: 'flat' },
                    ]}
                /></div>
                <FormInput required={true} name="usage_limit_per_user" type="number" label={i18n?.t('Usage limit per user')} />
                <FormInput required={true} name="minimum_order_amount" type="number" label={i18n?.t('Minimum order amount')} />
                <FormDatePicker required={true} name="expire_at" label={i18n?.t('Expire at')} placeholder={i18n?.t('Expire at')} />
                <Form.Item
                    name="status"
                    label={i18n?.t('Status')}
                    valuePropName="checked"
                    rules={[{required:true}]}
                >
                    <Switch className="text-black bg-[#505d69] !rounded-full" />
                </Form.Item>

            </div>
            <FormButton className="mt-5" type="submit">{i18n?.t('Submit')}</FormButton>
        </Form>
    </Modal>
</div>
  )
}

export default Coupon
