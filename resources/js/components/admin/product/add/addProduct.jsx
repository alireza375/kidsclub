import React from 'react';
import { Form } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../../../providers/i18n";
import { FaArrowLeft } from "react-icons/fa6";
import { useFetch, useTitle } from "../../../../helpers/hooks";
// import { allProductCategory } from "../../../../helpers/backend";
import ProductForm from './productForm';
import { allProductCategorylist, fetchAllProduct } from '../../../../helpers/backend';
import { useSite } from '../../../../context/site';
const AddProduct = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const i18n = useI18n()
    let { languages, langCode } = useI18n();
    const [data, getData] = useFetch(fetchAllProduct);
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [formData, setFromData] = useState([])
    const [isVarient, setIsVarient] = useState(false);
    const [category, getCategory] = useFetch(allProductCategorylist,{});
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Add Product") + " - " + i18n.t("Admin"));
    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode])

    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <button className="admin-btn flex items-center gap-1 text-white rounded w-fit"
                title="Back" onClick={() => window.history.back()}>
                <FaArrowLeft /> {i18n?.t("Back")}
            </button>
            <h1 className="text-2xl font-bold my-4">{i18n?.t("Add Product")}</h1>
            <div className="flex justify-start flex-wrap gap-3">
                {languages?.docs?.map((l, index) => (
                    <button
                        onClick={() => setSelectedLang(l.code)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l.code === (selectedLang || langCode
                        )
                            ? 'bg-teal-blue text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        key={index}
                    >
                        {l.name}
                    </button>
                ))}
            </div>
            <ProductForm category={category} data={data} isVarient={isVarient} setIsVarient={setIsVarient}  languages={languages} langCode={langCode} selectedLang={selectedLang || langCode} setSelectedLang={setSelectedLang} form={form} formData={formData} setFromData={setFromData} i18n={i18n} router={navigate} />
        </div>
    );
};

export default AddProduct;
