import React, { useEffect, useState, Fragment } from 'react'

import { Link } from 'react-router-dom'

import io from 'socket.io-client'

import api from '../services/api'

import HEADER from '../components/header'
import FOOTER from '../components/footer'
import PROFILE_PICTURE from '../components/profile_picture'

import play_image from '../assets/images/play.png'

import '../styles/feed.css'

function Feed() {

    const [posts, set_posts] = useState([])
    const [user_logged, set_user_logged] = useState([])

    document.title = 'Instagram'

    useEffect(() => {

        async function load_feed() {
            const get_posts = await api.get('posts')
            set_posts(get_posts.data.posts)

            const get_user_loged = await api.get('user')
            set_user_logged(get_user_loged.data.user)
        }

        load_feed()

    }, [])

    useEffect(() => {

        const socket = io('https://project-instagram-backend.herokuapp.com', {
            query: { user: user_logged._id }
        })
        socket.on('post', new_post => {
            set_posts(posts.map(post => post._id === new_post._id ? new_post : post))
        })
    })

    function check_like(like) {
        if (like.username === user_logged.username) {
            return true
        } else {
            return false
        }
    }

    async function like(post_id) {
        await api.post('/post/like', {
            post_id,
            user_id: user_logged._id,
        })
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

    return (
        <Fragment>
            <HEADER />
            <div className="container_feed">
                {posts.map(post => {
                    return (
                        <article key={post._id}>
                            <div className="article_header">
                                <Link to={`/profile/${post.author}`}>
                                    <PROFILE_PICTURE class={'picture_normal'} picture={post.picture_url} />
                                </Link>
                                <Link to={`/profile/${post.author}`}>
                                    <p className="bold_text">{post.author}</p>
                                </Link>
                            </div>
                            <div className="article_content">
                                {post.type === "image" ? <img src={post.file_url} width="100%" alt={!post.description ? "" : post.description} /> : <div><video width="100%" onClick={() => pause_video(post._id)} id={post._id}><source src={post.file_url}></source></video><span className="button" id={post._id} onClick={() => play_video(post._id)}><img alt="Play" src={play_image} /></span></div>}
                                <button onClick={() => like(post._id)}>
                                    {post.likes.filter(check_like).length > 0 ? 
                                    <svg aria-label="Dislike" fill="#ed4956" height="24" viewBox="0 0 48 48" width="24"><path clipRule="evenodd" d="M35.3 35.6c-9.2 8.2-9.8 8.9-11.3 8.9s-2.1-.7-11.3-8.9C6.5 30.1.5 25.6.5 17.8.5 9.9 6.4 3.5 13.7 3.5 20.8 3.5 24 8.8 24 8.8s3.2-5.3 10.3-5.3c7.3 0 13.2 6.4 13.2 14.3 0 7.8-6.1 12.3-12.2 17.8z" fillRule="evenodd"></path></svg>  : 
                                    <svg aria-label="Like" fill="#262626" height="24" viewBox="0 0 48 48" width="24"> <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>}
                                </button>
                            </div>
                            <div className="article_footer">
                                <div className="post_informations">
                                    {post.likes.length > 1
                                        ?
                                        <Link to={`/profile/${post.likes[0].username}`}>
                                            <PROFILE_PICTURE class={'picture_small'} picture={post.likes[0] === undefined ? undefined : post.likes[0].picture_url} />
                                        </Link>
                                        :
                                        <span></span>}
                                    {post.likes.length > 0
                                        ? post.likes.length > 5
                                            ? <span>Liked by <Link to={`/profile/${post.likes[0].username}`}><span className="bold_text">{post.likes[0].username}</span></Link> <span>and</span> {post.likes.length > 1
                                                ? <span className="bold_text"> others {post.likes.length - 1} people</span>
                                                : <span></span>}</span> : <span className="bold_text"><p>{post.likes.length} likes</p></span>
                                        : <span></span>}

                                </div>
                                {!post.description ? <span></span> : <p><span className="bold_text">{post.author}</span> {post.description}</p>}
                            </div>
                        </article>
                    )
                })}
            </div>
            <FOOTER />
        </Fragment>
    )
}


export default Feed