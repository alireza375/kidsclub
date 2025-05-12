import React from 'react';
    import { DatePicker, Form } from 'antd';
import { useI18n } from '../../../providers/i18n';

const FormInput = ({ label, name, rows, placeholder, required, isEmail, initialValue, rules = [], textArea, type, readOnly, onChange, onBlur }) => {
    const i18n = useI18n();

    let initRules = [
        {
            required: required,
            message: `${i18n?.t('Please provide')} ${typeof label === 'string' && label?.toLowerCase() || i18n?.t('a value')}`
        },
    ]
    if (isEmail) {
        initRules.push({ type: 'email', message: i18n?.t('Please enter a valid email address') })
    }

    let input = <input className={`form-input`} type={type} onChange={onChange} onBlur={onBlur} placeholder={i18n?.t(placeholder)} readOnly={readOnly} />
    textArea && (input = <textarea className="form-input" rows={rows} />)
    type === 'date' && (input = <DatePicker />)

    return (
       initialValue ? <Form.Item
            disabled
            name={name}
            label={i18n?.t(label)}
            rules={[...initRules, ...rules]}
            className="mb-4"
            initialValue={initialValue || ''}
            placeholder={i18n?.t(placeholder)}
        >
            {input}
        </Form.Item>
        : <Form.Item
            name={name}
            label={i18n?.t(label)}
            rules={[...initRules, ...rules]}
            className="mb-4"
            placeholder={i18n?.t(placeholder)}
        >
            {input}
        </Form.Item>
    )
}

export default FormInput;


export const HiddenInput = ({ name, initialValue }) => {
    return (
       initialValue ? <Form.Item
            name={name}
            initialValue={initialValue || ''}
            hidden
        >
            <input className="form-input" />
        </Form.Item>
        : <Form.Item
        name={name}
        hidden
    >
        <input className="form-input" />
    </Form.Item>
    )
}
