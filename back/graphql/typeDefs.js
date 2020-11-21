const gql = require('graphql-tag');

module.exports = gql`
    type Post{
        _id: ID!
        body: String!
        username: String!
        createdAt: String!
        comments: [Comment]!
        likes: [Like]!
        commentCount: Int!
        likeCount: Int!
    }
    type User{
        _id: ID!
        username: String!
        email: String!
        token: String!
        createdAt: String!
    }
    type Comment{
        _id: ID!
        body: String!
        username: String!
        createdAt: String!
    }
    type Like{
        _id: ID!
        username: String!
        createdAt: String!
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query{
        getPosts: [Post]
        getPost(postId: ID!): Post
    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String): Post!
        deletePost(postId: ID!): String!
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }
    type Subscription{
        newPost: Post!
    }
`