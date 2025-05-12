import React, { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../helpers/hooks";
import {  fetchCartlist, fetchCurrency,  fetchPublicSiteSettings,  fetchSiteSettings, fetchUser, fetchWishList } from "../helpers/backend";


const SiteContext = createContext({});

const SiteProvider = ({ children }) => {
    // State Variables
    const [currencies, setCurrencies] = useState([]);
    const [currency, setCurrency] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState('');
    const [currencyRate, setCurrencyRate] = useState(1);
    // const [countCartQuantity, setCountCartQuantity] = useState(0);
    // const [cartItems, getCartItems] = useFetch(fetchCartlist);
    const [sitedata,getSiteData] = useFetch(fetchPublicSiteSettings);
    const [wishListdata,getWishListdata,{loading:wishLoading}]=useFetch(fetchWishList,{})
    const [wishlistQuantity,setWishlistQuantity]=useState(wishListdata?.docs?.length)
    const [cartdata,getcartdata,{loading:cartloading}]=useFetch(fetchCartlist,{})
    const [countCartQuantity, setCountCartQuantity] = useState(cartdata?.products?.length);

    useEffect(() => {
        if (wishListdata?.docs) {
            setWishlistQuantity(wishListdata.docs.length);
        }
    }, [wishListdata]);
    useEffect(() => {
        getWishListdata();
    }, []);
    useEffect(() => {
        if (cartdata?.products) {
            setCountCartQuantity(cartdata?.products.length);
        }
    }, [cartdata]);
    useEffect(() => {
        getWishListdata();
    }, []);

    useEffect(() => {
        const initializeCurrencies = async () => {
            try {
                const { data } = await fetchCurrency();
                if (Array.isArray(data)) {
                    setCurrencies(data);

                    // Get default or saved currency
                    const savedCurrency = localStorage.getItem('currency') || data.find(c => c.default)?.code;
                    updateCurrency(savedCurrency, data);
                } else {
                    console.error("Unexpected data format:", data);
                }
            } catch (error) {
                console.error("Error fetching currencies:", error);
            }
        };

        initializeCurrencies();
    }, []);

    // Update currency states and localStorage
    const updateCurrency = (code, currencyList = currencies) => {
        const selectedCurrency = currencyList.find(c => c.code === code);
        if (selectedCurrency) {
            setCurrency(selectedCurrency.code);
            setCurrencySymbol(selectedCurrency.symbol);
            setCurrencyRate(selectedCurrency.rate);
            localStorage.setItem('currency', selectedCurrency.code);
        }
    };

    // Change Currency
    const changeCurrency = (code) => updateCurrency(code);

    // Get currency symbol for a given code
    const getCurrencySymbol = (code) => {
        const selectedCurrency = currencies.find(c => c.code === code);
        return selectedCurrency ? selectedCurrency.symbol : '';
    };

    // Convert Amount with current currency rate
    const convertAmount = (amount) => (amount * currencyRate).toFixed(2);

    // Convert Amount with a specific currency
    const convertAmountWithCurrency = (amount, code) => {
        const selectedCurrency = currencies.find(c => c.code === code);
        return selectedCurrency ? (amount * selectedCurrency.rate).toFixed(2) : amount.toFixed(2);
    };

    // Context Data
    const siteSettingsData = {
        currencies,
        currency,
        currencySymbol,
        currencyRate,
        changeCurrency,
        convertAmount,
        wishlistQuantity,
        getWishListdata,
        countCartQuantity,
        setCountCartQuantity,
        cartdata,
        getcartdata,
        getCurrencySymbol,
        sitedata,
        getSiteData,

    };

    return (
        <SiteContext.Provider value={siteSettingsData}>
            {children}
        </SiteContext.Provider>
    );
};

// Hook to Access Site Context
export const useSite = () => useContext(SiteContext);

export default SiteProvider;
