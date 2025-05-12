import React from 'react'
import BlogFrom from './BlogFrom'
import { useSite } from '../../../context/site';
import { useTitle } from '../../../helpers/hooks';
import { useI18n } from '../../../providers/i18n';

const AddBlog = () => {
  const i18n=useI18n();
  const {sitedata} = useSite();
  useTitle(sitedata?.title + " | " + i18n.t("Add Blog") + " - " + i18n.t("Admin"));
  return (
    <div>
        <BlogFrom />
    </div>
  )
}

export default AddBlog