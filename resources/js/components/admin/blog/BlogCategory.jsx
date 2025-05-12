import React, { useEffect, useState } from 'react'
import { useI18n } from '../../../providers/i18n';
import { deleteBlogCategory, fetchBlogCategories, postBlogCategory, updateBlogCategory } from '../../../helpers/backend';
import PageTitle from '../../common/page-title';
import Table from '../../common/form/table';
import { Form, Modal } from 'antd';
import FormInput, { HiddenInput } from '../../common/form/input';
import FormButton from '../../common/form/form-button';
import { useAction, useFetch } from '../../../helpers/hooks';
import { columnFormatter, noSelected } from '../../../helpers/utils';

const BlogCategory = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchBlogCategories);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState();
    const [open, setOpen] = useState(false);
    const [formData, setFromData] = useState([])

    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode])

    const columns = [
        {
            text: "Name",
            dataField: "name",
            formatter: (value) => columnFormatter(value),
        },
    ];

    const handleSubmit = (values) => {
        let formattedData = {};
        for (let i = 0; i < values.length; i++) {
            const ele = values[i];
            formattedData[ele?.lang] = ele?.value
        }
        return useAction(
            values?.id ? updateBlogCategory : postBlogCategory,
            {
                id: values?.id,
                name: values?.name,
            },
            () => {
                setOpen(false);
                getData();
            }
        );
    };

    return (
        <div>
            <PageTitle title="Blog Categories" />
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
                        }}
                    >
                        {i18n.t("Add Category")}
                    </button>
                }
                onEdit={(values) => {
                    form.setFieldsValue({
                        ...values,
                    });
                    setOpen(true);
                    setIsEdit(true);
                }}
                onDelete={deleteBlogCategory}
                indexed
                pagination
                i18n={i18n}
            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={i18n.t(isEdit ? "Edit Category" : "Add Category")}
                footer={null}
                destroyOnClose={true}
                className='adminForm'
            >
                <div className="flex justify-start flex-wrap gap-3">
                    {languages?.docs?.map((l, index) => (
                        <button
                            onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            key={index}
                        >
                            {l.name}
                        </button>
                    ))}
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className='mt-5'
                >
                    {isEdit && <HiddenInput name="id" />}
                    {languages?.docs.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            <FormInput
                                name={['name', l.code]}
                                label={('Name')}
                                placeholder={i18n.t('Name')}
                                key={index}
                                required
                                onBlur={(e) => {
                                    if (formData?.length === 0) {
                                        setFromData([{ lang: selectedLang, value: e.target.value }])
                                    } else {
                                        const uniqueData = formData?.filter((data) => data?.lang !== selectedLang)
                                        const moreData = [...uniqueData, { lang: selectedLang, value: e.target.value }]
                                        setFromData(moreData)
                                    }
                                }}
                            />
                        </div>
                    ))}
                    <button type='submit' onClick={() => noSelected({ form, setSelectedLang })} className="admin-btn">{i18n.t("Submit")}</button>
                </Form>
            </Modal>
        </div>
    );
};

export default BlogCategory;