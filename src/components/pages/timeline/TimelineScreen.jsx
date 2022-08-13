import { Container, Main, Panel, Posts, NewPost, Post, Perfil, PostContent, Sidebar, Line, Hashtags, LoadSpinner, Preview, Infos } from "./TimelineStyle";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import UserContext from '../../contexts/UserContext.js'
import { useEffect, useState, useContext, useRef } from "react";
import Loading from "../../Loading/Loading.js";
import axios from 'axios';
import EditPost from "../EditPost/EditPost.jsx";
import DeletePost from "../EditPost/DeletePost.jsx"
import Header from "../Header/Header";
import { getCookieByName } from "../../../mock/data";
import LikePost from "../LikePost/LikePost.jsx";
import { useNavigate } from "react-router-dom";


function TimeLine() {
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    const [disable, setDisable] = useState(false)
    const [loading, setLoading] = useState(false)
    const [updatePage, setUpdatePage] = useState(true)
    const [posts, setPosts] = useState([])
    const image = 'https://rd1.com.br/wp-content/uploads/2022/08/20220805-neymargol-300x300.jpg'
    const [modalIsOpen, setIsOpen] = useState(false);
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate();
    const verifyUser = user === undefined;

    useEffect(() => {
        if (verifyUser) {
            navigate('/', { replace: true });
        }
    }, [])

    const hashs = [
        { hashtag: 'neymito' },
        { hashtag: 'neymito' },
        { hashtag: 'neymito' },
        { hashtag: 'neymito' },
        { hashtag: 'neymito' },
        { hashtag: 'neymito' },
        { hashtag: 'neymito' },
        { hashtag: 'neymito' },
        { hashtag: 'neymito' }
    ]

    useEffect(() => {
        const tokenCookie = getCookieByName('token');
        if (tokenCookie) {
            setUser({ token: tokenCookie });
            navigate('/timeline', { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        const config = {
            headers: {
                "Authorization": `Bearer ${verifyUser ? "" : user.token}`
            }
        }

        const promise = axios.get('http://localhost:5000/timeline', config)

        promise.then((res) => {
            console.log(res.data)
            setPosts(res.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatePage])

    function GetPosts({ item }) {
        const url = 'https://medium.com/@pshrmn/a-simple-react-router'
        const [message, setMessage] = useState(item.description)
        const [editMode, setEditMode] = useState(false)
        return (
            <Post>
                <Perfil>
                    <img src="https://rd1.com.br/wp-content/uploads/2022/08/20220805-neymargol-300x300.jpg" alt="" />
                    <LikePost id={item.id} />
                </Perfil>
                <PostContent>
                    <h3>{item.name} </h3>
                    <EditPost description={item.description} editMode = {editMode} setEditMode = {setEditMode}  message = {message} setMessage = {setMessage} id={item.id} setPosts = {setPosts}/>
                    <Preview onClick={() => { window.open(item.url, '_blank') }}>
                        <Infos>
                            <h2>{item.titlePreview}</h2>
                            <h3>{item.descriptionPreview}</h3>
                            <h4>{item.url}</h4>
                        </Infos>
                        <img src={item.imagePreview} />
                    </Preview>
                    {
                        item.isMyPost === 'true' ?
                            <DeletePost id={item.id} modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} setPosts={setPosts} setEditMode = {setEditMode} editMode = { editMode}/> :
                            ''
                    }

                </PostContent>
            </Post>
        )
    }

    function GetHashtags({ item }) {

        return (
            <p># {item.hashtag}</p>
        )
    }

    function publish(event) {
        event.preventDefault();
        const body = {
            url,
            description
        }

        const urlEmpty = url.length === 0
        const descriptionEmpty = url.length === 0

        if (urlEmpty) {
            alert('Data cannot be empty')
            setDisable(!disable)
            return
        }

        const promise = axios.post('http://localhost:5000/timeline', body)

        promise.then((res) => {
            console.log(res.data)
            setUpdatePage(!updatePage)
        }).catch((err) => {
            alert('Houve um erro ao publicar seu link')
            console.log(err)
        })

        setDisable(!disable)
        setDescription('')
        setUrl('')
    }

    function ShowPosts() {

        if (posts.length === 0) {
            return (
                <h1>There are no posts yet</h1>
            )
        }
        else {
            return (
                posts.map((item, index) => { return (<GetPosts key={index} item={item} />) })
            )
        }
    }

    return (
        <Container>
            <Header user={verifyUser ? "" : user} />
            {/* <div>
                <LinkPreview url="https://github.com/wei/socialify" width="400px" height={100} />
            </div> */}
            <Main>
                <h1>timeline</h1>
                <Panel>
                    <Posts>
                        <NewPost>
                            <Perfil>
                                <img src="https://rd1.com.br/wp-content/uploads/2022/08/20220805-neymargol-300x300.jpg" alt="" />
                            </Perfil>
                            <PostContent>
                                <h2>What are you going to share today?</h2>
                                <form onSubmit={publish}>
                                    <input type='text' placeholder="http://..." onChange={(e) => { setUrl(e.target.value) }} value={url} />
                                    <textarea placeholder="Awesome article about #javascript" onChange={(e) => { setDescription(e.target.value) }} value={description}></textarea>
                                    <button disabled={disable} onClick={() => {
                                        setDisable(true)
                                    }}>{disable ? 'Publishing' : 'Publish'}</button>
                                </form>
                            </PostContent>
                        </NewPost>
                        {!loading ?
                            <ShowPosts /> :
                            <LoadSpinner>
                                <Loading />
                            </LoadSpinner>}
                    </Posts>
                    <Sidebar>
                        <h2>Trending</h2>
                        <Line></Line>
                        <Hashtags>
                            {hashs.map((item, index) => { return (<GetHashtags key={index} item={item} />) })}
                        </Hashtags>
                    </Sidebar>
                </Panel>
            </Main>
        </Container>
    )
}

export default TimeLine;