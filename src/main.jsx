import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";

import { Root } from "./app/components/Root";

import { Dashboard } from "./app/components/Dashboard";
import { Lights } from "./app/components/Lights";
import { Climate } from "./app/components/Climate";
import { Security } from "./app/components/Security";
import { Appliances } from "./app/components/Appliances";
import { Energy } from "./app/components/Energy";
import { Rooms } from "./app/components/Rooms";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Dashboard />} />
          <Route path="lights" element={<Lights />} />
          <Route path="climate" element={<Climate />} />
          <Route path="security" element={<Security />} />
          <Route path="appliances" element={<Appliances />} />
          <Route path="energy" element={<Energy />} />
          <Route path="rooms" element={<Rooms />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);