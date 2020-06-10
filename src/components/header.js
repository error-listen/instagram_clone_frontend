import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import api from '../services/api'

import no_user_picture from '../assets/images/no_user_picture.jpg'
import instagram_logo from '../assets/images/instagram_logo.png'
import icon_camera_instagram from '../assets/images/icon_camera_instagram.png'
import icon_logout from '../assets/images/icon_logout.png'

import '../styles/header.css'

function Header() {

    const [user_logged, set_user_logged] = useState([])

    const [token] = useState(`Bearer ${localStorage.getItem('app_token')}`)

    useEffect(() => {

        async function get_user() {
            const get_user_loged = await api.get('user', {
                headers: {
                    authorization: token
                }
            })

            set_user_logged(get_user_loged.data.user)

        }

        get_user()

    }, [token])

    function logout(){
        localStorage.removeItem('app_token')

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
                    <img src={!user_logged.picture_url ? no_user_picture : user_logged.picture_url} alt={`Pic ${user_logged.username}`} />
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