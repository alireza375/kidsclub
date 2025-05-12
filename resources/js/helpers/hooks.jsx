import { useRef,useEffect, useState } from "react";
import { notification } from "antd";
import Swal from "sweetalert2";

export const useFetch = (func, query = {}, load = true) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(load)
    const [error, setError] = useState('')
    const [params, setParams] = useState(query)
     useEffect(() => {
        if (load) {
            getData(params)
        }
    }, []);

    const getData = (query) => {
        setLoading(true)
        setError('')
        setParams({ ...params, ...query })
        func({ ...params, ...query }).then(({ success, data, message }) => {
            setLoading(false)
            if (success === true) {
                setData(data)
            } else {
                setData(undefined)
                setError(message)
            }
        }).catch(e => {
            setLoading(false)
            setError(e.message)
        })
    }
    const clear = () => setData(undefined)
    return [data, getData, { query: params, loading, error, clear }];
}

export const useAction = async (func, data, reload, alert = true, successMsg) => {
    const { success,  message , data: d } = await func({ ...data })
    if (success === true) {
        if (reload) {
            reload(d)
        }
        if (alert) {
            notification.success({ message: successMsg || message || 'Success' })
        }
    } else {
        notification.error({ message: message || 'Something went wrong' })
    }
}

export const useActionConfirm = async (func, data, reload, message, mode, alert = true) => {
    // const i18n = useI18n()
    const { isConfirmed } = await Swal.fire({
        title: 'Are you sure?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
    })
    if (isConfirmed) {
        await useAction(func, data, reload, alert)
    }
}


export const userOutSideClick = (ref, func) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                func && func()
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}



// useTitle.js

export function useTitle(title, prevailOnUnmount = false) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => () => {
    if (!prevailOnUnmount) {
      document.title = defaultTitle.current;
    }
  }, [])
}

