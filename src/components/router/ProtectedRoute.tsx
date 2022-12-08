import React, { PropsWithChildren, useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { StateContext } from '../../utils/context/MainContext';
import URL from '../../utils/URL';

export default function ProtectedRoute(props: PropsWithChildren<React.ReactNode>) {
    const { user } = useContext(StateContext);

    // send to login page if not logged in
    // console.log("ProtectedRoute", user);

    if (user == null) {
        return <Navigate to={URL.LOGIN} />;
    }

    return (
        <>{props.children}</>
    )
}
