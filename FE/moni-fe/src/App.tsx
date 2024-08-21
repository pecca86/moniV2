import AppLayout from "./ui/layout/AppLayout"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AccountDetail from "./pages/AccountDetail";
import NotFoundPage from "./pages/NotFoundPage";
import Accounts from "./pages/Accounts";
import DetailMain from "./ui/account-detail/transactions/DetailMain";
import TimeSpans from "./ui/account-detail/timespans/TimeSpans";
import DetailCharts from "./ui/account-detail/charts/DetailCharts";
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* This makes all childs routes render inside this route when calling Outlet inside AppLayout */}
            <Route index element={<Navigate replace to={'/accounts'} />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path='/account-details' element={<AccountDetail />} >
              {/* This makes all childs routes render inside this route when calling Outlet inside AccountDetails */}
              <Route path="/account-details/:accountId/main" element={<DetailMain />} />
              <Route path="/account-details/:accountId/timespans" element={<TimeSpans />} />
              <Route path="/account-details/:accountId/charts" element={<DetailCharts />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="bottom-center"
        gutter={12}
        containerStyle={{ margin: '18px' }}
        toastOptions={{
          success: {
            duration: 1500
          },
          error: {
            duration: 2000
          },
          style: {
            fontSize: '1.2rem',
            color: '#fff',
            maxWidth: '400px',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
            backgroundColor: '#333',
          }
        }}
      />
    </>
  )
}

export default App
