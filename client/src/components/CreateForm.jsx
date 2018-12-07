import React, {Component} from "react";
import FormGroup from "./FormGroup";
import TimeInput from "./TimeInput";
import urls from "../Urls";
import {capitalize} from "./App";
import EntityMultiSelect from "./EntityMultiSelect";
import EntitySelect from "./EntitySelect";


const states = {
    volunteer: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        notes: ""
    },
    location: {
        name: ""
    },
    event: {
        name: "",
        date: new Date()
    },
    order: {
        volunteer: null,
        barsOrdered: 1,
        barsReceived: 0,
        moneyReturned: 0,
        notes: ""
    },
    assignment: {
        zone: 1,
        startHour: "",
        startMinute: "",
        endHour: "",
        endMinute: "",
        volunteers: []
    }
};

const fields = {
    volunteer: (form) => <div>
        <FormGroup label="First Name*">
            <input type="text" name="firstName" value={form.state.firstName} autoCapitalize="true" onChange={form.handleChange}/>
        </FormGroup>
        <FormGroup label="Last Name*">
            <input type="text" name="lastName" value={form.state.lastName} autoCapitalize="true" onChange={form.handleChange}/>
        </FormGroup>
        <FormGroup label="Email">
            <input type="email" name="email" value={form.state.email} onChange={form.handleChange}/>
        </FormGroup>
        <FormGroup label="Phone">
            <input type="tel" name="phone" value={form.state.phone} onChange={form.handleChange}/>
        </FormGroup>
        <FormGroup label="Notes">
            <textarea name="notes" value={form.state.notes} onChange={form.handleChange}/>
        </FormGroup>
    </div>,
    location: (form) => <div>
        <FormGroup label="Name*">
            <input type="text" name="name" value={form.state.name} autoCapitalize="true" onChange={form.handleChange}/>
        </FormGroup>
    </div>,
    event: (form) => <div>
        <FormGroup label="Name*">
            <input type="text" name="name" value={form.state.name} autoCapitalize="true" onChange={form.handleChange}/>
        </FormGroup>
    </div>,
    order: (form) => <div>
        <FormGroup label="Volunteer*">
            <EntitySelect entity="volunteer" callback={(id) => form.setState({volunteer: id})}/>
        </FormGroup>
        <FormGroup label="Bars Ordered*">
            <input type="number" name="barsOrdered" value={form.state.barsOrdered} min="1" step="1" onChange={form.handleChange}/>
        </FormGroup>
        <FormGroup label="Bars Received">
            <input type="number" name="barsReceived" value={form.state.barsReceived} min="0" step="1" onChange={form.handleChange}/>
        </FormGroup>
        <FormGroup label="Money Returned">
            <input type="number" name="moneyReturned" value={form.state.moneyReturned} min="0" step="0.01" onChange={form.handleChange}/>
        </FormGroup>
        <FormGroup label="Notes">
            <textarea name="notes" value={form.state.notes} onChange={form.handleChange}/>
        </FormGroup>
    </div>,
    assignment: (form) => {
        const eventSelect = form.props.event ? null :
            <FormGroup label="Event">
            <EntitySelect entity="event" callback={id => form.setState({event: id})}/>
            </FormGroup>;
        const locationSelect = form.props.location ? null :
            <FormGroup label="Location">
            <EntitySelect entity="location" callback={id => form.setState({location: id})}/>
            </FormGroup>;
        const volunteersLabel = form.props.volunteer ? "Other Volunteers" : "Volunteers";
        return (
            <div>
                {eventSelect}
                {locationSelect}
                <FormGroup label="Zone">
                    <input type="number" name="zone" value={form.state.zone} min="1" step="1" onChange={form.handleChange}/>
                </FormGroup>
                <FormGroup label="Start Time">
                    <TimeInput callback={(hour, minute) => form.setState({startHour: hour, startMinute: minute})}/>
                </FormGroup>
                <FormGroup label="End Time">
                    <TimeInput callback={(hour, minute) => form.setState({endHour: hour, endMinute: minute})}/>
                </FormGroup>
                <FormGroup label={volunteersLabel}>
                    <EntityMultiSelect entity="volunteer" callback={(volunteers) => form.setState({volunteers: volunteers})}/>
                </FormGroup>
            </div>
        )
    }
};

const validation = {
    volunteer: form => form.state.firstName.length > 0 && form.state.lastName.length > 0,
    location: form => form.state.name.length > 0,
    event: form => form.state.name.length > 0,
    order: form => form.state.volunteer && form.state.barsOrdered > 0,
    assignment: form => (form.props.event || form.state.event)
        && (form.props.location || form.state.location)
        && form.state.startHour.toString().length > 0 && form.state.startMinute.toString().length > 0
        && form.state.endHour.toString().length > 0 && form.state.endMinute.toString().length > 0
};

class CreateForm extends Component {

    constructor(props) {
        super(props);
        this.state = states[this.props.entity];
        this.fields = () => fields[this.props.entity](this);
        this.valid = () => validation[this.props.entity](this);
    }

    callApi = async () => {
        let s = this.state;
        if (this.props.entity === "assignment") {
            if (this.props.event) {
                s['event'] = this.props.event;
            }
            if (this.props.location) {
                s['location'] = this.props.location;
            }
            if (this.props.volunteer) {
                s['volunteers'].push(this.props.volunteer);
            }
        }
        else if (this.props.event) {
            s['events'] = [this.props.event];
        }
        const response = await fetch('/api/' + urls[this.props.entity] + "/new", {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify(s),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    };

    submit = () => {
        this.callApi()
            .then(res => {
                this.setState(states[this.props.entity]);
                this.props.callback();
            })
            .catch(err => console.log(err));
    };

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.submit();
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(states[nextProps.entity]);
    }

    setWrapperRef = (node) => this.wrapperRef = node;

    handleClickOutside = (event) => {
        if (this.props.show && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.close();
        }
    };

    render() {
        const classNames = this.props.show ? "popup-form" : "popup-form hidden";
        return (
            <div className={classNames} ref={this.setWrapperRef}>
                <h3>New {capitalize(this.props.entity)}</h3>
                <form className="form" onSubmit={this.handleSubmit}>
                    {this.fields()}
                    <div className="form-actions">
                        <FormGroup>
                            <input type="submit" className="btn btn-primary"
                                   value="Submit" disabled={!this.valid()}/>
                        </FormGroup>
                    </div>
                </form>
            </div>
        )
    }

}

export default CreateForm;