import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditUser from "./components/user/EditUser";
import Payments from "./components/payments/Payments";
import CreatePayment from "./components/payments/CreatePayment";
import { PersistGate } from "redux-persist/integration/react";
import UserIndex from "./components/user/UserIndex";
import NewUser from "./components/auth/NewUser";
import EditPayment from "./components/payments/EditPayment";
import Orders from "./components/orders/Orders";
import CreateOrder from "./components/orders/CreateOrder";
import Address from "./components/address/Address";
import CreateAddress from "./components/address/CreateAddress";
import EditAddress from "./components/address/EditAddress";
import EditOrder from "./components/orders/EditOrder";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/user" element={<UserIndex />} />
            <Route path="/new-user" element={<NewUser/>} />
            <Route path="/edit-user/:id" element={<EditUser />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/new-payment" element={<CreatePayment />} />
            <Route path="/edit-payment/:id" element={<EditPayment />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/edit-order/:id" element={<EditOrder />} />
            <Route path="/new-order" element={<CreateOrder />} />
            <Route path="/address" element={<Address />} />
            <Route path="/new-address" element={<CreateAddress />} />
            <Route path="/edit-address/:id" element={<EditAddress />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
