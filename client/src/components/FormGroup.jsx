import React, { Component } from "react";
import "../css/FormGroup.css";


class FormGroup extends Component {

    render() {

        const label = this.props.label ? <span className="form-label">{this.props.label}</span> : false;

        return (
            <div className="form-group">
                { label }
                { this.props.children }
            </div>
        )
    }

}

export default FormGroup;