import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useContext, useState } from 'react'
import { Button, Form } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth';
import {useForm} from '../../utils/hooks';

const Register = ({history}) => {
    const context = useContext(AuthContext)
    const initState = {
        username: '',
        password: '',
        email: '',
        confirmPassword: ''
    }
    const {onChange, onSubmit, values } = useForm(registerUser, initState)
    const [errors, setErrors] = useState({})

    const [addUser, {loading}] = useMutation(REGISTER_USER, {
        update(_, {data: {login: userData}}){
            context.login(userData)
            history.push('/')
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    })

    function registerUser(){
        addUser()
    }
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} className={loading ? "loading" : ''} noValidate>
                <h1>Register</h1>

                <Form.Input
                    label="Username"
                    placeholder="Username"
                    name="username"
                    type="text"
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                />

                <Form.Input
                    label="Email"
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    error={errors.email ? true : false}
                    onChange={onChange}
                />

                <Form.Input
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />

                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    error={errors.confirmPassword ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Register
                </Button>
            </Form>
            {
                Object.keys(errors).length > 0 &&
                (
                    <div className="ui error message">
                        <ul className="list">
                            {
                                Object.values(errors).map(value => (
                                    <li key={value}>{value}</li>
                                ))
                            }
                        </ul>
                    </div>
                )
            }
        </div>
    )
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ){
            _id email username createdAt token
        }
    }
`


export default Register
