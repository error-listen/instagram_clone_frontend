import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import FEED_PAGE from '../pages/feed'
import PROFILE_PAGE from '../pages/profile'
import SIGN_IN_PAGE from '../pages/sing_in'
import SIGN_UP_PAGE from '../pages/sign_up'
import CREATE_POST_PAGE from '../pages/create_post'
import NOT_FOUND_PAGE from '../pages/not_found'

import PRIVATE_ROUTE from './private_routes'

function Routes() {

    return (
        <BrowserRouter>
            <Switch>
                <PRIVATE_ROUTE component={FEED_PAGE} exact path="/" />
                <PRIVATE_ROUTE component={CREATE_POST_PAGE} path="/post/create" />
                <PRIVATE_ROUTE component={PROFILE_PAGE} path="/profile/:username" />
                <Route path="/sign_in" component={SIGN_IN_PAGE}  />
                <Route path="/sign_up" component={SIGN_UP_PAGE} />
                <Route path='*' exact={true} component={NOT_FOUND_PAGE} />
            </Switch>
        </BrowserRouter >
    )
}

export default Routes