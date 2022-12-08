import { ToastContainer } from 'react-toastify';
import MainContext from './utils/context/MainContext';
import Router from './components/router/Router';
import AppWrapper from './components/layout/AppWrapper';

// API Config
// axios.defaults.baseURL = import.meta.env.VITE_APP_API + ''
// axios.defaults.withCredentials = true

function App() {
  return (
    <div>

      <MainContext>
        <AppWrapper>
          <Router />
        </AppWrapper>
      </MainContext>

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App
