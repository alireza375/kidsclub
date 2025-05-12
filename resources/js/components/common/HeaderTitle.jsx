import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../providers/i18n";

export default function HeaderTitle({
    title,
    title1,
    header,
    description,
    styles,
    link,
    center = false,
    button = false,
    contact,
}) {
    const { titleS, title1S } = styles;
    const i18n = useI18n();

    return (
        <div className="1xl:space-y-6 space-y-3  relative mb-5">
            <h5 className={`heading2 text-secondary ${center && "text-center"} z-50`}>
                {header}
            </h5>
            <div
                className={`relative ${
                    link && "flex items-center justify-between "
                }`}
            >
                <div
                    className={`w-auto ${center && " flex justify-center"} ${
                        titleS && ""
                    } ${link && !button && "sm:w-auto w-[70%]"}`}
                >
                    <h3
                        className={`lg:text-[48px] text-[32px] font-bold font-nunito text-secondary leading-[56px] z-10 relative ${
                            center ? "text-center" : ""
                        } ${contact ? "w-full" : "sm:w-max"} break-words`}
                        style={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                        }}
                    >
                        {title}
                        <span
                            className={`heading3-span ${titleS}`}
                            aria-hidden="true"
                        />
                    </h3>
                    {title1 && (
                        <h3 className="lg:text-[48px] text-[32px] font-bold font-nunito text-secondary leading-[56px] z-10 relative w-max">
                            {title1}
                            <span
                                className={`heading3-span ${title1S} `}
                                aria-hidden="true"
                            />
                        </h3>
                    )}
                </div>
                {link && !button && (
                    <Link
                        to={link}
                        className="heading2 w-max hover:text-primary/50  text-primary"
                    >
                        {i18n?.t("View All")}
                    </Link>
                )}
                {button && link && (
                    <Link to={link} className="kids-button">
                        {i18n?.t("All Services")}
                    </Link>
                )}
            </div>
            <p
                className={`description text-[#2E3C63] ${center && "text-center"}`}
                dangerouslySetInnerHTML={{ __html: description }}
            ></p>
        </div>
    );
}
