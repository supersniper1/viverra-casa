import React, {FunctionComponent, useEffect} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { refreshAccessTokenGet } from '@api/fetch/post'

export const Redirect: FunctionComponent = () => {
    const location = useLocation();
    const token = location.search.split("=")[1]

    useEffect(() => {
        if(!localStorage.getItem('refresh-token')) {
            refreshAccessTokenGet(token)
        }
    }, [])
    console.log(token)

    if (localStorage.getItem("access-token")) {
        return (
            <Navigate to="/main"/>
        )
    }

    return (
        <div>
            anal
        </div>
    )
}