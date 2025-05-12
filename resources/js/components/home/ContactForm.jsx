import React, { useState } from "react";
import { postContactUs } from "../../helpers/backend";
import { useI18n } from "../../providers/i18n";
import { notification } from "antd";


const ContactForm = () => {
    const i18n = useI18n();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [errors, setErrors] = useState({});


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
            const res = await postContactUs(formData);
            if (res.success === true) {
                notification.success({ message: res.message });
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    message: "",
                    subject: "",
                });
                setErrors({});
            }
            else{
                notification.error({ message: res.message });
            }
           
        // }
    };

    return (
        <form onSubmit={handleSubmit} className="1xl:space-y-10 space-y-5">
            <div className="flex gap-5">
                <div className="w-1/2">
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full border-[1px] border-primary px-5 h-12 rounded-xl"
                        style={{ outline: "none" }}
                        required
                    />
                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>

                <div className="w-1/2">
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full border-[1px] border-primary px-5 h-12 rounded-xl"
                        style={{ outline: "none" }}
                        required
                    />
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>
            </div>

            <div className="w-full">
                <input
                    name="phone"
                    type="number"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full px-5 border-[1px] border-primary h-12 rounded-xl"
                    style={{ outline: "none" }}
                    required
                />
                {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            </div>
            <div className="w-full">
                <input
                    name="subject"
                    type="tel"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full px-5 border-[1px] border-primary h-12 rounded-xl"
                    style={{ outline: "none" }}
                    required
                />
                {errors.subject && <p className="text-red-500">{errors.subject}</p>}
            </div>

            <div className="w-full">
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    className="p-5 w-full border-[1px] border-primary 1xl:h-[300px] h-[200px] rounded-xl"
                    style={{ outline: "none" }}
                    required
                />
                {errors.description && <p className="text-red-500">{errors.description}</p>}
            </div>

            <button type="submit" className="public-button px-6 py-2 rounded-full">
                {i18n?.t("Submit")}
            </button>
        </form>
    );
};

export default ContactForm;
