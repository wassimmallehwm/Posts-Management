import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState, useContext } from 'react'
import { Button, Form } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import {useForm} from '../utils/hooks';

const PostForm = () => {
    const initState = {
        username: '',
        password: ''
    }
    const {onChange, onSubmit, values } = useForm(createPostCallback, initState)

    const [createPost, {error}] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result){
            console.log(result)
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts]
                }
            })
            values.body = ''
        },
        onError(err){
            console.log(error);
        }
    })

    function createPostCallback(){
        createPost();
    }
    return (
        <>
        <Form onSubmit={onSubmit}>
            <h2>Create a post</h2>

            <Form.Field>
                <Form.Input
                    placeholder="Hi World!"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error? true : false}
                    />
                    <Button type="submit" color="teal">
                        Submit
                    </Button>
            </Form.Field>
        </Form>
        {
            error && (
                <div className="ui error message" style={{marginBottom: "20px"}}>
                    <ul className="list">
                        <li> {error.graphQLErrors[0].message} </li>
                    </ul>
                </div>
            )
        }
        </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String){
        createPost(body: $body){
            _id body createdAt username
            likes{
                _id username createdAt
            }
            likeCount
            comments{
                _id username body createdAt
            }
            commentCount
        }
    }
`

export default PostForm
