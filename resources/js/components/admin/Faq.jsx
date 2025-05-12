import React, { useEffect, useState } from "react";
import {  Form, Modal, Tooltip } from "antd";
import {
    deleteFaq,
    fetchFaq,
    postFaq,
    updateFaq,
} from "../../helpers/backend";
import { useFetch, useTitle } from "../../helpers/hooks";
import Table from "../../components/common/form/table";
import FormButton from "../common/form/form-button";
import { useI18n } from "../../providers/i18n";
import FormInput, { HiddenInput } from "../common/form/input";
import { columnFormatter, noSelected } from "../../helpers/utils";
import { useSite } from "../../context/site";

const Faq = () => {
    const i18n = useI18n();
    let { languages, langCode } = i18n;
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [form] = Form.useForm();

    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Faq") + " - " + i18n.t("Admin"));
    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode])
    const [modalState, setModalState] = useState({
        isOpen: false,
        isEdit: false,
        record: null,
    });

    const [faq, getfaq, { loading }] = useFetch(fetchFaq);

    const handleModalOpen = (isEdit = false, record = null) => {
        setModalState({ isOpen: true, isEdit, record });

        if (record) form.setFieldsValue(record);
    };

    const handleModalClose = () => {
        setModalState({ isOpen: false, isEdit: false, record: null });
        form.resetFields();
    };

    const handleFormSubmit = async (values) => {
        const apiPayload = modalState.isEdit
            ? { ...values, id: modalState.record.id }
            : values;
      modalState.isEdit ? await updateFaq(apiPayload) : await postFaq(apiPayload);
        getfaq();
        handleModalClose();
    };




    const columns = [
        { text: "Question", dataField: "question", formatter: (question) => <span className=''>{columnFormatter(question)}</span> },
        {
            text: "Answer", dataField: "answer",
            formatter: (answer) => <span className=''>{
                <Tooltip title={columnFormatter(answer)?.length > 40 ? columnFormatter(answer)?.slice(0, 40) + '...' : columnFormatter(answer)} placement="topLeft">
                    <span className='cursor-help'>
                        {columnFormatter(answer)?.length > 40 ? columnFormatter(answer)?.slice(0, 40) + '...' : columnFormatter(answer)}
                    </span>
                </Tooltip>
            }</span>,
        },
    ];

    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <Table
                columns={columns}
                data={faq}
                onReload={getfaq}
                loading={loading}
                pagination
                indexed
                action={
                    <button 
                    className="admin-btn"
                    onClick={() => handleModalOpen(false)}>
                        {i18n?.t("Add FAQ")}
                    </button>
                }
                onDelete={deleteFaq}
                onEdit={(record) => handleModalOpen(true, record)}
                title={"FAQ List"}
                i18n={i18n}
            />
            <Modal
                open={modalState.isOpen}
                title={modalState.isEdit ? i18n?.t("Edit Faq") : i18n?.t("Add Faq")}
                width={400}
                onCancel={handleModalClose}
                footer={null}
                className="adminForm"

            >
            <div className="flex flex-wrap justify-start gap-3 mt-4 mb-4">
                    {languages?.docs?.map((l, index) => (
                        <div
                            onClick={() => setSelectedLang(l?.code)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l?.code === selectedLang
                                ? 'bg-teal-blue text-white cursor-pointer'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                                }`}
                            key={index}
                        >
                            {l?.name}
                        </div>
                    ))}
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >

{
                        modalState.isEdit && <HiddenInput name="id" />
                    }

                    {languages?.docs?.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            <FormInput
                                name={['question', l.code]}
                                label={`${i18n?.t('Question')} (${l.name})`}
                                required={true}
                            />
                            <FormInput
                                name={['answer', l.code]}
                                label={`${i18n?.t('Answer')} (${l.name})`}
                                required={true}
                            />
                        </div>
                    ))}

                    <button type="submit" className="mt-2 admin-btn"  onClick={() => noSelected({ form, setSelectedLang })}>
                        {modalState.isEdit ? "Update" : "Submit"}
                    </button>
                </Form>
            </Modal>
        </div>
    );
};

export default Faq;
