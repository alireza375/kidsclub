import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import { useFetch } from '../helpers/hooks';
import UserContext from '../context/user';
import EnvContext from '../context/envContext';
import { fetchUser } from '../helpers/backend';

const UserProviders = ({ children }) => {
    const [active, setActive] = useState('dashboard');
    const [userLoading, setUserLoading] = useState(true);
    const [user, setUser] = useState({});
    useEffect(() => {
        getUser();
    }, [user?.id]);

    const getUser = async () => {
        setUserLoading(true);
        const { data, error } = await fetchUser();
        if (!error) {
            setUser(data);
            setUserLoading(false);
        } else {
            setUser({});
            setUserLoading(false);
        }
    };


    return (
            <UserContext.Provider value={{ user, setUser, getUser, active, setActive, userLoading }}>
                    {children}
            </UserContext.Provider>
    );
};

export default UserProviders;
