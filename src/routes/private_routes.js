import React from 'react'

import { Route, Redirect } from 'react-router'

import { is_authenticated } from "../services/auth";

const Private_routes = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            is_authenticated() ? (
                <Component {...props} />
            ) : (
                    <Redirect to={{ pathname: "/sign_in", state: { from: props.location } }} />
                )
        }
    />
)

export default Private_routes