import React, { useState, useEffect, useCallback } from "react";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Register from "./pages/Register/Register";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import MarkSheetUploadPage from "./pages/MarkSheetUploadPage/MarkSheetUploadPage";
import { useCVPContext } from "./Context/CVPContext";
import { useAuth } from "./Context/AuthContext";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/issueMarksheet",
      element: <MarkSheetUploadPage />,
    },
	{
		path: "/register",
		element: <Register/>
	},
	{
		path: "/dashboard",
		element: <StudentDashboard/>
	},
  ]);

	return (
		<>
			<Navbar />
			<RouterProvider router={router}></RouterProvider>
		</>
	);
};

export default App;
