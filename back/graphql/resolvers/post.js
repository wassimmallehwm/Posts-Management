const Post = require('../../models/post')
const checkAuth = require('../../utils/check-auth')
const {AuthenticationError, UserInputError} = require('apollo-server')

module.exports = {
    Query: {
        async getPosts(){
            try{
                const posts = await Post.find().sort({createdAt: -1});
                return posts
            } catch(error) {
                throw new Error(error)
            }
        },
        async getPost(_, {postId}){
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post
                } else {
                    throw new Error('Post not found')
                }
            } catch(error) {
                throw new Error(error)
            }
        }
    }, 
    Mutation: {
        async createPost(_, {body}, context){
            //try{
                const user = checkAuth(context);
                if(body === '' || body.trim() === ''){
                    console.log("EMPTYY")
                    throw new Error('Post body must not be empty')
                }
                const newPost = new Post({
                    body,
                    user: user._id,
                    username: user.username
                })
                const post = newPost.save();
                context.pubsub.publish("NEW POST", {
                    newPost: post
                })
                return post
            // } catch(error) {
            //     throw new Error(error)
            // }
        },
        async deletePost(_, {postId}, context){
            try{
                const user = checkAuth(context);
                const post = await Post.findById(postId);
                if(user.username === post.username){
                    await post.deleteOne()
                    return 'Post deleted Successfully'
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch(error) {
                throw new Error(error)
            }
        },
        async likePost(_, {postId}, context){
            try{
                const user = checkAuth(context);
                const post = await Post.findById(postId);
                if(post){
                    if(post.likes.find(like => like.username == user.username)){
                        //post already liked => unlike it
                        post.likes = post.likes.filter(like => like.username != user.username)
                    } else {
                        post.likes.push({
                            username: user.username,
                            createdAt: new Date()
                        })
                        console.log("LIKES : ", post.likes)
                    }
                    await post.save();
                    return post;
                } else {
                    throw new UserInputError('Post not found')
                }
            } catch(error) {
                throw new Error(error)
            }
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, {pubsub}) => pubsub.asyncIterator('NEW POST')
        }
    }
}