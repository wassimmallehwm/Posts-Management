import React, {useState} from 'react'
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react'
import { createHttpLink, gql, useMutation, useQuery } from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import MyPopup from './MyPopup';


const DeleteButton = ({postId, commentId, callback}) => {

    const [modalOpen, setModalOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy){
            setModalOpen(false);
            if(!commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: data.getPosts.filter(p => p._id !== postId)
                    }
                })
                if(callback) callback();
            }
        },
        variables:{
            postId,
            commentId
        }
    })

    return (
        <>
            <MyPopup content="Delete">
                <Button as="div" floated="right" color="red" onClick={() => setModalOpen(true)}>
                    <Icon name='trash' style={{ margin: "0" }} />
                </Button>
            </MyPopup>
            <Confirm
                open={modalOpen}
                onCancel={() => { setModalOpen(false) }}
                onConfirm={deletePostOrComment}
            />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`
const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            _id
            comments{
                _id username createdAt body
            }
            commentCount
        }
    }
`

export default DeleteButton