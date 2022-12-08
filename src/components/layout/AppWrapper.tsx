import React, { PropsWithChildren, useContext, useEffect } from 'react'
import { StateContext } from '../../utils/context/MainContext';
import Define from '../../utils/Define';
import { iUser } from '../../utils/interface/Models';
import MyLoadingSreen from './common/MyLoadingScreen';

export default function AppWrapper(props: PropsWithChildren<React.ReactNode>) {
    const { user, setUser } = useContext(StateContext);

    useEffect(() => {
        const data = localStorage.getItem(Define.AUTH_KEY)
        if (data)
            setUser(JSON.parse(data) as iUser)
        else
            setUser(null)
    }, [])

    // console.log("load=>", loading, "user->", user, "data?.me=>", data?.me, "error", error);

    // error
    // if (error) {
    //     return <>{
    //         props.children
    //     }</>
    // }
    // loading || loading === true
    if (user === undefined) {
        return (<MyLoadingSreen />);
    }
    //done
    return <>{
        props.children
    }</>
}
