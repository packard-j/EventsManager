import { Component } from "react";
import "../css/Form.css";

class Form extends Component {

    constructor(props) {
        super(props);
    }

    submit = () => console.log("Please implement a submit method.");

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.submit();
    };

}

export default Form;