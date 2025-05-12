import React, { useEffect, useState } from 'react'
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../common/page-title';
import Table, { TableImage } from '../../common/form/table';
import { Form, Modal, Switch, Tooltip } from 'antd';
import FormInput, { HiddenInput } from '../../common/form/input';
import FormButton from '../../common/form/form-button';
import { useAction, useActionConfirm, useFetch } from '../../../helpers/hooks';
import { columnFormatter, noSelected } from '../../../helpers/utils';
import { useNavigate } from 'react-router-dom';
import { deleteBlog, fetchBlogCategories, fetchBlogs, postBlog, postSingleImage, togglePopularBlog, togglePublishBlog, updateBlog } from '../../../helpers/backend';



const AllBlog = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchBlogs);
    const [editData, setEditData] = useState(null);
    const {languages, langCode} = useI18n();
    const [category, getCategory] = useFetch(fetchBlogCategories);


    const handleEdit = (record) => {
        setEditData(record);
        setOpen(true);
    };

    const handleAddNew = () => {
        form.resetFields();
        setEditData(null);
        setOpen(true);
    };

    useEffect(() => {
        getCategory();
    }, []);

    useEffect(() => {
        if (editData) {
            form.setFieldsValue({
                ...editData,
                category: editData?.category?.id,
                tags: editData?.tags?.map((tag) => tag.id),
                image: editData?.image
                    ? [
                        {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: editData?.image,
                        },
                    ]
                    : [],
            });
        }
    }, [editData]);

    const columns = [
        {
            text: 'Image',
            dataField: 'image',
            formatter: (_, d) => (
                <div className='flex space-x-1'>
                    <TableImage url={d?.image} />
                </div>
            ),
        },
        {
            text: 'Title',
            dataField: 'title',
            formatter: (title) => (
                <span className=''>
                    <Tooltip title={columnFormatter(title)?.length > 30 ? columnFormatter(title) : ''}>
                        <span className='cursor-help'>
                            {title[langCode]?.length > 30
                                ? columnFormatter(title)?.slice(0, 30) + '...'
                                : columnFormatter(title)}
                        </span>
                    </Tooltip>
                </span>
            ),
        },
        {
            text: 'Category',
            dataField: 'category',
            formatter: (_, d) => <span>{columnFormatter(d?.category?.name)}</span>,
        },
        {
            text: 'Status',
            dataField: 'published',
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t('Active')}
                    unCheckedChildren={i18n?.t('Inactive')}
                    checked={d?.published}
                    onChange={async (e) => {
                        await useActionConfirm(togglePublishBlog, { id: d.id }, getData, 'Are you sure you want to change published status?', 'Yes, Change');
                    }}
                    className='bg-gray-500'
                />
            ),
        },
        {
            text: 'Popular',
            dataField: 'add_to_popular',
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t('Active')}
                    unCheckedChildren={i18n?.t('Inactive')}
                    checked={d?.add_to_popular}
                    onChange={async (e) => {
                        await useActionConfirm(togglePopularBlog, { id: d.id }, getData, 'Are you sure you want to change add popular status?', 'Yes, Change');
                    }}
                    className='bg-gray-500'
                />
            ),
        },
    ];


    return (
        <div>
            <PageTitle title='Blog List' />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                onDelete={deleteBlog}
                action={
                    <button 
                    className="admin-btn"
                    onClick={() => navigate(`/admin/blog/add`)}>
                        {i18n?.t('Add New')}
                    </button>
                }
                onEdit={(data) => navigate(`/admin/blog/edit/${data?.id}`)}
                onView={(data) => navigate(`/admin/blog/view/${data?.id}`)}
                indexed
                pagination
                langCode={langCode}
                i18n={i18n}
            />
           
        </div>
    );
};

export default AllBlog;
