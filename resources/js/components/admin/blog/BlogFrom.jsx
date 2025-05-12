import React, { useEffect, useState } from 'react'
import { useI18n } from '../../../providers/i18n';
import { Form, Switch } from 'antd';
import FormInput, { HiddenInput } from '../../common/form/input';
import FormSelect from '../../common/form/select';
import JodiEditor from '../../common/form/jodiEditor';
import MultipleImageInput from '../../common/form/multiImage';
import { useFetch } from '../../../helpers/hooks';
import { fetchBlogCategories, postBlog, postSingleImage, updateBlog } from '../../../helpers/backend';
import { noSelected } from '../../../helpers/utils';
import { useNavigate } from 'react-router-dom';

const BlogFrom = ({isEdit, data}) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [selectedLang, setSelectedLang] = useState();
    const {languages, langCode} = useI18n();
    const i18n = useI18n();
    const [editData, setEditData] = useState(null);
    const [category, getCategory] = useFetch(fetchBlogCategories);
    let imageUrl = '';
    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode])

    useEffect(() => {
        if(isEdit){
            setEditData(data)
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
    })
    const handleSubmit = async (values) => {
        if (values?.image?.[0]?.originFileObj) {
            const image = values?.image[0]?.originFileObj;
            const { data } = await postSingleImage({ file:image, image_name: 'blog' });
            imageUrl = data;
        } else {
            imageUrl = values?.image?.[0]?.url || '';
        }

        const multiLangFields = ['title', 'short_description', 'details'];
        const formattedData = multiLangFields.reduce((acc, field) => {
            acc[field] = {};
            languages.docs.forEach((lang) => {
                if (values[field] && values[field][lang.code]) {
                    acc[field][lang.code] = values[field][lang.code];
                }
            });
            return acc;
        }, {});

        const submitData = {
            id: values?.id,
            ...formattedData,
            category: values.category,
            tags: values.tags,
            add_to_popular: values.add_to_popular,
            published: values.published,
            image: imageUrl,
        };

        editData ? updateBlog(submitData) : postBlog(submitData)
            form.resetFields();
           navigate("/admin/blogs")
    };
  return (
    <div className='p-4 bg-gray-100 min-h-full rounded-md'>
                    <div className='flex justify-end mb-4'>
                        <button className='admin-btn' onClick={() => navigate("/admin/blogs")}>
                            {i18n.t("Back")}
                        </button>
                    </div>
                <div>
                <h1 className='text-2xl font-bold my-4'>{editData ? i18n.t("Update Blog") : i18n.t("Add Blog")}</h1>
                    <div className='flex flex-wrap justify-start gap-3 mt-10'>
                        {languages?.docs?.map((l, index) => (
                            <button
                                onClick={() => setSelectedLang(l.code)}
                                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                                    ? 'bg-teal-blue text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                key={index}
                            >
                                {l.name}
                            </button>
                        ))}
                    </div>

                    <Form layout='vertical' form={form} onFinish={handleSubmit}>
                        <HiddenInput name='id' />
                        <div className='mt-4'>
                            {languages?.docs?.map((l, index) => (
                                <div
                                    key={index}
                                    style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                                >
                                    <FormInput
                                        label={('Title')}
                                        name={['title', l.code]}
                                        required
                                        initialValue={editData?.title?.[l.code] || ''}
                                    />
                                    <div className=' '>
                                        {category && (
                                                                    <div className="Form-select-customization">

                                            <FormSelect
                                                label={i18n?.t('Blog Category')}
                                                name={'category'}
                                                required
                                                initialValue=""
                                                options={category?.docs?.map((cat) => ({
                                                    label: cat?.name[l.code] ?? cat?.name["en"],
                                                    value: cat?.id,
                                                }))}
                                            /></div>
                                        )}

                                    </div>
                                    <FormInput
                                        label={('Short Description')}
                                        name={['short_description', l.code]}
                                        textArea
                                        initialValue={editData?.short_description?.[l.code] || ''}
                                        required
                                    />
                                    <JodiEditor
                                        label={('Details')}
                                        name={['details', l.code]}
                                        required
                                        initialValue={editData?.details?.[l.code] || ''}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                            <Form.Item
                                name="add_to_popular"
                                label={i18n?.t("Add to popular")}
                                valuePropName="checked"
                            >
                                <Switch className="text-black bg-[#505d69] !rounded-full" />
                            </Form.Item>
                            <Form.Item
                                name="published"
                                label={i18n?.t("Published")}
                                valuePropName="checked"
                            >
                                <Switch className="text-black bg-[#505d69] !rounded-full" />
                            </Form.Item>
                            <MultipleImageInput label={("Image")} name={"image"} required />
                        </div>
                        <div className='flex justify-between gap-4 mt-10'>
                            <button type='submit' className="admin-btn" onClick={() => noSelected({ form, setSelectedLang })}>
                                {editData ? i18n.t('Update') : i18n.t('Submit')}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
  )
}

export default BlogFrom
