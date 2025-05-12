import React, { useState, useCallback } from "react";
import { Modal, Form, Empty } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FaTimes, FaTrash } from "react-icons/fa";
import Pagination from "antd/lib/pagination";
import PageTitle from "../common/page-title";
import {
    deleteGallery,
    fetchGalleries,
    postGallery,
} from "../../helpers/backend";
import { useActionConfirm, useFetch, useTitle } from "../../helpers/hooks";
import MultipleImageInput from "../common/form/multiImage";
import FormButton from "../common/form/form-button";
import { useSite } from "../../context/site";
import { useI18n } from "../../providers/i18n";

const Gallery = () => {
    const [data, getData, { loading }] = useFetch(fetchGalleries);
    const [form] = Form.useForm();
    const i18n=useI18n();
    const [viewedImage, setViewedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const {sitedata} = useSite();

    useTitle(sitedata?.title + " | " + i18n.t("Gallery") + " - " + i18n.t("Admin"));
    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getData({ page, limit: pageSize });
    };

    const handleViewImage = useCallback((image) => {
        setViewedImage(image);
    }, []);

    const handleDeleteImage = async (id) => {
        await useActionConfirm(
            deleteGallery,
            { id },
            () => getData({ page: currentPage, limit: pageSize }),
            "Are you sure you want to delete this image?",
            "Yes, Delete"
        );
    };

    const handleImageUpload = async (values) => {
        values.image = values.image[0].originFileObj;
        await postGallery(values);
        getData({ page: currentPage, limit: pageSize });
        setModalVisible(false);
    };

    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <PageTitle title="Gallery" />
            <div className="mb-10">
                <div className="mb-8 flex justify-center">
                    <button
                        className="admin-btn"
                        onClick={() => {
                            form.resetFields();
                            setModalVisible(true);
                        }}
                    >
                        <UploadOutlined />
                        <span>Upload Image</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data?.docs?.map((image) => (
                        <div
                            key={image.id}
                            className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-[300px]"
                        >
                            <div
                                className="aspect-w-16 aspect-h-9 cursor-pointer"
                                onClick={() => handleViewImage(image)}
                            >
                                <img
                                    src={image.image}
                                    alt="Gallery Image"
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                                />
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteImage(image.id);
                                }}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition duration-200"
                            >
                                <FaTrash className="text-sm" />
                            </button>
                        </div>
                    ))}
                </div>

                {data?.totalDocs > 0 && (
                    <Pagination
                         align="center"
                    className="!mt-[50px] body-paginate"
                        current={currentPage}
                        pageSize={pageSize}
                        total={data?.totalDocs}
                        onChange={onPageChange}
                        
                        onShowSizeChange={onPageChange}
                    />
                )}

                {viewedImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-lg p-5 max-w-full max-h-full overflow-auto relative">
                            <div className="max-w-full max-h-[80vh] flex items-center justify-center">
                                <img
                                    src={viewedImage.image}
                                    alt="Viewed Image"
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                />
                            </div>
                            <button
                                onClick={() => setViewedImage(null)}
                                className="absolute top-3 right-3 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-200"
                            >
                                <FaTimes className="text-sm" />
                            </button>
                        </div>
                    </div>
                )}

                <Modal
                    title="Upload New Image"
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleImageUpload}
                    >
                        <MultipleImageInput
                            name="image"
                            label="Image"
                            rules={[
                                {
                                    required: true,
                                    message: "Please upload an image!",
                                },
                            ]}
                        />
                        <FormButton type="submit">Upload</FormButton>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Gallery;
