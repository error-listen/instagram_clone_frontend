import React, { useEffect, useState, Fragment, useRef } from 'react'

import api from '../services/api'

import HEADER from '../components/header'
import FOOTER from '../components/footer'
import PROFILE_PICTURE from '../components/profile_picture'

import play_image from '../assets/images/play.png'

import '../styles/profile.css'

function Profile({ match }) {

    const [user, set_user] = useState('')
    const [user_posts, set_user_posts] = useState([])
    const [user_logged, set_user_logged] = useState([])

    const modal = useRef(null)
    const input_file = useRef(null)

    useEffect(() => {

        async function load_profile() {

            const get_profile = await api.get(`/profile/${match.params.username}`)

            const get_posts = await api.get('/posts')

            const get_user_logged = await api.get('user')

            set_user_logged(get_user_logged.data.user)

            function filter_by_author(post) {
                return post.author === match.params.username
            }

            set_user_posts(get_posts.data.posts.filter(filter_by_author))
            set_user(get_profile.data.user)

            document.title = `${get_profile.data.user.full_name} (@${get_profile.data.user.username}) • Instagram Photos`
        }

        load_profile()

    }, [match.params.username])

    async function add_picture_profile(e) {

        let filePath = input_file.current.value
        let allowed_extensions_image = /(\.jpg|\.jpeg|\.png|\.gif)$/i

        if (!allowed_extensions_image.exec(filePath)) {
            modal.current.style.display = 'none'
            return
        }

        const data = new FormData()
        data.append('user_id', user._id)
        data.append('file', e.target.files[0])

        modal.current.style.display = 'none'

        await api.post('user/add/picture', data)

        alert('Profile photo may take a while to show')
    }

    async function dele_picture_profile() {
        await api.post('user/delete/picture', { user_id: user._id })

        window.location.reload()
    }

    function play_video(video_id) {
        const video = document.getElementById(video_id)
        const button = document.getElementsByClassName('button')

        for (let i = 0; i < button.length; i++) {
            if (button[i].id === video_id) {
                button[i].style.display = 'none'
            }
        }

        video.play()
    }

    function pause_video(video_id) {
        const video = document.getElementById(video_id)

        if (video.play) {
            const button = document.getElementsByClassName('button')

            for (let i = 0; i < button.length; i++) {
                if (button[i].id === video_id) {
                    button[i].style.display = 'block'
                }
            }
            video.pause()
        }
    }

    function open_modal() {
        if (match.params.username === user_logged.username) {
            modal.current.style.display = 'block'
        }
    }

    function close_modal() {
        modal.current.style.display = 'none'
    }

    return (
        <Fragment>
            <HEADER />
            <div className="container_profile">
                <div className="modal" ref={modal}>
                    <div className="modal_content">
                        <h3>Change profile photo</h3>
                        <input type="file" id="file" onChange={e => add_picture_profile(e)} ref={input_file} />
                        <label htmlFor="file">Upload photo</label>
                        <button onClick={dele_picture_profile}>Remove current photo</button>
                        <button onClick={close_modal}>Cancel</button>
                    </div>
                </div>
                <article>
                    <div className="article_header">
                        <PROFILE_PICTURE picture={user.picture_url} class={"picture_larger"} handleClick={open_modal} />
                        <div className="profile_informations">
                            <h1>{user.username}</h1>
                            <p className="bold_text">{user.full_name}</p>
                        </div>
                    </div>
                    <div className="article_body">
                        <div className="separate">
                            <hr />
                            <div className="links">
                                <span className="border_route">
                                    <svg aria-label="Posts" fill="#262626" height="12" viewBox="0 0 48 48" width="12"><path clipRule="evenodd" d="M45 1.5H3c-.8 0-1.5.7-1.5 1.5v42c0 .8.7 1.5 1.5 1.5h42c.8 0 1.5-.7 1.5-1.5V3c0-.8-.7-1.5-1.5-1.5zm-40.5 3h11v11h-11v-11zm0 14h11v11h-11v-11zm11 25h-11v-11h11v11zm14 0h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11zm14 28h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11z" fillRule="evenodd">
                                    </path>
                                    </svg>
                                    <span className="bold_text">POSTS</span>
                                </span>
                            </div>
                        </div>
                        <div className="posts">
                            {user_posts.map(post => {
                                return (
                                    <div key={post._id}>
                                        {post.type === "image" ? <img src={post.file_url} alt={!post.description ? "" : post.description} /> : <div className="container_video"><video id={post._id} onClick={() => pause_video(post._id)}><source src={post.file_url}></source> </video><span className="button" id={post._id} onClick={() => play_video(post._id)}><img alt="Play" src={play_image} /></span></div>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </article>
            </div>
            <FOOTER />
        </Fragment>
    )
}

export default Profile