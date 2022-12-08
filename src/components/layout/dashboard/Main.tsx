import { TypeReactChild } from '../../../utils/interface/CommonInterface';
import { useNavigate } from 'react-router-dom';
import URL from './../../../utils/URL';
import { PageWrapper, SidebarWrapper } from '@milon27/react-sidebar'
import NavItems from '../../router/NavItems';
import { useContext } from 'react';
import { StateContext } from '../../../utils/context/MainContext';
import logo from '../../../assets/img/logo.png'

export interface iMain {
    title?: string,
    children: TypeReactChild
}

export default function Main({ children, title = "" }: iMain) {

    const { setUser } = useContext(StateContext)
    const navigate = useNavigate()

    const logout = () => {
        //clear cookie
        //clear localstate/storage
        setUser(null)
        localStorage.clear()
        navigate(URL.LOGIN)
    }



    return (
        <SidebarWrapper
            title="Cashful"
            logoUrl={logo}
            userName={"Admin"}
            userImageUrl='https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png'
            navItems={NavItems}
            onLogOut={logout}
        >
            <PageWrapper>
                {children}
            </PageWrapper>
        </SidebarWrapper>
    )
}