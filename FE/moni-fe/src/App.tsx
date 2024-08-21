import AppLayout from "./ui/layout/AppLayout"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AccountDetail from "./pages/AccountDetail";
import NotFoundPage from "./pages/NotFoundPage";
import Accounts from "./pages/Accounts";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* This makes all childs routes render inside this route when calling Outlet inside AppLayout */}
            <Route index element={<Navigate replace to={'/accounts'} />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/account-details/:accountId" element={<AccountDetail />} />
            <Route path="*" element={<NotFoundPage />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
