import React, { useEffect, useState } from 'react';
import { Form } from "antd";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams} from "react-router-dom";
import { useI18n } from "../../../../providers/i18n";
import {  allProductCategorylist, getSingleProduct } from "../../../../helpers/backend";
import ProductForm from "../add/productForm";
import { useFetch, useTitle } from '../../../../helpers/hooks';
import { set } from 'react-hook-form';
import { useSite } from '../../../../context/site';
const AdminEditProduct = () => {
    const {id}=useParams();
    const [form] = Form.useForm();
    const navigate=useNavigate();
    const i18n = useI18n()
     let { languages, langCode } = useI18n();
    const [data, getData] = useFetch(getSingleProduct, {id});
    const [category, getCategory] = useFetch(allProductCategorylist,{});
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [isVarient, setIsVarient] = useState(false);
    const [formData, setFromData] = useState([])
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Edit Product") + " - " + i18n.t("Admin"));
    useEffect(()=>{
    if(id){
        getData({id:id})
    }
    },[id]);
    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode]);

    useEffect(() => {
        if (data) {
            // Map data to match form field structure
            if(data?.variants.length !== 0){
                setIsVarient(true)
            }
            const formData = {
                id: data?.id,
                name: data?.name,
                short_description: data?.short_description,
                description: data?.description,
                discount_type: data?.discount_type,
                discount: data?.discount,
                category: data?.category.id,
                price: parseFloat(data?.price),
                quantity: data?.quantity,
                variants: {
                    property_name: data?.variants[0]?.property_name,
                    property_values: data?.variants[0]?.property_values,
                },
                thumbnail_image: data?.thumbnail_image?.length > 0
                 ? [
                 {
                       uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: data?.thumbnail_image,
                  },
                ]
               : [],
            images: data?.images?.map((img, index) => ({
               uid: `-${index + 1}`,
                name: img,
                status: 'done',
                url: img,
           })),
            };

            // Set the form values
            form.setFieldsValue(formData);
        }
    }, [data?.id, form]);
        return (
          <div className="px-4 flex flex-col gap-4">
          <button className="admin-btn flex items-center gap-1 text-white rounded  w-fit"
              title="Back"
               onClick={() =>window.history.back()}
> {i18n.t("Back")}
            </button>
           <h1 className="text-2xl font-bold my-4">{i18n?.t('Edit Product')}</h1>
            <div className="flex justify-start flex-wrap gap-3">
                {languages?.docs?.map((l, index) => (
                    <button
                        onClick={() => setSelectedLang(l?.code)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l.code === (selectedLang || langCode)
                            ? 'bg-teal-blue text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        key={index}
                    >
                        {l.name}
                    </button>
                ))}
            </div>
           <ProductForm isVarient={isVarient} category={category} setIsVarient={setIsVarient}  data={data} languages={languages} langCode={langCode} selectedLang={selectedLang || langCode} setSelectedLang={setSelectedLang} form={form} formData={formData} setFromData={setFromData} i18n={i18n} router={navigate} productId={id} />
        </div>
    );
};

export default AdminEditProduct;
