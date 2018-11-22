import React from "react";
import Form from "./Form";
import FormGroup from "./FormGroup"
import EntitySelect from "./EntitySelect";
import EntityMultiSelect from "./EntityMultiSelect";
import EntityList from "./EntityList";


class VolunteerEdit extends Form {

    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            notes: "",
            events: [],
            selectedEvent: null
        };
        this.es = React.createRef();
        this.assignmentList = React.createRef();
    }

    callEditApi = async () => {
        const response = await fetch('/api/v/' + this.props.id + "/edit", {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                phone: this.state.phone,
                notes: this.state.notes,
                events: this.state.events
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    };

    submit = () => {
        this.callEditApi()
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    onDelete = () => {
        this.callDeleteApi()
            .then(() => window.location = "/volunteers")
            .catch(err => console.log(err))
    };

    callDeleteApi = async () => {
        const response = await fetch('/api/v/' + this.props.id + '/delete', {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json"
            }
        });
        return await response;
    };

    callLoadApi = async () => {
        const response = await fetch('/api/v/' + this.props.id, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json"
            }
        });
        return await response.json();
    };

    componentDidMount() {
        this.callLoadApi()
            .then(res => {
                console.log("Volunteer:");
                console.log(res);
                const events = res['events'];
                console.log(events);
                this.es.current.setEntities(events);
                this.setState({
                    firstName: res['firstName'],
                    lastName: res['lastName'],
                    email: res['email'],
                    phone: res['phone'],
                    notes: res['notes'],
                    events: events.map(e => e['id'])
                })
            })
            .catch(err => console.log(err));
    }

    valid = () => this.state.firstName.length > 0 && this.state.lastName.length > 0;

    render() {
        const assignmentListSection = this.props.event ?
            <EntityList entity="assignment" event={this.props.event} volunteer={this.props.id}/> :
            <div>
                <form className="form">
                    <FormGroup>
                        <h2>Assignments</h2>
                    </FormGroup>
                    <FormGroup>
                        <p>Select an event to view assignments.</p>
                    </FormGroup>
                    <FormGroup label="Event">
                        <EntitySelect entity="event" callback={(id) => this.setState({selectedEvent: id}, () => this.assignmentList.current.loadEntities("assignment"))}/>
                    </FormGroup>
                </form>
                <EntityList entity="assignment" ref={this.assignmentList} event={this.state.selectedEvent} volunteer={this.props.id}/>
            </div>;
        return (
            <div className="volunteer-edit">
                <form className="form" onSubmit={this.handleSubmit}>
                    <h2>Edit Volunteer</h2>
                    <FormGroup label="First Name*">
                        <input type="text" name="firstName" value={this.state.firstName} autoCapitalize="true" onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup label="Last Name*">
                        <input type="text" name="lastName" value={this.state.lastName} autoCapitalize="true" onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup label="Email">
                        <input type="email" name="email" value={this.state.email} onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup label="Phone">
                        <input type="tel" name="phone" value={this.state.phone} onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup label="Notes">
                        <textarea name="notes" value={this.state.notes} onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup label="Events">
                        <EntityMultiSelect entity="event" ref={this.es} callback={(ids) => this.setState({events: ids})}/>
                    </FormGroup>
                    <div className="form-actions">
                        <FormGroup>
                            <input type="submit" className="btn btn-primary" value="Save Changes" disabled={!this.valid()}/>
                        </FormGroup>
                    </div>
                    <input type="button" className="btn btn-danger" value="Delete" onClick={this.onDelete}/>
                </form>
                {assignmentListSection}
            </div>
        )
    }

}

export default VolunteerEdit;