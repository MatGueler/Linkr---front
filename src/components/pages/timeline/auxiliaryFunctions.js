import { useState } from "react";
import Loading from "../../Loading/Loading";
import DeletePost from "../EditPost/DeletePost";
import EditPost from "../EditPost/EditPost";
import LikePost from "../LikePost/LikePost";
import { Infos, LoadSpinner, NewPost, Perfil, Post, PostContent, Preview } from "./TimelineStyle";
import { AiOutlineComment } from 'react-icons/ai';
import CommentPost from "../CommentPost/CommentPost";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL, config } from "../../../mock/data";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";

export function GetPosts({ item, loading, setPosts, modalIsOpen, setIsOpen, navigate }) {

    const [message, setMessage] = useState(item.description);
    const [editMode, setEditMode] = useState(false);
    const [displayComments, setDisplayComments] = useState(false);
    const [commentsList, setCommentsList] = useState([]);
    const { user } = useContext(UserContext);
    const verifyUser = user === undefined;

    useEffect(() => {
        const headers = config(verifyUser ? "" : user.token);
        axios.get(`${BASE_URL}/comment/${item.id}`, headers)
            .then(response => {
                setCommentsList(response.data);
            })
            .catch(error => {
                console.error(error);
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getCommentsNumber() {
        if(commentsList.length === 1) return '1 comment'
        else return `${commentsList.length} comments`
    }

    return (
        <>
            {
                loading ?
                    <LoadSpinner>
                        < Loading />
                    </LoadSpinner > :
                    <div style={{ marginBottom: '20px', backgroundColor: '#1E1E1E', borderRadius: '16px' }}>
                        <Post>
                            <div style={{ display: 'flex' }}>
                                <Perfil>
                                    <img src={item.imageUrl} alt={item.name} />
                                    <LikePost id={item.id} />
                                    <div onClick={() => { setDisplayComments(!displayComments) }} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                        <AiOutlineComment color='#fff' size={25} cursor='pointer' style={{ marginTop: '15px' }} />
                                        <p>{getCommentsNumber()}</p>
                                    </div>
                                </Perfil>
                                <PostContent>
                                    <h3 onClick={() => navigate(`/user/${item.userId}`)}>{item.name} </h3>

                                    <EditPost description={item.description} editMode={editMode} setEditMode={setEditMode} message={message} setMessage={setMessage} id={item.id} setPosts={setPosts} />

                                    <Preview onClick={() => { window.open(item.url, '_blank') }}>
                                        <Infos>
                                            <h2>{item.titlePreview}</h2>
                                            <h3>{item.descriptionPreview}</h3>
                                            <h4>{item.url}</h4>
                                        </Infos>
                                        <img src={item.imagePreview} alt="" />
                                    </Preview>
                                    {
                                        item.isMyPost === "true" ?
                                            <DeletePost id={item.id} modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} setPosts={setPosts} setEditMode={setEditMode} editMode={editMode} /> :
                                            ``
                                    }
                                </PostContent>
                            </div>
                        </Post>
                        <CommentPost displayComments={displayComments} commentsList={commentsList} setCommentsList={setCommentsList} id={item.id} posterId={item.userId} />
                    </div>
            }
        </>
    )
}

export function CreateNewPost({ userInfo, publish, setUrl, url, setDescription, description, disable, setDisable }) {
    return (
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
    )
}
