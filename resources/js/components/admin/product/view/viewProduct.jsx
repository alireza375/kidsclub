import { Image } from 'antd';
import React, { useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { getSingleProduct } from '../../../../helpers/backend';
import { useParams } from 'react-router-dom';
import { columnFormatter, getStatusClass } from '../../../../helpers/utils';
import { DetailTable } from '../../../common/form/table';
import { useFetch, useTitle } from '../../../../helpers/hooks';
import { useI18n } from '../../../../providers/i18n';
import { useSite } from '../../../../context/site';
const ViewProduct = () => {
    const i18n = useI18n()
    const {id}=useParams();
    const [data, getData] = useFetch(getSingleProduct, {id}, false)
    useEffect(() => {
        getData({ id: id})
    }, [id])
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("View Product") + " - " + i18n.t("Admin"));
    return (
        <div className='p-4 bg-gray-100 min-h-full rounded-md'>
            <button className="ml-4 bg-teal-blue px-3 py-1 flex items-center gap-1 text-white rounded w-fit"
                title="Back" onClick={() => window.history.back()}>
                <FaArrowLeft /> {i18n?.t("Back")}
            </button>
            <div className="mt-4 mb-4  p-4 grid md:grid-cols-2 gap-2">

                <DetailTable
                    title={i18n?.t("Product Information")}
                    columns={[
                        {
                            text: 'Status', dataIndex: 'is_active', formatter: (_, d) => <span
                                className={getStatusClass(d?.is_active ? "active" : "inactive")}
                            >
                                {d?.is_active ? `${i18n?.t('Active')}` : `${i18n?.t('Inactive')}`}
                            </span>
                        },
                        { text: 'Title', dataIndex: 'title', formatter: (_, d) => columnFormatter(d?.name) },
                        { text: 'Price', dataIndex: 'price', formatter: (_, d) => d?.currencySymbol + " " + columnFormatter(d?.name)},
                        { text: 'Quantity', dataIndex: 'quantity' },
                        { text: 'Category', dataIndex: 'category', formatter: (_, d) => columnFormatter(d?.category?.name) },
                        { text: 'Short Description', dataIndex: 'short_description', formatter: (_, d) => columnFormatter(d?.short_description) },
                    ]}
                    data={data} />
                <div className='bg-white p-4' >
                    <h3 className="text-lg font-semibold mb-2">{i18n?.t("Thumbnail Images")}</h3>
                    <Image src={data?.thumbnail_image} alt={data?.name} className='!w-[120px] !h-[120px] object-fill' />
                    <h3 className="text-lg font-semibold my-2 mt-3">{i18n?.t("Gallery Images")}</h3>
                    <div className='flex gap-2 items-center flex-wrap'>
                        {
                            data?.images?.map((d,index) => <Image src={d} alt={data?.name} className='!w-[120px] !h-[120px] object-fill' key={index}/>)
                        }
                    </div>
                </div>
            </div>
            <div className='mt-4 p-4 bg-white'>
                {
                    data?.variants?.length > 0 ? (<>
                        <h3 className="text-lg font-semibold mb-2">{i18n?.t("Variants")}</h3>
                        <div className='overflow-x-auto '>
                            <table className='lg:w-1/2 w-full table-auto border-collapse'>
                                <thead>
                                    <tr className='bg-gray-200'>
                                        <th className='px-4 py-2 text-left'>{i18n?.t("Property Name")}</th>
                                        <th className='px-4 py-2 text-left'>{i18n?.t("Property Value")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.variants?.map((variant, index) => (
                                        <tr key={index} className='border-b'>
                                            <td className='px-4 py-2'>
                                                {columnFormatter(variant?.property_name)}
                                                
                                            </td>
                                            <td className='px-4 py-2 flex flex-wrap'>
                                            {
                                                variant?.property_values?.map((item, index) => (
                                                    <span key={index} className='px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 mr-2'>
                                                        {columnFormatter(item)}
                                                    </span>
                                                ))
                                            }
                                            </td>
                                         
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </>) : (<div><h3 className="text-lg font-semibold my-2">{i18n?.t("No variants available")}</h3></div>)
                }
                <h3 className="text-lg font-semibold mb-2 mt-4">{i18n?.t("Product Details")}</h3>
                <div dangerouslySetInnerHTML={{ __html: columnFormatter(data?.description) }} style={{ whiteSpace: 'pre-line' }} />
            </div>
        </div>
    );
};

export default ViewProduct;
