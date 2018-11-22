import React, {Component} from "react";
import "../css/TimeInput.css";


class TimeInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hour: "",
            minute: ""
        }
    }

    handleChange = (event) => {
        const name = event.target.name;
        let value = event.target.value;
        if (name === "hour") {
            value = Math.min(Math.max(0, value), 23);
        }
        else if (name === "minute") {
            value = Math.min(Math.max(0, value), 59);
        }
        this.setState({[event.target.name]: value},
            () => this.props.callback(this.state.hour, this.state.minute));
    };

    setTime = (hour, minute) => {
        this.setState({hour: hour, minute: minute});
    };

    render() {
        return (
            <div className="time-input">
                <input type="number" autoComplete="false" name="hour" min="0" max="23" step="1" placeholder="11" value={this.state.hour} onChange={this.handleChange}/>
                <span>:</span>
                <input type="number" autoComplete="false" name="minute" min="0" max="59" step="1" placeholder="30" value={this.state.minute} onChange={this.handleChange}/>
            </div>
        )
    }

}

export default TimeInput;