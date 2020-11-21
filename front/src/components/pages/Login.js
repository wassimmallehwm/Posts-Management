import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState, useContext } from 'react'
import { Button, Form } from 'semantic-ui-react';
import { AuthContext } from '../../context/auth';
import {useForm} from '../../utils/hooks';

const Login = ({history}) => {
    const context = useContext(AuthContext)
    const initState = {
        username: '',
        password: ''
    }
    const {onChange, onSubmit, values } = useForm(loginUser, initState)
    const [errors, setErrors] = useState({})

    const [login, {loading}] = useMutation(LOGIN_USER, {
        update(_, {data: {login: userData}}){
            context.login(userData)
            history.push('/')
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    })

    function loginUser(){
        login()
    }
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} className={loading ? "loading" : ''} noValidate>
                <h1>Login</h1>

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
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Login
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

const LOGIN_USER = gql`
    mutation Login(
        $username: String!
        $password: String!
    ) {
        login(username: $username, password: $password){
            _id email username createdAt token
        }
    }
`


export default Login
