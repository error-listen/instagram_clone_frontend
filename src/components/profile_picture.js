import React, { useEffect, useState } from 'react'

import api from '../services/api'

import no_user_picture from '../assets/images/no_user_picture.jpg'

import '../styles/profile_picture.css'

function Picture_user(props) {

    const [user_logged, set_user_logged] = useState([])

    useEffect(() => {

        async function get_user() {
            const get_user_loged = await api.get('user')

            set_user_logged(get_user_loged.data.user)
        }

        get_user()

    }, [])

    if(user_logged){
        return (
            <img src={!props.picture ? no_user_picture : props.picture} onClick={props.handleClick} className={props.class} alt={`Pic ${user_logged.username}`} />
        )
    }else{
        return null
    }
}

export default Picture_user