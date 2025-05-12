import React, { useEffect, useState } from "react";
import { Form} from "antd";
import {

    deleteNewsLetter,
    getNewsLetter,

} from "../../helpers/backend";
import { useFetch, useTitle } from "../../helpers/hooks";
import Table from "../../components/common/form/table";
import { useI18n } from "../../providers/i18n";
import { useSite } from "../../context/site";
import dayjs from "dayjs";

const NewsLetter = () => {
    const i18n = useI18n();
    let { languages, langCode } = i18n;
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [form] = Form.useForm();
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("NewsLetter") + " - " + i18n.t("Admin"));
    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode])
    const [data, getdata, { loading }] = useFetch(getNewsLetter);
    const columns = [
        { text: "created_at", dataField: "created_at", formatter: (_,d) => <span className=''>{dayjs(d?.created_at).format("MMM DD , YYYY")}</span> },
        { text: "Email", dataField: "email", formatter: (_,d) => <span className=''>{d?.email}</span> },
   ];
   return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <Table
                columns={columns}
                data={data}
                onReload={getdata}
                loading={loading}
                pagination
                indexed
                onDelete={deleteNewsLetter}
                title={"NewsLetter List"}
                i18n={i18n}
            />

        </div>
    );
};

export default NewsLetter;
