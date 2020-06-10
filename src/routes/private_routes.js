import React from 'react'

import { Route, Redirect } from 'react-router'

const Private_routes = props => {
    const is_logged = !!localStorage.getItem('app_token')
    return is_logged ? <Route {...props} /> : <Redirect to="/sign_in" />
}

export default Private_routes