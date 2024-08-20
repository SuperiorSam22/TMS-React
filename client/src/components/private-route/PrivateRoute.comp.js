import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { loginSuccess } from "../login/loginSlice";
import { getUserProfile } from "../../pages/dashboard/userAction";

import { fetchNewAccessJWT } from "../../api/userApi";

import { DefaultLayout } from "../../layout/DefaultLayout";

export const PrivateRoute = () => {
//   const dispatch = useDispatch();
// 	const { isAuth } = useSelector(state => state.login);
// 	const { user } = useSelector(state => state.user);

// 	useEffect(() => {
// 		const updateAccessJWT = async () => {
// 			const result = await fetchNewAccessJWT();
// 			result && dispatch(loginSuccess());
// 		};

// 		!user._id && dispatch(getUserProfile());

// 		!sessionStorage.getItem("accessJWT") &&
// 			localStorage.getItem("crmSite") &&
// 			updateAccessJWT();

// 		!isAuth && sessionStorage.getItem("accessJWT") && dispatch(loginSuccess());
// 	}, [dispatch, isAuth, user._id]);

let isAuth = true;
  return isAuth ? (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  ) : (
    <Navigate to={"/"} />
  );
};
