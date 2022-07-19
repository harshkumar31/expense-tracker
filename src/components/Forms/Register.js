import React, { Component } from "react";
import {auth , createUserWithEmailAndPassword , updateProfile} from '../../config/Fire';
import './Login.css';

class Register extends Component {
    state = {
        email: '',
        password: '',
        displayName: '',
        fireErrors: ''
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    register = e => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth,this.state.email,this.state.password).then((user) => 
        {
            var currentUser = auth.currentUser;
            updateProfile(currentUser, {
                displayName: this.state.displayName
            })
        }).catch((error) => {
            this.setState({fireErrors: error.message})
        });
    }

    render () {
        let errorNotification = this.state.fireErrors ?
        (<div className="Error">{this.state.fireErrors}</div>) : null;
        return (
            <>
            {errorNotification}
                <form>
                    <input type="text"
                        className="regField"
                        placeholder="Your Name"
                        onChange={this.handleChange}
                        value={this.state.displayName}
                        name="displayName" />
                    
                    <input type="text"
                        className="regField"
                        placeholder="Email"
                        onChange={this.handleChange}
                        value={this.state.email}
                        name="email" />

                    <input type="password"
                        className="regField"
                        placeholder="Password"
                        onChange={this.handleChange}
                        value={this.state.password}
                        name="password" />

                    <input type="submit" onClick={this.register} className="submitBtn" value="REGISTER" />
                </form>
            
            </>
        )
    }
}
export default Register;