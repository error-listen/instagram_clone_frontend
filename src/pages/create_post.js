import React, { useRef, useState, Fragment, useEffect } from 'react'

import api from '../services/api'

import HEADER from '../components/header'
import FOOTER from '../components/footer'

import '../styles/create_post.css'

import loading_gif from '../assets/images/loading.gif'

function Post({history}) {

    const [file_name, set_file_name] = useState('')
    const [file, set_file] = useState(null)
    const [description, set_description] = useState('')
    const [type, set_type] = useState('')
    const [error_message, set_error_message] = useState('')
    const [loading, set_loading] = useState(false)

    const input_file = useRef(null)
    const button_post = useRef(null)

    document.title = 'Instagram'

    useEffect(() => {

        if (!file) {
            button_post.current.style.backgroundColor = '#C3E0FB'
            button_post.current.style.cursor = 'unset'
            button_post.current.disabled = true
        } else {
            button_post.current.style.backgroundColor = '#3897f0'
            button_post.current.style.cursor = 'pointer'
            button_post.current.disabled = false
        }

    })

    async function handle_post(e){
        e.preventDefault()

        set_loading(true)

        input_file.current.disabled = true

        button_post.current.style.backgroundColor = '#C3E0FB'
        button_post.current.style.cursor = 'unset'
        button_post.current.disabled = true

        const get_user_logged = await api.get('/user')

        const data = new FormData()
        data.append('user_id', get_user_logged.data.user._id)
        data.append('description', description)
        data.append('file', file)
        data.append('type', type)

        const post = await api.post('post/create', data)

        if(post.data.message === 'Maximum file size of 20MB'){
            set_error_message('Maximum file size of 20MB')
            set_loading(false)
            input_file.current.disabled = false
            return
        }

        set_loading(false)
        input_file.current.disabled = false
        history.push('/')

    }

    function handle_file(e) {

        set_error_message('')
        set_file_name('')

        let filePath = input_file.current.value
        let allowed_extensions_image = /(\.jpg|\.jpeg|\.png|\.gif)$/i
        let allowed_extensions_video = /(\.mp4|\.avi|\.m4v|\.mpg|\.mov|\.wmv|\.flv|\.mkv|\.rm|\.3gp)$/i

        if (!allowed_extensions_image.exec(filePath) && !allowed_extensions_video.exec(filePath)) {
            set_error_message('Invalid file format')
            return 
        }

        if(allowed_extensions_image.exec(filePath)){
            set_type('image')
        }else if(allowed_extensions_video.exec(filePath)){
            set_type('video')
        }

        set_file_name('File to upload: ' + input_file.current.value.slice(12))
        set_file(e.target.files[0])
    }

    function render_error_message() {
        if (error_message) {
            return <p>{error_message}</p>
        }
    }

    function render_loading_gif(){
        if(loading){
            return <img src={loading_gif} alt={'Loading...'} />
        }else{
            return <p>Post</p>
        }
    }

    return (
        <Fragment>
            <HEADER />
            <div className="container_post">
                <form>
                    <input type="file" id="file" ref={input_file} onChange={e => handle_file(e)} accept="video/*,image/*" />
                    <label htmlFor="file">Choose a file</label>
                    <p>{file_name}</p>
                    {render_error_message()}
                    <textarea placeholder="Description" onChange={e => set_description(e.target.value)} />
                    <button onClick={handle_post} ref={button_post}>{render_loading_gif()}</button>
                </form>
            </div>
            <FOOTER />
        </Fragment>
    )
}

export default Post