const Post = require('../../models/post')
const checkAuth = require('../../utils/check-auth')
const {AuthenticationError, UserInputError} = require('apollo-server')

module.exports = {
    Query: {
        
    }, 
    Mutation: {
        async createComment(_, {postId, body}, context){
                const user = checkAuth(context);
                if(body.trim() === ''){
                    throw new UserInputError('Empty comment', {
                        errors: {
                            body: 'Comment must not be empty'
                        }
                    })
                }
                const post = await Post.findById(postId);
                if(post){
                    post.comments .unshift({
                        body,
                        username: user.username,
                        createdAt: new Date()
                    })
                    await post.save();
                    return post
                } else {
                    throw new UserInputError('Post not found')
                }
        },
        async deleteComment(_, {postId, commentId}, context){
            try{
                const user = checkAuth(context);
                const post = await Post.findById(postId);
                if(post){
                    const commentIndex = post.comments.findIndex(c => c._id == commentId)
                    if(post.comments[commentIndex].username === user.username){
                        post.comments.splice(commentIndex, 1)
                    }else {
                        throw new AuthenticationError('Action not allowed');
                    }
                    await post.save();
                    return post
                } else {
                    throw new UserInputError('Post not found')
                }
            } catch(error) {
                throw new Error(error)
            }
        }
    }
}