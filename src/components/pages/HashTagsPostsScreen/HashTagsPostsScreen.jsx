import { Container, Main, Panel, Posts, Sidebar, Line, Hashtags, TimelineTitle } from "./HashTagsPostsScreenStyle.jsx";
import UserContext from '../../contexts/UserContext.js'
import { useEffect, useState, useContext } from "react";
import Loading from "../../Loading/Loading.js";
import axios from 'axios';
import DeletePost from "../EditPost/DeletePost.jsx";
import Header from "../../templates/Header/Header";
import { getCookieByName, config, BASE_URL } from "../../../mock/data";
import { useNavigate, Link, useParams } from "react-router-dom";
import LikePost from "../LikePost/LikePost.jsx";
import { ReactTagify } from "react-tagify";
import SearchBox from "../../templates/SearchBox/SearchBox.jsx";
import UpdateContext from "../../contexts/UpdateContext.js";
import { GetPosts } from "../timeline/auxiliaryFunctions.js";

export default function UserPage() {
    const { hashtag } = useParams();
    const [loading, setLoading] = useState(false);
    const { updatePage, setUpdatePage } = useContext(UpdateContext);

    const [trends, setTrends] = useState([]);
    const [posts, setPosts] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const verifyUser = user === undefined;
    const [userData, setUserData] = useState();
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        const tokenCookie = getCookieByName('token');
        if (tokenCookie) {
            setUser({ token: tokenCookie });
            navigate(`/hashtag/${hashtag}`, { replace: true });
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
        const header = verifyUser ? "" : config(user.token);
        const trends = axios.get(`${BASE_URL}/trends`, header);
        trends.then((r) => {
            setTrends(r.data);
        }).catch((err) => {
            console.log(err)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatePage]);

    function GetHashtags({ item }) {

        let name = (item.name).replace('#', '');

        return (
            <Link to={`/hashtag/${name}`} onClick={() => setUpdatePage(!updatePage)}>
                <p> {item.name}</p>
            </Link>

        )
    }
    return (
        <Container>
            <Header userInfo={verifyUser ? "" : userInfo} />
            <SearchBox />
            <Main>
                <Panel>
                    <div>

                        <TimelineTitle>{hashtag}</TimelineTitle>

                        <div style={{ display: 'flex', width: '100%' }}>
                            <Posts>
                                {
                                    posts.length === 0 ? <h1>There are no posts yet</h1> :
                                        posts.map((item, index) => { return (<GetPosts key={index} item={item} loading={loading} setPosts={setPosts} modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} navigate={navigate} />) })
                                }
                            </Posts>
                            <Sidebar>
                                <h2>Trending</h2>
                                <Line></Line>
                                <Hashtags>
                                    {(trends.length === 0) ? '' : trends.map((item, index) => { return (<GetHashtags key={index} item={item} />) })}
                                </Hashtags>
                            </Sidebar>
                        </div>
                    </div>
                </Panel>
            </Main>
        </Container>
    )
}

