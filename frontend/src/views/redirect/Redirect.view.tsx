import React, {FunctionComponent, useMemo} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { refreshAccessTokenGet } from '@api/fetch/post'

export const Redirect: FunctionComponent = () => {
    const location = useLocation();
    const token = location.search.split("=")[1]

    useMemo(() => {
        if(!localStorage.getItem('refresh-token')) {
            refreshAccessTokenGet(token)
        }
    }, [])

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