import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import PICTURE_USER from './profile_picture'

import api from '../services/api'

import new_poste from '../assets/images/new_post.png'
import feed from '../assets/images/feed.png'

import '../styles/footer.css'

function Footer() {

    const [user_logged, set_user_logged] = useState([])

    useEffect(() => {

        async function get_user() {
            const get_user_loged = await api.get('user')

            set_user_logged(get_user_loged.data.user)
        }

        get_user()

    }, [])

    return (
        <footer>
            <div>
                <Link to={"/"}>
                    <img src={feed} alt="Feed" />
                </Link>
            </div>
            <div>
                <Link to={"/post/create"}>
                    <img src={new_poste} alt="New Post" />
                </Link>
            </div>
            <div>
                <Link to={`/profile/${user_logged.username}`}>
                    <PICTURE_USER class={"picture_normal"} />
                </Link>
            </div>
        </footer>
    )
}

export default Footer