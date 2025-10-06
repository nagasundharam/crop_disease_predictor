import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";

import Homepage from "../pages/Homepage";
import Dashboard from "../pages/Dashboard";
import Cropdisease from "../pages/Cropdisease";
import Mandi from "../pages/mandi";
import Weather from "../pages/Weather";
import IntroPage from "../pages/Introduction";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Login/RegisterPage";

// Root redirect decides where to go on "/"
function RootRedirect() {
  const seenIntro = localStorage.getItem("introSeen");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!seenIntro) return <Navigate to="/intro" replace />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <Navigate to="/home" replace />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Root "/" */}
      <Route path="/" element={<RootRedirect />} />

      {/* Intro page */}
      <Route path="/intro" element={<IntroPage />} />

      {/* Authentication pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Homepage with nested routes */}
      <Route path="/home" element={<Homepage />}>
        <Route index element={<Dashboard />} />
        <Route path="crop-disease" element={<Cropdisease />} />
        <Route path="mandi-price" element={<Mandi />} />
        <Route path="weather" element={<Weather />} />
      </Route>
    </>
  )
);

function RoutingLayout() {
  return <RouterProvider router={router} />;
}

export default RoutingLayout;
