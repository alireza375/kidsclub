import React, { useEffect, useState } from "react";
import { PageHeader } from "../../../components/common/upperSection";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
} from "react-icons/fa";
import { IoHomeOutline, IoMailOutline } from "react-icons/io5";
import { BsTelephoneInbound } from "react-icons/bs";

import { Link, useParams } from "react-router-dom";
import {
    fetchEventTickets,
    fetchPublicEvents,
} from "../../../helpers/backend";
import { useFetch, useTitle } from "../../../helpers/hooks";
import { columnFormatter } from "../../../helpers/utils";
import { useSite } from "../../../context/site";
import { useI18n } from "../../../providers/i18n";
import Table from "../../common/form/table";

export default function EventTickets() {
    const { id } = useParams();
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchEventTickets, {
        id: id,
    });       
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Event Tickets") + " - " + i18n.t("Admin"));
    const columns = [
        {
            text: "Name",
            dataField: "name",
            key: "name",
        },
        {
            text: "Email",
            dataField: "email",
            key: "price",
        },
        {
            text: "Phone",
            dataField: "phone",
            key: "phone",
        },
        {
            text: "Tickets",
            dataField: "ticket_number",
            key: "description",
        }
    ];

    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <p className="text-2xl font-bold text-secondary">{i18n.t("Tickets list of")} <span className="text-primary">{columnFormatter(data?.docs[0]?.event)} ({data?.docs?.length}) </span></p>
            <div className="mt-4">
               <Table columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                indexed
                noActions
                pagination
                i18n={i18n} />
            </div>
           
        </div>
    );
}
