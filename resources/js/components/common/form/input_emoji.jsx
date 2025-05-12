import React, { useId } from "react"
import { DatePicker, Form, TimePicker } from "antd"
import InputEmoji from 'react-input-emoji'
import { useI18n } from "../../app/providers/i18n"


const FormInputWithImoje = ({ name, label, className, type = 'text', required = false, initialValue = '', rules = [], dependencies = [], isEmail, readOnly, onChange, placeholder, textArea = false, style, disabledDate, autoComplete, extra, disableInput = false, max = '' }) => {
    const i18n = useI18n()
    let initRules = [
        { required: required, message: `Please provide ${label?.toLowerCase() || 'a value'}` },
    ]
    if (isEmail === true) {
        initRules.push({type: 'email', message: !!i18n.t ? i18n.t('Please enter a valid email address') : ''})
    }
    return (
        <Form.Item
            name={name}
            required={required}
            className={className}
            label={!!i18n.t && label ? i18n.t(label) : label}
            dependencies={dependencies}
            initialValue={initialValue}
            rules={[...initRules, ...rules]}
            extra={extra}
        >
            <InputEmoji height={45} placeholder={placeholder} borderRadius={6} onChange={onChange}/>

        </Form.Item>
    )
}
export default FormInputWithImoje

export const HiddenFormItem = ({ name, initialValue = '' }) => {
    return (
        <Form.Item name={name} initialValue={initialValue} hidden>
            <input />
        </Form.Item>
    )
}