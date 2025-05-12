import React, { useState } from 'react';
import { useI18n } from '../../providers/i18n';
import { ServiceNotice, serviceNotices } from '../../helpers/backend';
import { useFetch, useTitle } from '../../helpers/hooks';
import { Modal } from 'antd';
import { columnFormatter } from '../../helpers/utils';
import dayjs from 'dayjs';
import bell from '../../../images/bell.png';
import { IoIosEye } from 'react-icons/io';
import { useSite } from '../../context/site';

const Notice = () => {
    const i18n = useI18n();
    const [data, getData] = useFetch(serviceNotices); // Fetch notices list
    const [details, getDetails] = useFetch(ServiceNotice); // Fetch individual notice details
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Notice") + " - " + i18n.t("User"));
    // Show modal and fetch notice details
    const showModal = async (record) => {
        await getDetails({ id: record.id }); // Fetch details dynamically using id
        setSelectedNotice(details?.data); // Update state with fetched details
        setIsModalVisible(true);
    };

    // Close modal and reset state
    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedNotice(null); // Clear selected notice
    };

    // Map fetched data for rendering
    const dataSource = data?.docs?.map((doc, index) => ({
        key: index,
        ...doc,
    })) || [];

    return (
        <div className="w-full h-full p-5">
            {/* Page Header */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
                <h1 className="text-xl font-semibold text-gray-800">
                    {i18n?.t("Service Notice")}
                </h1>
            </div>

            {/* Notices List */}
            <div className="flex flex-wrap gap-4">
                {dataSource.map((notice) => (
                    <div
                        key={notice.key}
                        className="w-full bg-white flex justify-between items-center p-4 rounded-lg border"
                    >
                        <div className="flex items-center gap-4">
                            <div className="shrink-0">
                                <img src={bell} alt="Notice Icon" className="w-14 h-14" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold line-clamp-1">
                                    {columnFormatter(notice?.service?.name)}
                                </h2>
                                <p className='line-clamp-1 break-all'>{columnFormatter(notice?.title)}</p>
                                <p className="text-xs text-gray-400">
                                    {dayjs(notice?.createdAt).format("DD MMM YYYY")}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="bg-secondary hover:bg-white h-fit hover:border-secondary hover:border duration-500 hover:text-secondary text-white rounded-full p-2"
                            onClick={() => showModal(notice)}
                        >
                            <IoIosEye className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                {data?.docs?.length === 0 && (
                    <div className="w-full bg-white flex justify-center items-center p-4 rounded-lg border">
                        <p className="text-lg font-semibold">{i18n?.t("No Notice Found")}</p>
                    </div>
                )}
            </div>

            <Modal
                title={null}
                open={isModalVisible}
                footer={null}
                width={380}
                onCancel={handleCancel}
            >

                    <div className="space-y-8">
                        <div className="flex justify-center items-center">
                            <img src={bell} alt="Notice Icon" className="w-16 h-16" />
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs text-gray-400 block mb-1">{i18n?.t("From")}</p>
                                <h1 className="w-full px-0 py-1 border-b border-gray-300 text-gray-700">
                                    {details?.role}
                                </h1>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 block mb-1">{i18n?.t("Notice Title")}</p>
                                <h1 className="w-full px-0 py-1 border-b border-gray-300 text-gray-700">
                                    {columnFormatter(details?.title)}
                                </h1>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 block mb-1">{i18n?.t("Description")}</p>
                                <h1 className="w-full px-0 py-1 border-b border-gray-300 text-gray-700">
                                    {columnFormatter(details?.description)}
                                </h1>
                            </div>
                        </div>
                    </div>
            </Modal>
        </div>
    );
};

export default Notice;
