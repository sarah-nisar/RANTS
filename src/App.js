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

const App = () => {

  const router = createBrowserRouter([
    {
      path: "/admin",
      element: <><Navbar /><Admin /></>,
    },
    {
      path: "/",
      element: <MainHome />,
    },
    {
      path: "/issueMarksheet",
      element: <><Navbar /><MarkSheetUploadPage /></>,
    },
<<<<<<< HEAD
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/dashboard",
      element: <StudentDashboard />,
    },
    {
      path: "/verify",
      element: <Verify />,
    },
    {
      path: "/requests",
      element: <Requests />,
    },
  ]);

  return (
    <>
      <Navbar />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
=======
	{
		path: "/register",
		element: <><Navbar /><Register/></>
	},
	{
		path: "/dashboard",
		element: <><Navbar /><StudentDashboard/></>
	},
	{
		path: "/verify/:token",
		element: <><Navbar /><Verify/></>
	},
	{
		path:"/requests",
		element: <><Navbar /><Requests/></>
	},
	{
		path:"/registerStaff",
		element: <><Navbar /><RegisterStaff/></>
	}
  ]);


  
	return (
		<>
			<RouterProvider router={router}>
			</RouterProvider>
		</>
	);
>>>>>>> 353f8bc661a30a9f45df4684d0b206a64c84a51b
};

export default App;
