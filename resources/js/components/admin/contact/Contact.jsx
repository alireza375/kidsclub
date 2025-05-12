import React from "react";
import { delContact, fetchContact } from "../../../helpers/backend";
import { Tooltip } from "antd";
import Table from "../../common/form/table";
import PageTitle from "../../common/page-title";
import { useFetch, useTitle } from "../../../helpers/hooks";
import { FaEye, FaReplyAll } from "react-icons/fa";
import { useI18n } from "../../../providers/i18n";
import { useNavigate } from "react-router-dom";
import { useSite } from "../../../context/site";

const Contact = () => {
    const [contact, getContact, { loading, error }] = useFetch(fetchContact);
    const navigate = useNavigate();
    const i18n = useI18n();
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Contact") + " - " + i18n.t("Admin"));
    const columns = [
        {
            dataField: "name",
            text: i18n?.t("Name"),
            formatter: (name) => <span className="capitalize">{name}</span>,
        },
        {
            dataField: "email",
            text: i18n?.t("Email"),
            formatter: (email) => <span className="">{email}</span>,
        },
        {
            dataField: "subject",
            text: i18n?.t("Subject"),
            formatter: (subject) => (
                <span className="">
                    {
                        <Tooltip title={subject?.length > 20 ? subject : ""}>
                            <span>
                                {subject?.length > 20
                                    ? subject?.slice(0, 20) + "..."
                                    : subject}
                            </span>
                        </Tooltip>
                    }
                </span>
            ),
        },
        {
            dataField: "id",
            text: i18n?.t("Reply"),
            formatter: (id, data) =>
                data?.status === false ? (
                    <span
                        className="inline-block bg-[#2C9FAF] p-[4px] rounded-[3px] text-white cursor-pointer"
                        onClick={() => editHandleAction(id)}
                        title={i18n?.t("Reply")}
                    >
                        <FaReplyAll />
                    </span>
                ) : (
                    <span
                        className="inline-block bg-green-700 p-[4px] rounded-[3px] text-white cursor-pointer"
                        onClick={() => editHandleAction(id)}
                        title={i18n?.t("View")}
                    >
                        <FaEye />
                    </span>
                ),
        },
    ];
    const editHandleAction = (id) => {
        navigate(`/admin/contacts/${id}`)
    }
    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <PageTitle title={"Contact List"} />
            <Table
                columns={columns}
                data={contact}
                pagination={true}
                noActions={false}
                indexed={true}
                shadow={false}
                onDelete={delContact}
                onReload={getContact}
                error={error}
                loading={loading}
                i18n={i18n}
            />
        </div>
    );
};

export default Contact;
