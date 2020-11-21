import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Post from './components/pages/Post';
import Register from './components/pages/Register';
import {AuthProvider} from './context/auth'
import AuthRoute from './utils/AuthRoute';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Container>
      <Navbar/>
      <Route exact path="/" component={Home}/>
      <AuthRoute exact path="/register" component={Register}/>
      <AuthRoute exact path="/login" component={Login}/>
      <Route exact path="/posts/:postId" component={Post}/>
      </Container>
    </Router>
    </AuthProvider>
  );
}

export default App;
