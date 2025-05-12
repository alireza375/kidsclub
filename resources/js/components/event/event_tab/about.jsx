import React from 'react'

import { columnFormatter } from '../../../helpers/utils';

const About = ({data}) => {
  return (
    <div>
      <h2 className="midheading text-secondary mb-4">{columnFormatter(data?.title)}</h2>
      <div className="midtitle breadcrumb mb-4" dangerouslySetInnerHTML={{ __html: columnFormatter(data?.description) }}>
       
      </div>
    </div>
  )
}

export default About