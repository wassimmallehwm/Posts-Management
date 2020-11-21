import React, { useContext } from 'react'
import { Button, Card, Icon, Image, Label, Popup } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from './MyPopup';

const PostCard = ({post : {
    body,
    createdAt,
    _id,
    username,
    likeCount,
    commentCount,
    likes,
    comments
}}) => {

    const {user} = useContext(AuthContext);

    return (
        <Card fluid>
            <Card.Content>
                <Image
                floated='right'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${_id}`}> {moment(createdAt).fromNow(true)} </Card.Meta>
                <Card.Description>
                {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton post={{_id, likes, likeCount}} user={user}/>
                <MyPopup content="Comment">
                    <Button labelPosition='right' as={Link} to={`/posts/${_id}`}>
                        <Button color='blue' basic>
                            <Icon name='comments' />
                        </Button>
                        <Label basic color='blue' pointing='left'>
                            {commentCount}
                        </Label>
                    </Button>
                </MyPopup>
                {
                    user && user.username === username && 
                    <DeleteButton postId={_id}/>
                }
            </Card.Content>
        </Card>
    )
}

export default PostCard
