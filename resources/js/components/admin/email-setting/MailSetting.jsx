import { Tabs, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import PageTitle from '../../common/page-title';
import SendGridManageEmail from './SendGridManageEmail';
import GmailEmailProvider from './Gmail';
import OtherProviderManageEmail from './OtherServices';
import { useI18n } from '../../../providers/i18n';
import { useFetch, useTitle } from '../../../helpers/hooks';
import { fetchEmailSettings } from '../../../helpers/backend';
import { useSite } from '../../../context/site';

const MailSetting = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const [settings, getSettings, { loading }] = useFetch(fetchEmailSettings);
    const [checkedValue, setCheckedValue] = useState(false);
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Mail Settings") + " - " + i18n.t("Admin"));
    useEffect(() => {
        if (settings?.id) {
            form.resetFields();
        }
    }, [settings]);

    const items = [
        {
            label: i18n?.t("SendGrid"),
            key: "1",
            children: (
                <SendGridManageEmail
                    settings={settings}
                    getSettings={getSettings}
                    loading={loading}
                    checkedValue={checkedValue}
                    setCheckedValue={setCheckedValue}
                />
            ),
        },
        {
            label: i18n?.t("Gmail Provider"),
            key: "2",
            children: (
                <GmailEmailProvider
                    settings={settings}
                    getSettings={getSettings}
                    loading={loading}
                    checkedValue={checkedValue}
                    setCheckedValue={setCheckedValue}
                />
            ),
        },
        {
            label: i18n?.t("Other Provider"),
            key: "3",
            children: (
                <OtherProviderManageEmail
                    settings={settings}
                    getSettings={getSettings}
                    loading={loading}
                    checkedValue={checkedValue}
                    setCheckedValue={setCheckedValue}
                />
            ),
        },
    ];

    return (
        <div className='p-4 bg-gray-100 min-h-full rounded-md'>
            <PageTitle title={"Email Settings"} />
            <div className="bg-white p-4 rounded mail-setting">
                <Tabs className='' defaultActiveKey="1" centered type="card" items={items} />
            </div>
        </div>
    );
};

export default MailSetting;
