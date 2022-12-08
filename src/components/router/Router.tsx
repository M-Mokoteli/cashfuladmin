import { BrowserRouter, Routes, Route } from "react-router-dom";
import URL from '../../utils/URL';
import _404 from '../pages/404/_404';
import Accounts from "../pages/accounts/Accounts";
import Login from '../pages/auth/Login';
import EditBackground from "../pages/edit/EditBackground";
import EditPaymentInfo from "../pages/edit/EditPaymentInfo";
import AdminHome from '../pages/home/AdminHome';
import ProtectedRoute from "./ProtectedRoute";
import Subscription from "../pages/accounts/Subscription";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={URL.LOGIN} element={<Login />} />

                <Route path={URL.HOME} element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
                <Route path={URL.ACCOUNTS} element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
                <Route path={URL.SUBSCRIPTION} element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
                <Route path={`${URL.BACKGROUND}/:id`} element={<ProtectedRoute><EditBackground /></ProtectedRoute>} />
                <Route path={`${URL.PAY_INFO}/:id`} element={<ProtectedRoute><EditPaymentInfo /></ProtectedRoute>} />

                <Route path="*" element={<_404 />} />

            </Routes>
        </BrowserRouter>
    )
}
