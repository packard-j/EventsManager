import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";


class Navbar extends Component {

    render() {
        return (
            <div className="navbar">
                <div className="navbar-brand">
                    <Link to="/"><span className="navbar-title">{this.props.title}</span></Link>
                </div>
                <div className="navbar-links">
                    <Link to="/volunteers"><span>Volunteers</span></Link>
                    <Link to="/locations"><span>Locations</span></Link>
                </div>
            </div>
        )
    }

}

export default Navbar;