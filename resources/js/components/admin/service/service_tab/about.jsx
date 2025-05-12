import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi';
import { columnFormatter } from '../../../../helpers/utils';
import { useFetch } from '../../../../helpers/hooks';
import { fetchPublicServiceFaqs } from './../../../../helpers/backend';
import { useI18n } from '../../../../providers/i18n';
import { FaQuestion } from 'react-icons/fa';
import { MdOutlineQuestionAnswer } from 'react-icons/md';

const About = ({data}) => {
    const [openIndex, setOpenIndex] = useState(2)
    const i18n = useI18n();
  return (
    <div>
      <h2 className="midheading text-secondary mb-4">{columnFormatter(data?.title)}</h2>
      <p className="midtitle breadcrumb mb-4" dangerouslySetInnerHTML={{ __html: columnFormatter(data?.description) }}>
      </p>
      <h1 className="midheading text-secondary mb-4">{i18n?.t("Frequently Asked Questions")}</h1>
            <div className="border bg-white shadow-lg border-gray-200 rounded-lg p-6">
                {data?.service_faq?.map((faq, index) => (
                    <div
                        key={index}
                        className={`border-b last:border-b-0 transition-all ${
                            openIndex === index ? "bg-gray-50" : ""
                        }`}
                    >
                        {/* Question Button */}
                        <button
                            onClick={() =>
                                setOpenIndex(openIndex === index ? -1 : index)
                            }
                            className="w-full sm:py-4 py-3 flex justify-between items-center text-left hover:bg-gray-100 rounded-md transition-colors duration-200 px-3"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FaQuestion className="text-teal-blue" />
                                {columnFormatter(faq?.question)}
                            </h3>
                            <FiChevronDown
                                className={`w-6 h-6 text-teal-blue transition-transform duration-300 ${
                                    openIndex === index ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {/* Answer Section */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                openIndex === index ? "max-h-screen" : "max-h-0"
                            }`}
                        >
                            {openIndex === index && (
                                <div className="sm:py-4 py-3 px-3 text-gray-700">
                                    <div className="flex items-start gap-2">
                                        <MdOutlineQuestionAnswer className="text-teal-blue mt-1" />
                                        <p className="text-base">
                                            {columnFormatter(faq?.answer)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {/* No FAQ Message */}
                {data?.service_faq?.length === 0 && (
                    <p className="text-center text-gray-600 text-lg py-4">
                        {i18n?.t("No FAQ Found")}!
                    </p>
                )}
            </div>
    </div>
  )
}

export default About