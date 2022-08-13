
import { Container, Main, Panel, Posts, NewPost, Post, Perfil, PostContent, Sidebar, Line, Hashtags, LoadSpinner, Preview, Infos, TimelineTitle } from "./TimelineStyle";
import UserContext from '../../contexts/UserContext.js'
import { useEffect, useState, useContext } from "react";
import Loading from "../../Loading/Loading.js";
import axios from 'axios';
import DeletePost from "../EditPost/DeletePost.jsx";
import Header from "../Header/Header";
import { config, BASE_URL, getCookieByName } from "../../../mock/data";
import LikePost from "../LikePost/LikePost.jsx";
import { useNavigate } from "react-router-dom";
import { BiUserCircle } from 'react-icons/bi';
import SearchBox from "../SearchBox/SearchBox";

function TimeLine() {
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    const [disable, setDisable] = useState(false)
    const [loading, setLoading] = useState(false)
    const [updatePage, setUpdatePage] = useState(true)
    const [posts, setPosts] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate();
    const verifyUser = user === undefined;

    const [userInfo, setUserInfo] = useState();

    // const profilePicture = userInfo === undefined ? <BiUserCircle /> : <img src={verifyUser ? "" : userInfo.imageUrl} alt="" />;

    useEffect(() => {
        const tokenCookie = getCookieByName('token');
        if (tokenCookie) {
            setUser({ token: tokenCookie });
        }
        if (verifyUser) {
            navigate('/', { replace: true });
        } else {
            getUserInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function getUserInfo() {
        const userToken = verifyUser ? "" : user.token;
        const token = config(userToken);

        axios.get(`${BASE_URL}/user/me`, token)
            .then(response => {
                setUserInfo(response.data);
            })
            .catch(error => {
                console.error(error);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

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
        const promise = axios.get(`${BASE_URL}/timeline`)

        promise.then((res) => {
            setPosts(res.data)
            setLoading(false)
        }).catch((err) => {
            console.error(err)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatePage])


    function GetPosts({ item }) {
        const url = 'https://medium.com/@pshrmn/a-simple-react-router'
        return (
            <Post>
                <Perfil>
                    <img src={item.imageUrl} alt="" />
                    <LikePost id={item.id} />
                </Perfil>
                <PostContent>
                    <h3>{item.name} </h3>
                    <p>{item.description}</p>

                    <Preview onClick={() => { window.open(item.url, '_blank') }}>
                        <Infos>
                            <h2>{item.titlePreview}</h2>
                            <h3>{item.descriptionPreview}</h3>
                            <h4>{item.url}</h4>
                        </Infos>
                        <img src={item.imagePreview} alt="" />
                    </Preview>
                    <DeletePost id={item.id} modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} setPosts={setPosts} setLoading={setLoading} />
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

        const promise = axios.post(`${BASE_URL}/timeline`, body, config(user.token))

        promise.then((res) => {
            setUpdatePage(!updatePage)
        }).catch((err) => {
            alert('Houve um erro ao publicar seu link')
            console.error(err)
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
            <Header userInfo={verifyUser ? "" : userInfo} />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <SearchBox />
            </div>
            <Main>
                <Panel>
                    <div>
                        <TimelineTitle>timeline</TimelineTitle>
                        <div style={{ display: 'flex', width: '100%' }}>
                            <Posts>
                                <NewPost>
                                    <Perfil>
                                        <img src={userInfo === undefined ? "" : userInfo.imageUrl} alt="" />
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
                        </div>
                    </div>
                </Panel>
            </Main>
        </Container>
    )
}

export default TimeLine;