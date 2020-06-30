import React, { useState, useRef, useEffect } from 'react'

import { Link } from 'react-router-dom'

import api from '../services/api'

import '../styles/sign_up.css'

import loading_gif from '../assets/images/loading.gif'

function Sign_up({ history }) {

    const [username, set_username] = useState('')
    const [full_name, set_full_name] = useState('')
    const [password, set_password] = useState('')
    const [error_message, set_error_message] = useState('')
    const [loading, set_loading] = useState(false)

    const button_sign_up = useRef(null)

    document.title = 'Sign Up • Instagram'

    useEffect(() => {

        if(localStorage.getItem('app_token')){
            history.push('/')
        }

        if (password.length >= 8 && username.length > 3) {
            button_sign_up.current.style.backgroundColor = '#3897f0'
            button_sign_up.current.style.cursor = 'pointer'
            button_sign_up.current.disabled = false
        } else {
            button_sign_up.current.style.backgroundColor = '#C3E0FB'
            button_sign_up.current.style.cursor = 'unset'
            button_sign_up.current.disabled = true
        }

    })

    async function handle_sign_up(e) {
        e.preventDefault()

        set_loading(true)

        set_error_message('')

        button_sign_up.current.style.backgroundColor = '#C3E0FB'
        button_sign_up.current.style.cursor = 'unset'
        button_sign_up.current.disabled = true

        if (/\s/.test(username) || /\s/.test(password)) {
            set_error_message('Username and password cannot have space')
            button_sign_up.current.style.backgroundColor = '#3897f0'
            button_sign_up.current.style.cursor = 'pointer'
            button_sign_up.current.disabled = false
            set_loading(false)
            return
        }

        const get_user_token = await api.post('sign_up', {
            username: username.toLowerCase(),
            full_name,
            password
        })

        if(!get_user_token.data.user && get_user_token.data.message !== 'Created user'){
            set_error_message(get_user_token.data.message)
            button_sign_up.current.style.backgroundColor = '#3897f0'
            button_sign_up.current.style.cursor = 'pointer'
            button_sign_up.current.disabled = false
            set_loading(false)
            return
        }

        if (!get_user_token) {
            button_sign_up.current.style.backgroundColor = '#3897f0'
            button_sign_up.current.style.cursor = 'pointer'
            button_sign_up.current.disabled = false
            set_loading(false)
            return 
        }

        localStorage.setItem('app_token', get_user_token.data.token)

        set_loading(false)

        history.push('/')
    }

    function render_error_message() {
        if (error_message) {
            return <p className="error_sign_up">{error_message}</p>
        }
    }

    function render_loading_gif(){
        if(loading){
            return <img src={loading_gif} alt={'Loading...'} />
        }else{
            return <p>Sign Up</p>
        }
    }

    return (
        <div className="container_sign_up" >
            <form>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2000px-Instagram_logo.svg.png" width="200px" alt="Instagram logo" />
                <h3>Sign up to see photos and videos of your friends.</h3>
                <input type="text" placeholder="Username" value={username} onChange={e => set_username(e.target.value)} />
                <input type="text" placeholder="Full name" value={full_name} onChange={e => set_full_name(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e => set_password(e.target.value)} />
                {render_error_message()}
                <button onClick={handle_sign_up} ref={button_sign_up}>{render_loading_gif()}</button>
            </form>
            <div className="have_acount_container">
                <span>Do you have an account?</span><Link to='/sign_in'>Sign In</Link>
            </div>
        </div>
    )
}

export default Sign_up