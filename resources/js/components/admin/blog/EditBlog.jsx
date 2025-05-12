import React from 'react'
import BlogFrom from './BlogFrom'
import { useParams } from 'react-router-dom';
import { useFetch, useTitle } from '../../../helpers/hooks';
import { fetchAdminSingleBlog } from '../../../helpers/backend';
import { useSite } from '../../../context/site';
import { useI18n } from '../../../providers/i18n';

const EditBlog = () => {
    const {id} = useParams();
    const i18n=useI18n();
    const [blog , getBlog] = useFetch(fetchAdminSingleBlog, {id});
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Edit Blog") + " - " + i18n.t("Admin"));
  return (
    <div>
        <BlogFrom isEdit={true} data={blog} />
    </div>
  )
}

export default EditBlog