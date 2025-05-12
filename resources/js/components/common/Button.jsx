import React from 'react'
import { useI18n } from '../../providers/i18n';

export default function Button({title, style, type,func}) {
  const i18n = useI18n();
  return (
    <button type={type && "submit"} onClick={ func} className={`${style} button`}>{i18n?.t(title)}</button>
  )
}
