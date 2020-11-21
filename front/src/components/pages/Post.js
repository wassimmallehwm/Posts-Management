import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import moment from 'moment'; 
import React, { useState, useRef, useContext } from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Grid, Icon, Label, Loader, Image, Dimmer, Form } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth';
import DeleteButton from '../DeleteButton';
import LikeButton from '../LikeButton';
import Loading from '../Loading';
import MyPopup from '../MyPopup';

const Post = (props) => {
    const postId = props.match.params.postId;
    const [comment, setComment] = useState('');

    const commentInputRef = useRef(null)

    const {user} = useContext(AuthContext);

    const {data} = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })
    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update(){
            setComment('')
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        },
        onError(error){
            console.log(error)
        }
    })

    const deletePostCallback = () => {
        props.history.push('/');
    }

    let postMarkup;
    if(!data){
        postMarkup = (<Loading/>)
    } else {
        const {
            _id,
            body,
            createdAt,
            username,
            comments,
            commentCount,
            likes,
            likeCount
        } = data.getPost;
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image size="small" float="right" src='https://react.semantic-ui.com/images/avatar/large/molly.png'/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>
                                    {username}
                                </Card.Header>
                                <Card.Meta>
                                    {moment(createdAt).fromNow()}
                                </Card.Meta>
                                <Card.Description>
                                    {body}
                                </Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton post={{_id, likes, likeCount}} user={user}/>
                                <MyPopup content="Comment">
                                    <Button as="div"
                                        labelPosition="right"
                                        onClick={() => console.log("comment")}>
                                        <Button basic color="blue">
                                            <Icon name="comments" />
                                        </Button>
                                        <Label basic color="blue" pointing="left">
                                            {commentCount}
                                        </Label>
                                    </Button>
                                </MyPopup>   
                                {
                                    user && user.username === username && 
                                    <DeleteButton callback={deletePostCallback} postId={_id}/>
                                }
                            </Card.Content>
                        </Card>
                        {
                            user && (
                                <Card fluid>
                                    <Card.Content>
                                        <h5>Add a comment</h5>
                                        <Form onSubmit={createComment}>
                                            <div className="ui action input fluid">
                                                <input 
                                                    type="text"
                                                    placeholder="Comment..."
                                                    name="comment"
                                                    value={comment}
                                                    ref={commentInputRef}
                                                    onChange={e => setComment(e.target.value)}
                                                />
                                                <button type="submit"
                                                    className="ui button teal"
                                                    disabled={comment.trim() == ''}>
                                                        Submit
                                                </button>
                                            </div>
                                        </Form>
                                    </Card.Content>
                                </Card>
                            )
                        }
                        {
                            comments.map(comment =>(
                                <Card fluid key={comment._id}>
                                    <Card.Content>
                                        <Card.Header>
                                            {comment.username}
                                        </Card.Header>
                                        <Card.Meta>
                                            {moment(comment.createdAt).fromNow()}
                                        </Card.Meta>
                                        <Card.Description>
                                            {comment.body}
                                        </Card.Description>
                                        {
                                            user && user.username === comment.username && 
                                            <DeleteButton callback={deletePostCallback} commentId={comment._id} postId={_id}/>
                                        }
                                    </Card.Content>
                                </Card>
                            ))
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup
}

const FETCH_POST_QUERY = gql`
    query ($postId:ID!){
        getPost(postId: $postId){
            _id body createdAt username likeCount
            likes{
                _id username createdAt
            }
            commentCount
            comments{
                _id username createdAt body
            } 
        }
    }
`
const CREATE_COMMENT_MUTATION = gql`
    mutation ($postId:ID!, $body: String!){
        createComment(postId: $postId, body: $body){
            _id 
            commentCount
            comments{
                _id username createdAt body
            } 
        }
    }
`

export default Post
