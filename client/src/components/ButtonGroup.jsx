import React, {Component} from "react";
import {Link} from "react-router-dom";
import "../css/ButtonGroup.css";


class ButtonGroup extends Component {

    render() {
        const buttons = this.props.buttons.map(b => {
            const name = b['name'];
            const href = b['href'];
            const classNames = this.props.active === name.toLowerCase() ? "btn active" : "btn";
            return <Link key={href} to={href}>
                <input className={classNames} type="button" value={name}/>
            </Link>
        });
        return (
            <div className="button-group">
                {buttons}
            </div>
        )
    }

}

export default ButtonGroup;