import React from "react";
import Form from "./Form";
import FormGroup from "./FormGroup";

class Login extends Form {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    callApi = async () => {
        const response = await fetch('/api/login', {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify(this.state),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (response.status !== 200) {
            this.setState({password: ""});
        }
        return await response.json();
    };

    submit = () => {
        this.callApi()
            .then(res => this.props.callback(res))
            .catch(err => console.log(err));
    };

    valid = () => this.state.username.length > 0 && this.state.password.length > 0;

    componentDidMount() {
        this.usernameInput.focus();
    }

    render() {
        return (
            <form className="form" onSubmit={this.handleSubmit}>
                <FormGroup label="Username">
                    <input ref={(input) => this.usernameInput = input} type="text" name="username" autoCapitalize="none" value={this.state.username} onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup label="Password">
                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                </FormGroup>
                <div className="form-actions">
                    <FormGroup>
                        <input type="submit" className="btn btn-primary" value="Log In" disabled={!this.valid()}/>
                    </FormGroup>
                </div>
            </form>
        )
    }

}

export default Login;