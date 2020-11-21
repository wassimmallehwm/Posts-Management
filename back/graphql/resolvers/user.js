const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {UserInputError} = require('apollo-server')
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators')

function generateToken(user){
    return token = jwt.sign({
        _id: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET_KEY/*,
    {expiresIn: '1hr'}*/)
}

module.exports = {
    Mutation: {
        async register(_, {
            registerInput: {username, email, password, confirmPassword}
        }){
            //try{
                const {valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
                if(!valid){
                    //console.log("ERRORS", errors)
                    throw new UserInputError('Errors', {errors})
                }
                const user = await User.findOne({username});
                if(user){
                    throw new UserInputError('Username is taken', {
                        errors: {
                            username: 'This username is taken'
                        }
                    })
                }

                password = await bcrypt.hash(password, 12);

                const newUser = new User({
                    email, username, password
                })
                const result = await newUser.save();

                const token = generateToken(result);

                return {
                    ...result._doc,
                    id: result._id,
                    token
                }
            // } catch(error) {
            //     console.log("ERRORS", error)
            //     throw new Error(error)
            // }
        },
        async login(_, {username, password}){
            try{
                const {valid, errors } = validateLoginInput(username, password);
                if(!valid){
                    throw new UserInputError('Errors', {errors})
                }
                const user = await User.findOne({username});
                if(!user){
                    errors.general = 'User not found';
                    throw new UserInputError('User not found', {errors});
                }
                const match = await bcrypt.compare(password, user.password);
                if(!match){
                    errors.general = 'Wrong credentials';
                    throw new UserInputError('Wrong credentials', {errors});
                }
                const token = generateToken(user);
                return {
                    ...user._doc,
                    id: user._id,
                    token
                }
            } catch(error) {
                throw new Error(error)
            }
        }
    }
}