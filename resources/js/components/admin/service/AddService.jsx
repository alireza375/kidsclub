import React from 'react'
import PageTitle from '../../common/page-title'
import ServiceForm from './ServiceFrom'
import { useSite } from '../../../context/site';
import { useTitle } from '../../../helpers/hooks';
import { useI18n } from '../../../providers/i18n';

const AddService = () => {
  const i18n=useI18n();
  const {sitedata} = useSite();
  useTitle(sitedata?.title + " | " + i18n.t("Add Service") + " - " + i18n.t("Admin"));
  return (
    <div className='p-4 bg-gray-100 min-h-full rounded-md'>
    <PageTitle title="Add Service" />
        <ServiceForm/>
    </div>
  )
}

export default AddService