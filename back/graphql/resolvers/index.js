const postsResolvers = require('./post')
const usersResolvers = require('./user')
const commentsResolvers = require('./comment')

module.exports = {
    Post: {
        commentCount: (parent) =>  parent.comments.length,
        likeCount: (parent) => parent.likes.length,
    },
    Query:{
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription
    }
}