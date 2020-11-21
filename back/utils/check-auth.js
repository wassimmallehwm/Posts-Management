const jwt = require('jsonwebtoken')
const {AuthenticationError} = require('apollo-server')

module.exports = (context) => {
    const authHeader = context.req.headers.authorization
    if(authHeader){
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try{
                const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
                return user
            } catch(error){
                throw new AuthenticationError('Not Authorized')
            }
        }
        console.log("Invalid token")
        throw new Error('Not Authorized')
    }
    console.log("Authorization header missing")
    throw new Error('Not Authorized')
}