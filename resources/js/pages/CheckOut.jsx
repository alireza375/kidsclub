import React, { use, useEffect, useState } from "react";
import { PageHeader } from "../components/common/upperSection";
import { Form, Input, message, notification, Tree } from "antd";
import {
    fetchPaymentMethodList,
    getProductDetails,
    postOrder,
    applyCoupon,
} from "../helpers/backend";
import { useI18n } from "../providers/i18n";
import { useSite } from "../context/site";
import { useUser } from "../context/user";
import { columnFormatter } from "../helpers/utils";
import { useFetch, useTitle } from "../helpers/hooks";

export default function CheckOut() {
    const i18n = useI18n();
    const [currentSubtotal, setCurrentSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const searchParams = new URLSearchParams(window.location.search);
    const [data, getData, { loading: productLoading }] = useFetch(
        getProductDetails,
        {}
    );

    const [form] = Form.useForm();
    const [paymentMethod, setPaymentMethod] = useFetch(fetchPaymentMethodList);
    const [method, setMethod] = useState("");
    const paymentData = paymentMethod?.docs?.map((item, index) => ({
        id: item?.id,
        name: item?.name,
        type: item?.type,
        icons: (
            <img
                key={index}
                src={item?.image}
                alt="stripe"
                className="h-[16px] w-[34px]"
            />
        ),
    }));

    const productId = searchParams.get("productid");
    useEffect(() => {
        if (productId) {
            getData({ id: productId });
        }
    }, [data?.product?.id]);

    const [checkOutFormData, setCheckOutFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        location: "",
        city: "",
        zipCode: "",
    });
    const [couponCode, setCouponCode] = useState();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCheckOutFormData({ ...checkOutFormData, [name]: value });
    };
    const changePayemntMethod = (e) => {
        setMethod(e.target.value);
    };
    const { langCode } = useI18n();
    const { currency, cartdata, getcartdata, currencySymbol, convertAmount,sitedata } =
        useSite();
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    useTitle(`${sitedata?.title || "KidStick"} | Checkout`)
    useEffect(() => {
        if (cartdata) {
            setCurrentSubtotal(cartdata?.total);
        }
    }, [cartdata]);
    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (!method) {
            return notification.error({
                message: "Please select payment method",
            });
        }
        let payload = {
            name:
                checkOutFormData?.firstName + " " + checkOutFormData?.lastName,
            currency: currency,
            langCode: langCode,
            shipping_address: {
                email: checkOutFormData?.email,
                phone: checkOutFormData?.phoneNumber,
                location: checkOutFormData?.location,
                city: checkOutFormData?.city,
                zip_code: checkOutFormData?.zipCode,
            },
            total: currentSubtotal,
            status: "pending",
            method: method,
            discount_coupon: couponCode,
        };
        if (productId) {
            payload.items = [
                {
                    productId: productId,
                    quantity: parseInt(quantity),
                },
            ];
        } else {
            payload.items = cartdata?.products?.map((d, index) => {
                return {
                    productId: d?.id,
                    quantity: d?.quantity,
                    variants: d?.variants,
                };
            });
        }

        if (user?.id && user?.role === "user") {
            const { success, message, data } = await postOrder(payload);

            if (success === true) {
                setLoading(false);
                window.location.href = data;
                notification.success({ message: message });
            } else {
                setLoading(false);

                notification.error({ message: message });
            }
        } else {
            notification.error({ message: "Availabe for users" });
        }
    };
    return (
        <div className="bg-coralred">
            <PageHeader title="Check Out" />
            <div className="custom-container mx-auto section-padding">
                <div className="flex flex-col md:flex-row gap-8 ">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">
                            {i18n?.t("Checkout")}
                        </h1>
                        <form className="space-y-5" onSubmit={onSubmit}>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label
                                        htmlFor="firstName"
                                        className="block small !font-bold text-gray-700 mb-1"
                                    >
                                        {i18n?.t("First Name")}
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        onChange={handleInputChange}
                                        className="payment-input"
                                        placeholder="First Name"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor="lastName"
                                        className="block small !font-bold text-gray-700 mb-1"
                                    >
                                        {i18n?.t("Last Name")}
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        onChange={handleInputChange}
                                        className="payment-input"
                                        placeholder="Last Name"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block small !font-bold text-gray-700 mb-1"
                                >
                                    {i18n?.t("Email")}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    onChange={handleInputChange}
                                    className="payment-input"
                                    placeholder="abcd@mail.com"
                                    required
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label
                                        htmlFor="phoneNumber"
                                        className="block small !font-bold text-gray-700 mb-1"
                                    >
                                        {i18n?.t("Phone Number")}
                                    </label>
                                    <input
                                        type="number"
                                        name="phoneNumber"
                                        onChange={handleInputChange}
                                        className="payment-input"
                                        placeholder="123456789"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor="location"
                                        className="block small !font-bold text-gray-700 mb-1"
                                    >
                                        {i18n?.t("Location")}
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        onChange={handleInputChange}
                                        className="payment-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label
                                        htmlFor="city"
                                        className="block small !font-bold text-gray-700 mb-1"
                                    >
                                        {i18n?.t("City")}
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        onChange={handleInputChange}
                                        className="payment-input"
                                        placeholder="khulna"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor="zipCode"
                                        className="block small !font-bold text-gray-700 mb-1"
                                    >
                                        {i18n?.t("Zip Code")}
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        onChange={handleInputChange}
                                        className="payment-input"
                                        placeholder="12334"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                    {i18n?.t("Payment Method")}:
                                </h2>
                                <div className="flex gap-2">
                                    {paymentData?.map((paymentM, i) => (
                                        <label
                                            key={i}
                                            className={`flex justify-center items-center w-20 h-8 border rounded-lg cursor-pointer transition-all object-contain ${
                                                method == paymentM?.type
                                                    ? "border-primary bg-primary/20"
                                                    : "border-gray-200 hover:border-primary"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={paymentM?.type}
                                                checked={
                                                    method === paymentM.type
                                                }
                                                onChange={changePayemntMethod}
                                                className="sr-only"
                                            />
                                            {paymentM.icons}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="cart-button">
                                {i18n?.t("Place Order")}
                            </button>
                        </form>
                    </div>
                    <div className="w-full md:w-96 ">
                        <div className="bg-transparent  rounded-lg  border-[1px] border-gray-300">
                            <div className="bg-[#376179] py-3 rounded-t-lg">
                                <h2 className="description !font-bold text-white text-center">
                                    {i18n?.t("Order Summary")}
                                </h2>
                            </div>
                            <div className="space-y-4 ">
                                {cartdata?.products?.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`flex justify-between items-center p-3 border-b-[1px] border-gray-300 ${
                                            productId && "hidden"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item?.thumbnail_image}
                                                alt="Swimming Glass"
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div>
                                                <h3 className="small !font-bold texw">
                                                    {columnFormatter(item?.name)
                                                        .length > 12
                                                        ? columnFormatter(
                                                              item?.name
                                                          ).slice(0, 12) + "..."
                                                        : columnFormatter(
                                                              item?.name
                                                          )}
                                                </h3>
                                                {item?.variants &&
                                                    item?.variants?.map(
                                                        (i, index) => {
                                                            return (
                                                                <div
                                                                    className="flex items-center gap-2"
                                                                    key={index}
                                                                >
                                                                    <span className="small  text-gray-600 !font-semibold">
                                                                        {columnFormatter(
                                                                            i?.property_name
                                                                        )}
                                                                    </span>
                                                                    <span className="font-normal">
                                                                        {columnFormatter(
                                                                            i?.property_value
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                    )}

                                                <div className="font-semibold text-sm">
                                                    <span>
                                                        {i18n?.t("Quantity")} :{" "}
                                                        {item?.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center  ">
                                            <span className="!font-bold description  text-green-500">
                                                {currencySymbol}{" "}
                                                {convertAmount(item?.total) ||
                                                    0}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {productId && (
                                    <div className="flex justify-between items-center p-3 border-b-[1px] border-gray-300">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={
                                                    data?.product
                                                        ?.thumbnail_image
                                                }
                                                alt="Swimming Glass"
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div>
                                                <h3 className="small !font-bold">
                                                    {columnFormatter(
                                                        data?.product?.name
                                                    ).length > 12
                                                        ? columnFormatter(
                                                              data?.product
                                                                  ?.name
                                                          )?.slice(0, 12) +
                                                          "..."
                                                        : columnFormatter(
                                                              data?.product
                                                                  ?.name
                                                          )}
                                                </h3>

                                                <div className="border-[1px] border-primary w-5 h-5 rounded-md flex justify-center items-center">
                                                    <span>{quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center  ">
                                            <span className="!font-bold description  text-green-500">
                                                {currencySymbol}{" "}
                                                {convertAmount(
                                                    data?.product?.price
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col mt-4 mx-4">
                                <Form
                                    form={form}
                                    onFinish={async (values) => {
                                        setCouponCode(values.code);
                                        const payload = { code: values.code };
                                        const { success, message, data } =
                                            await applyCoupon(payload);

                                        if (!success) {
                                            notification.error({ message });
                                            setDiscount(0);
                                            setCurrentSubtotal(cartdata?.total);
                                            form.resetFields(["code"]); 
                                        } else {
                                            notification.success({ message });
                                            setCurrentSubtotal(
                                                data?.current_subtotal
                                            );
                                            setDiscount(data?.discount);
                                            form.resetFields(["code"]); 
                                        }
                                    }}
                                >
                                    <Form.Item name="code">
                                        <Input
                                            name="code"
                                            placeholder="Enter coupon"
                                            className="payment-input"
                                        />
                                    </Form.Item>

                                    <div className="flex justify-end ">
                                        <button className="capitalize w-auto px-3 md:px-4 lg:px-6 xl:px-7 py-2 rounded-full text-[12px] md:text-sm lg:text-[16px] xl:text-[18px] font-nunito font-semibold border border-[#E65F33] hover:bg-[#E65F33] hover:border-[#E65F33] text-[#E65F33] hover:text-white transition-transform duration-300 hover:scale-105;">
                                            {i18n?.t("Add a Coupon code")}
                                        </button>
                                    </div>
                                </Form>
                            </div>
                            <div className="mt-10 p-3 border-t-[1px] border-gray-300 ">
                                {discount > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">
                                            {i18n?.t("Discount")}:
                                        </span>
                                        <span className="!font-bold description text-green-500">
                                            {currencySymbol} {convertAmount(discount) || 0}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">
                                        {i18n?.t("Total")}:
                                    </span>
                                    <span className="!font-bold description text-green-500">
                                        {currencySymbol} {convertAmount(currentSubtotal) || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
