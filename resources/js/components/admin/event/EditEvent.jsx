import React from 'react'
import PageTitle from '../../common/page-title'
import EventForm from './EventForm'
import { useParams } from 'react-router-dom'
import { useFetch, useTitle } from '../../../helpers/hooks'
import { fetchEvents } from '../../../helpers/backend'
import { useI18n } from '../../../providers/i18n'
import { useSite } from '../../../context/site'

const EditEvent = () => {
    const {id} = useParams();
    const [data, getData, { loading }] = useFetch(fetchEvents,{id});
    const i18n = useI18n();
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Edit Event") + " - " + i18n.t("Admin"));
  return (
    <div className='p-4 bg-gray-100 min-h-full rounded-md' >
    <div className="flex justify-between items-center">
                <PageTitle title="Edit Event" />
                <button onClick={() => window.history.back()} className="admin-btn flex items-center gap-1 text-white rounded w-fit">
                    {i18n?.t("Back")}
                </button>
            </div>
        <EventForm isEdit={true} data={data}/>
    </div>
  )
}

export default EditEvent