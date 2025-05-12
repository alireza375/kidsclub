import React, { useState, useEffect } from "react";
import {
    Badge,
    Button,
    Card,
    Modal,
    Form,
    Input,
    Switch,
    Pagination,
    Empty,
    Skeleton,
    message,
} from "antd";
import { BiPencil } from "react-icons/bi";
import { BsTrash2 } from "react-icons/bs";
import { useI18n } from "../../providers/i18n";
import {
    deleteBlog,
    fetchBlogCategories,
    fetchBlogs,
    postBlog,
    postSingleImage,
    updateBlog,
} from "../../helpers/backend";
import { useAction, useActionConfirm, useFetch, useTitle } from "../../helpers/hooks";
import FormInput, { HiddenInput } from "../common/form/input";
import FormSelect from "../common/form/select";
import MultipleImageInput from "../common/form/multiImage";
import FormButton from "../common/form/form-button";
import JodiEditor from "../common/form/jodiEditor";
import { columnFormatter, noSelected } from "../../helpers/utils";
import { useSite } from "../../context/site";

// Single Component for Blog Management
export default function BlogManagement() {
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchBlogs);
    const [category, getCategory] = useFetch(fetchBlogCategories);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [editData, setEditData] = useState(null);
    const [selectedLang, setSelectedLang] = useState();
    const i18n = useI18n();
    const { languages, langCode } = i18n;
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const { sitedata } = useSite();
    const [isEdit, setIsEdit] = useState(false);

    useTitle(
        sitedata?.title +
            " | " +
            i18n.t("Blog Management") +
            " - " +
            i18n.t("Coach")
    );

    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getData({ page, limit: pageSize });
    };

    // Modal Handlers
    const openModal = (post) => {
        setIsModalVisible(true);
        form.resetFields(); // Reset form fields when opening the modal
        if (post?.id) {
            setEditData(post);
            setIsEdit(true);
        } else {
            setIsEdit(false);
            setEditData(null);
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setCurrentPost({});
        setEditData({});
        setIsEdit(false);
        form.resetFields();
    };

    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode]);

    // Delete Post
    const handleDelete = async (postId) => {
        await useActionConfirm(deleteBlog, { id: postId }, () => {
            getData();
        });
    };

    useEffect(() => {
        if (isEdit && editData !== null) {
            form.setFieldsValue({
                ...editData,
                category: editData?.category?.id,
                tags: editData?.tags?.map((tag) => tag.id),
                image: editData?.image
                    ? [
                          {
                              uid: "-1",
                              name: "image.png",
                              status: "done",
                              url: editData?.image,
                          },
                      ]
                    : [],
            });
        } else {
            form.resetFields();
            setIsEdit(false);
            setEditData(null);
        }
    }, [editData, isEdit]);

    // Handle Form Submit
    const handleFormSubmit = async (values) => {
        let imageUrl = "";
        if (values?.image?.[0]?.originFileObj) {
            const image = values?.image[0]?.originFileObj;
            const { data } = await postSingleImage({
                file: image,
                image_name: "blog",
            });
            imageUrl = data;
        } else {
            imageUrl = values?.image?.[0]?.url || "";
        }

        const multiLangFields = ["title", "short_description", "details"];
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
      return useAction(isEdit?updateBlog:postBlog,submitData, () => {
        getData();
        form.resetFields();
        setIsModalVisible(false);
    })


    };

    // Blog Post Card Component
    const BlogPostCard = ({ post }) => (
        <Card>
            <div className="flex-col items-center gap-4 p-2 md:flex md:flex-row">
                <img
                    src={post?.image}
                    alt={columnFormatter(post?.title)}
                    width={80}
                    height={80}
                    className="object-cover rounded-lg"
                />
                <div className="flex-grow text-secondary font-nunito">
                    <h3 className="text-lg font-medium line-clamp-1">
                        {columnFormatter(post?.title)}
                    </h3>
                    <p className="mt-1 text-sm font-light line-clamp-1">
                        {columnFormatter(post?.short_description)?.slice(0, 40)}
                        {columnFormatter(post?.short_description)?.length > 100 && "..."}
                    </p>
                </div>
                <div className="flex items-center gap-2 mt-5 md:mt-0 md:justify-center">
                    <Badge className="px-3 py-2 bg-gray-100 rounded-md whitespace-nowrap">
                        {columnFormatter(post?.category?.name)}
                    </Badge>
                    <Badge
                        className={`${
                            post.published ? "bg-green-300" : "bg-yellow-300"
                        } px-3 py-2 rounded-md text-white`}
                    >
                        {post.published ? "Published" : "Pending"}
                    </Badge>
                </div>
                <div className="absolute flex items-center gap-2 md:relative md:top-0 md:left-0 top-2 right-2">
                    <button
                        className="p-4 text-2xl text-gray-500 hover:text-primary"
                        onClick={() => openModal(post)}
                    >
                        <BiPencil />
                    </button>
                        <button
                            className="p-4 text-2xl text-gray-500 hover:text-primary"
                            onClick={() => handleDelete(post.id)}
                        >
                            <BsTrash2 />
                        </button>
                </div>
            </div>
        </Card>
    );

    // Blog Modal Component
    return (
        <div className="max-w-4xl p-6 mx-auto space-y-6 rounded-md shadow-dashboard">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{i18n?.t("Blog")}</h1>
                <button
                    className="px-6 py-2 text-white duration-300 rounded bg-secondary hover:bg-primary"
                    onClick={() => {
                        form.resetFields();
                        setIsModalVisible(true);
                        setIsEdit(false);
                    }}
                >
                    {i18n?.t("Create Blog")}
                </button>
            </div>

            {/* Blog Posts */}
            <div className="space-y-4">
                {loading ? (
                    <div className="my-2">
                        <Skeleton />
                    </div>
                ) : (
                    data?.docs?.map((post) => (
                        <BlogPostCard key={post.id} post={post} />
                    ))
                )}
                {data?.docs?.length === 0 && (
                    <div className="text-center text-gray-600">
                        <Empty />
                    </div>
                )}
            </div>
            {data?.totalDocs > 0 && (
                <Pagination
                    align="center"
                    className="!mt-[50px] body-paginate"
                    current={currentPage}
                    pageSize={pageSize}
                    total={data?.totalDocs}
                    onChange={onPageChange}
                />
            )}

            {/* Modal */}
            <Modal
                width={800}
                title={isEdit ? i18n?.t("Update Blog") : i18n?.t("Add Blog")}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setIsEdit(false);
                    form.resetFields();
                }}
                footer={null}
                className="adminForm"
            >
                <div>
                    <div className="flex flex-wrap justify-start gap-3 mt- 10">
                        {languages?.docs?.map((l, index) => (
                            <button
                                onClick={() => setSelectedLang(l.code)}
                                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                                    l.code === selectedLang
                                        ? "bg-primary text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                                key={index}
                            >
                                {l.name}
                            </button>
                        ))}
                    </div>

                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleFormSubmit}
                    >
                        <HiddenInput name="id" />
                        <div className="mt-4">
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
                                    <FormInput
                                        label={"Title"}
                                        name={["title", l.code]}
                                        required

                                    />

                                    <FormInput
                                        label={"Short Description"}
                                        name={["short_description", l.code]}
                                        textArea

                                        required
                                    />
                                    <JodiEditor
                                        label={"Details"}
                                        name={["details", l.code]}
                                        required

                                    />
                                </div>
                            ))}
                        </div>
                        <div className="">
                            {category && (
                                <div className="Form-select-customization">
                                    <FormSelect
                                        label={i18n?.t("Blog Category")}
                                        name={"category"}
                                        required
                                        options={category?.docs?.map((cat) => ({
                                            label:
                                                cat?.name[langCode] ??
                                                cat?.name["en"],
                                            value: cat?.id,
                                        }))}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-5 md:grid-cols-3">
                            <MultipleImageInput
                                label={"Images"}
                                name={"image"}
                                required
                            />
                        </div>
                        <div className="flex justify-between gap-4 mt-10">
                        <FormButton
                                type="submit"
                           onClick={() => noSelected({ form, setSelectedLang })}
                            >
                                {isEdit ? i18n.t("Update") : i18n.t("Submit")}
                            </FormButton>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
}
