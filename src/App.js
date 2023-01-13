import React, { useState, useEffect, useCallback } from "react";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import Verify from "./pages/Verify/Verify";
import Register from "./pages/Register/Register";
import Requests from "./pages/Requests/Requests";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import MarkSheetUploadPage from "./pages/MarkSheetUploadPage/MarkSheetUploadPage";
import { useCVPContext } from "./Context/CVPContext";
import { useAuth } from "./Context/AuthContext";
import MainHome from "./pages/MainHome/MainHome";
import RegisterStaff from "./pages/RegisterStaff/RegisterStaff";
import { useLocation } from "react-router-dom";
import  Update  from "./pages/Update/Update";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/admin",
      element: (
        <>
          <Navbar />
          <Admin />
        </>
      ),
    },
    {
      path: "/",
      element: <MainHome />,
    },
    {
      path: "/issueMarksheet",
      element: (
        <>
          <Navbar />
          <MarkSheetUploadPage />
        </>
      ),
    },
    {
      path: "/register",
      element: (
        <>
          <Navbar />
          <Register />
        </>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <>
          <Navbar />
          <StudentDashboard />
        </>
      ),
    },
    {
      path: "/verify/:token",
      element: (
        <>
          <Navbar />
          <Verify />
        </>
      ),
    },
    {
      path: "/requests",
      element: (
        <>
          <Navbar />
          <Requests />
        </>
      ),
    },
    {
      path: "/registerStaff",
      element: (
        <>
          <Navbar />
          <RegisterStaff />
        </>
      ),
    },
    {
      path: "/update/:id",
      element: (
        <>
          <Navbar />
          <Update />
        </>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
};

export default App;
