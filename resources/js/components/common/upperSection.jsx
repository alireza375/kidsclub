import React from "react";
import { Link } from "react-router-dom";
import { useSite } from "../../context/site";
import { useI18n } from "../../providers/i18n";

export function PageHeader({ title }) {
  const i18n = useI18n();
  const {sitedata} = useSite();
  const breadcrumbs = title.split(" ").map((word, index) => ({
    label: word,
    href: `/${word.toLowerCase()}`,
  }));

  return (
    <div className="relative h-[200px] w-full overflow-hidden">
      <img
        src={sitedata?.breadcrumb}
        alt=""
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-[#D9D9D9]/75" />
      <div className="absolute inset-0 flex flex-col justify-center px-6">
        <div className="mx-auto flex flex-col justify-center items-center w-full custom-container">
          <h1 className="sm:mb-[10px] mb-2 text-secondary title-about">
            {i18n?.t(title)}
          </h1>
          {breadcrumbs && (
            <nav className="flex justify-center items-center">
              <ol className="flex items-center  text-sm text-white/90">
                <li className="flex items-center">
                  <Link to="/" className="text-secondary text-xl font-nunito font-bold">
                    {i18n?.t("Home")}
                  </Link>
                  <span className="mx-2 text-breadcrumb font-nunito font-bold">/</span>
                </li>
                {breadcrumbs.map((item, index) => (
                  <li key={item.href} className="flex items-center">
                    <span className="text-breadcrumb text-xl font-nunito font-bold">{i18n?.t(item?.label)}</span>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}