import React, { useContext } from 'react'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Grid, Image, Transition } from 'semantic-ui-react';
import PostCard from '../PostCard';
import { AuthContext } from '../../context/auth';
import PostForm from '../PostForm';
import { FETCH_POSTS_QUERY } from '../../utils/graphql';

const Home = () => {
    const {user} = useContext(AuthContext); 
    const {loading, data} = useQuery(FETCH_POSTS_QUERY);

    if(data){
        console.log(data.getPosts)
    }

    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {
                    user&&
                    <Grid.Column>
                        <PostForm/>
                    </Grid.Column>
                }
                {
                    loading ? (
                        <h1>Loading posts ...</h1>
                    ): (
                        <Transition.Group>
                            {
                                data.getPosts && data.getPosts.map(post => (
                                    <Grid.Column key={post._id} style={{marginBottom :"20px"}}>
                                        <PostCard post={post}/>
                                    </Grid.Column>
                                    
                                ))
                            }
                        </Transition.Group>
                    )
                }
                
            </Grid.Row>
        </Grid>
    )
}




export default Home
