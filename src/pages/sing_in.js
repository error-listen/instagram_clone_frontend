import React, { useState, useRef, useEffect } from 'react'

import {Link} from 'react-router-dom'

import api from '../services/api'

import { sign_in } from '../services/auth'

import phones_image from '../assets/images/phones.png'
import screenshot_1 from '../assets/images/screenshot_1.jpg'
import screenshot_2 from '../assets/images/screenshot_2.jpg'
import screenshot_3 from '../assets/images/screenshot_3.jpg'
import screenshot_4 from '../assets/images/screenshot_4.jpg'
import screenshot_5 from '../assets/images/screenshot_5.jpg'
import loading_gif from '../assets/images/loading.gif'

import '../styles/sign_in.css'

function Sign_in({ history }) {

    const [username, set_username] = useState('')
    const [password, set_password] = useState('')
    const [error_message, set_error_message] = useState('')
    const [loading, set_loading] = useState(false)

    const button_sign_in = useRef(null)

    document.title = 'Sign In • Instagram'

    useEffect(() => {

        if(localStorage.getItem('@instagram_token')){
            history.push('/')
        }

        if (password.length >= 8) {
            button_sign_in.current.style.backgroundColor = '#3897f0'
            button_sign_in.current.style.cursor = 'pointer'
            button_sign_in.current.disabled = false
        } else {
            button_sign_in.current.style.backgroundColor = '#C3E0FB'
            button_sign_in.current.style.cursor = 'unset'
            button_sign_in.current.disabled = true
        }
    })

    async function handle_sign_in(e) {
        e.preventDefault()

        set_loading(true)

        button_sign_in.current.style.backgroundColor = '#C3E0FB'
        button_sign_in.current.style.cursor = 'unset'
        button_sign_in.current.disabled = true

        set_error_message('')

        const get_user_token = await api.post('sign_in', {
            username: username.toLowerCase(),
            password
        })

        if(!get_user_token.data.user){
            set_error_message(get_user_token.data.message)
            set_loading(false)
            return
        }

        if (!get_user_token) {
            button_sign_in.current.style.backgroundColor = '#3897f0'
            button_sign_in.current.style.cursor = 'pointer'
            button_sign_in.current.disabled = false
            set_loading(false)
            return
        }

        sign_in(get_user_token.data.token)

        set_loading(false)
        
        history.push('/')
    }

    function render_error_message() {
        if (error_message) {
            return <p className="error_sign_in">{error_message}</p>
        }
    }

    function render_loading_gif(){
        if(loading){
            return <img src={loading_gif} alt={'Loading...'} />
        }else{
            return <p>Sign In</p>
        }
    }

    return (
        <div className="container_sign_in">
            <div className="phones">
                <img src={phones_image} alt="Phones" />
                <img src={screenshot_5} className="screenshot" alt="Screenshot 5" />
                <img src={screenshot_4} className="screenshot" alt="Screenshot 4" />
                <img src={screenshot_3} className="screenshot" alt="Screenshot 3" />
                <img src={screenshot_2} className="screenshot" alt="Screenshot 2" />
                <img src={screenshot_1} className="screenshot" alt="Screenshot 1" />
            </div>
            <div className="form_and_link">
                <form>
                    <div className="form_header">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2000px-Instagram_logo.svg.png" width="200px" alt="Instagram logo" />
                    </div>
                    <div className="form_body">
                        <input type="text" placeholder="Username" value={username} onChange={e => set_username(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={e => set_password(e.target.value)} />
                        {render_error_message()}
                        <button onClick={handle_sign_in} ref={button_sign_in}>{render_loading_gif()}</button>
                    </div>
                </form>
                <div className="no_have_acount_container">
                    <span>Don't have an account?</span><Link to="/sign_up">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default Sign_in