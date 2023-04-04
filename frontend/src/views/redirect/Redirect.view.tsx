import React, {FunctionComponent, useEffect} from "react";
import { useLocation } from "react-router-dom";
import { refreshAccessTokenGet } from '@api/fetch/post'

export const Redirect: FunctionComponent = () => {
    const location = useLocation();
    const token = location.search.split("=")[1]

    useEffect(() => {
        if(!localStorage.getItem('refresh-token')) {
            const newToken = refreshAccessTokenGet(token)
            console.log(newToken)
        }
    }, [])
    console.log(token)

    return (
        <div>
            anal
        </div>
    )
}