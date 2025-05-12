import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import art from '../../../images/art.png'
import { useFetch } from '../../helpers/hooks';
import { fetchFaq } from '../../helpers/backend';
import { columnFormatter } from '../../helpers/utils';


export default function FAQ() {
    const [openIndex, setOpenIndex] = useState();
    const [data,getData]=useFetch(fetchFaq);

  return (
      <div className="border bg-white border-red-100 rounded-3xl md:pl-[60px] pl-7 md:pr-16 pr-4 py-4 md:py-10">
          {data?.docs?.map((faq, index) => (
              <div key={index} className="border-b border-[#666666] last:border-b-0">
                  <button
                      onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                      className="w-full sm:py-4 py-2 flex justify-between items-center text-left"
                  >
                      <h3 className="text-breadcrumb header">{columnFormatter(faq?.question)}</h3>
                      <FiChevronDown
                          className={`w-5 h-5 text-blue-600 transition-transform ${openIndex === index ? 'transform rotate-180' : ''
                              }`}
                      />
                  </button>

                  <div
                      className={`overflow-hidden transition-all duration-500 ${openIndex === index ? 'max-h-screen' : 'max-h-0'
                          }`}
                  >
                      {openIndex === index && (
                          <div className="sm:pb-4 pb-2 text-breadcrumb">
                              <p className="midtitle text-breadcrumb">{columnFormatter(faq?.answer)}</p>
                            
                          </div>
                      )}
                  </div>
              </div>
          ))}
      </div>
  )
}
