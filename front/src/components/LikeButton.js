import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Button, Icon, Label, Popup } from 'semantic-ui-react';
import MyPopup from './MyPopup';

const LikeButton = ({post : {_id, likes, likeCount}, user}) => {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if(user && likes.find(like => like.username === user.username)){
            setLiked(true)
        } else {
            setLiked(false)
        }
        console.log(liked)
    }, [user, likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: {postId: _id}
    })
    

    const likeButton = user ? (
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
        <Button as={Link} to="/login" color='teal' basic>
            <Icon name='heart' />
        </Button>
    )

    return (
        <MyPopup content={liked ? "Unlike" : "Like"}>
            <Button as='div' labelPosition='right' onClick={likePost}>
                {likeButton}
                <Label basic color='teal' pointing='left'>
                    {likeCount}
                </Label>
            </Button>
        </MyPopup>
    )
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            _id,
            likes{
                _id username
            }
            likeCount
        }
    }
`

export default LikeButton
