import React from "react";
import ReactPaginate from "react-paginate";
import { useI18n } from "../../providers/i18n";

const Pagination = ({ page, total, limit, totalPages, onPageChange, onSizeChange }) => {
    const i18n = useI18n();

    return (
        <div className="flex flex-wrap justify-between mb-4 gap-x-4 font-nunito">
            <div className="flex items-center mb-6 md:mb-0">
                {onSizeChange && (
                    <div className="flex items-center text-sm text-dark_text">
                        {i18n?.t("Show")}
                        <select
                            value={limit}
                            onChange={(e) => onSizeChange(+e.target.value)}
                            className="h-8 px-3 rounded-md mx-2 text-center focus:outline-none border border-secondary bg-white"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                )}
                <p className="text-sm text-dark_text">
                    {i18n?.t("Showing")} {((page - 1) * limit) + 1 || 0} 
                    &nbsp;{i18n?.t("to")} {Math.min(total || 0, page * limit) || 0} 
                    &nbsp;{i18n?.t("of")} {total || 0} {i18n?.t("entries")}
                </p>
            </div>

            <ReactPaginate
                breakLabel="..."
                previousLabel={i18n?.t("Previous")}
                nextLabel={i18n?.t("Next")}
                disabledLinkClassName="text-gray-300"
                previousLinkClassName="text-sm bg-white border border-secondary text-secondary hover:bg-secondary hover:text-white transition-all ease-in font-semibold py-2 px-4 rounded-l"
                nextLinkClassName="text-sm bg-white border border-secondary text-secondary hover:bg-secondary hover:text-white transition-all ease-in font-semibold py-2 px-4 rounded-r"
                pageLinkClassName="text-sm bg-white border border-secondary text-secondary hover:bg-secondary hover:text-white transition-all ease-in font-semibold py-2 px-4 "
                pageClassName="!mb-0 md:!mb-0"
                activeLinkClassName="text-white !bg-secondary"
                className="flex flex-wrap items-center gap-2 justify-center"
                onPageChange={({ selected }) => onPageChange(selected + 1)}
                pageRangeDisplayed={3}
                pageCount={totalPages || 1}
                renderOnZeroPageCount={null}
            />
        </div>
    );
}

export default Pagination;

