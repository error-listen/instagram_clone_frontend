import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import api from '../services/api'

import PROFILE_PICTURE from './profile_picture'

import instagram_logo from '../assets/images/instagram_logo.png'
import icon_camera_instagram from '../assets/images/icon_camera_instagram.png'
import icon_logout from '../assets/images/icon_logout.png'

import '../styles/header.css'

function Header() {

    const [user_logged, set_user_logged] = useState([])

    useEffect(() => {

        async function get_user() {
            const get_user_loged = await api.get('user')

            set_user_logged(get_user_loged.data.user)
        }

        get_user()

    }, [])

    function logout(){
        localStorage.removeItem('@instagram_token')

        window.location.reload()
    }

    return (
        <header>
            <div>
                <Link to="/">
                    <img src={instagram_logo} alt="Instagram logo" />
                </Link>
            </div>
            <div className="header_end">
                <Link to="/post/create">
                    <img src={icon_camera_instagram} alt="Create post"
                        width="25px"
                        height="25px"
                    />
                </Link>
                <Link to={`/profile/${user_logged.username}`}>
                    <PROFILE_PICTURE picture={user_logged.picture_url} class={'picture_small'} />
                </Link>
                <button onClick={logout}>
                    <img src={icon_logout} alt="Logout"
                        width="25px"
                        height="25px" />
                </button>
            </div>
        </header >
    )
}

export default Header