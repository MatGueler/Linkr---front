import { Container, Main, Panel, Posts, NewPost, Post, Perfil, PostContent, Sidebar, Line, Hashtags, LoadSpinner, Preview, Infos } from ".//HashTag'sPostsScreenStyle.jsx";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import UserContext from '../../contexts/UserContext.js'
import { useEffect, useState, useContext } from "react";
import Loading from "../../Loading/Loading.js";
import axios from 'axios';
import DeletePost from "../EditPost/DeletePost.jsx";
import Header from "../Header/Header";
import { getCookieByName, config, BASE_URL } from "../../../mock/data";
import { useNavigate, Link, useParams } from "react-router-dom";
import LikePost from "../LikePost/LikePost.jsx";
import { ReactTagify } from "react-tagify";

export default function HashTagPage() {
    const { hashtag } = useParams();
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    const [disable, setDisable] = useState(false)
    const [loading, setLoading] = useState(false)
    const [updatePage, setUpdatePage] = useState(true);
    const [trends, setTrends] = useState([]);
    const [posts, setPosts] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate();
    const verifyUser = user === undefined;



    useEffect(() => {
        if (verifyUser) {
            navigate('/', { replace: true });
        }
    }, [])


    useEffect(() => {
        const tokenCookie = getCookieByName('token');
        if (tokenCookie) {
            setUser({ token: tokenCookie });
            navigate(`/hashtag/${hashtag}`, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //requisição de posts com a hashtag
    useEffect(() => {



        const promise = axios.get(`${BASE_URL}/posts/${hashtag}`, config(user.token));

        promise.then((res) => {
            console.log(res.data)
            setPosts(res.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatePage])


    //requisição de trends
    useEffect(() => {
        const trends = axios.get(`${BASE_URL}/trends`, config(user.token));
        trends.then((r) => {
            setTrends(r.data);
        }).catch((err) => {
            console.log(err)
        })
    }, []);


    function GetHashtags({ item }) {

        return (
            <Link to={`/hashtag/${item.name}`}>
                <p># {item.name}</p>
            </Link>

        )
    }

    function GetPosts({ item }) {
        //variaveis para uso na biblioteca tagify
        const tagStyle = {
            fontWeight: 900,
            color: 'white',
            cursor: 'pointer'
        }
        const [contentString, setContentString] = useState(item.description);
        //

        //requisição de hashtags por post
        useEffect(() => {
            axios.get(`${BASE_URL}/hashtags/${item.id}`, config(user.token)).then((r) => {
                let hashs = '';
                for (let i = 0; i < r.data.length; i++) {
                    hashs += ' #' + r.data[i].name;
                }
                setContentString(contentString + hashs);
            }).catch((err) => {
                console.log(err)
            })
        }, []);
        //
        const url = 'https://medium.com/@pshrmn/a-simple-react-router'
        return (
            <Post>
                <Perfil>
                    <img src={item.imageUrl} alt={item.name} />
                    <LikePost id={item.id} />
                </Perfil>
                <PostContent>
                    <h3>{item.name} </h3>
                    {/*o item.description foi incorporado no contentString*/}
                    <ReactTagify
                        tagStyle={tagStyle}
                        tagClicked={(tag) => navigate(`/hashtag/${tag.substring(1, tag.length)}`)}>
                        <p>
                            {contentString}
                        </p>
                    </ReactTagify>

                    <Preview onClick={() => { window.open(item.url, '_blank') }}>
                        <Infos>
                            <h2>{item.titlePreview}</h2>
                            <h3>{item.descriptionPreview}</h3>
                            <h4>{item.url}</h4>
                        </Infos>
                        <img src={item.imagePreview} />
                    </Preview>
                    <DeletePost id={item.id} modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} setPosts={setPosts} setLoading={setLoading} />
                </PostContent>
            </Post>
        )
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
            <Main>
                <h1># {hashtag}</h1>
                <Panel>
                    <Posts>
                        {!loading ?
                            <ShowPosts /> :
                            <LoadSpinner>
                                <Loading />
                            </LoadSpinner>}
                    </Posts>
                    <Sidebar>
                        <h2>Trendings</h2>
                        <Line></Line>
                        <Hashtags>
                            {trends.length === 0 ? 'No trends at the moment' : trends.map((item, index) => { return (<GetHashtags key={index} item={item} />) })}
                        </Hashtags>
                    </Sidebar>
                </Panel>
            </Main>
        </Container>
    )
}