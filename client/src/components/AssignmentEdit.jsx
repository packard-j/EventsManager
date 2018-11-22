import React from "react";
import Form from "./Form";
import FormGroup from "./FormGroup";
import TimeInput from "./TimeInput";
import EntitySelect from "./EntitySelect";
import EntityMultiSelect from "./EntityMultiSelect";


class AssignmentEdit extends Form {

    constructor(props) {
        super(props);
        this.state = {
            location: null,
            zone: 1,
            startHour: "",
            startMinute: "",
            endHour: "",
            endMinute: "",
            volunteers: []
        };
        this.vs = React.createRef();
        this.startTime = React.createRef();
        this.endTime = React.createRef();
        this.location = React.createRef();
        this.event = React.createRef();
    }

    callApi = async () => {
        const response = await fetch('/api/a/' + this.props.id + '/edit', {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify(this.state),
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
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    valid = () => true;

    callLoadApi = async () => {
        console.log("Loading assignment...");
        console.log(this.props.id);
        const response = await fetch("/api/a/" + this.props.id, {
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
                console.log(res);
                const volunteers = res['volunteers'];
                this.vs.current.setEntities(volunteers.map(v => ({
                    id: v['id'],
                    name: v['firstName'] + ' ' + v['lastName']})
                ));
                this.startTime.current.setTime(res['startHour'], res['startMinute']);
                this.endTime.current.setTime(res['endHour'], res['endMinute']);
                this.location.current.setQuery(res['location']['name']);
                this.event.current.setQuery(res['event']['name']);
                this.setState({
                    location: res['location']['id'],
                    zone: res['zone'],
                    startHour: res['startHour'],
                    startMinute: res['startMinute'],
                    endHour: res['endHour'],
                    endMinute: res['endMinute'],
                    volunteers: volunteers.map(v => v['id'])
                });
            })
            .catch(err => console.log(err));
    }

    callDeleteApi = async () => {
        const response = await fetch('/api/a/' + this.props.id + '/delete', {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json"
            }
        });
        return await response;
    };

    onDelete = () => {
        this.callDeleteApi()
            .then(() => window.location = "/locations")
            .catch(err => console.log(err))
    };

    onVolunteersUpdated = (updatedVolunteers) => {
        this.setState({volunteers: updatedVolunteers});
    };

    handleSTChange = (hour, minute) => {
        this.setState({
            startHour: hour,
            startMinute: minute
        });
    };

    handleETChange = (hour, minute) => {
        this.setState({
            endHour: hour,
            endMinute: minute
        });
    };

    render() {
        return (
            <div className="assignment-edit">
                <form className="form" onSubmit={this.handleSubmit}>
                    <h2>Edit Assignment</h2>
                    <FormGroup label="Event">
                        <EntitySelect entity="event" ref={this.event} callback={(id) => this.setState({event: id})}/>
                    </FormGroup>
                    <FormGroup label="Location">
                        <EntitySelect entity="location" ref={this.location} callback={(id) => this.setState({location: id})}/>
                    </FormGroup>
                    <FormGroup label="Zone">
                        <input type="number" name="zone" value={this.state.zone} min="1" step="1" onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup label="Start Time">
                        <TimeInput ref={this.startTime} callback={this.handleSTChange}/>
                    </FormGroup>
                    <FormGroup label="End Time">
                        <TimeInput ref={this.endTime} callback={this.handleETChange}/>
                    </FormGroup>
                    <FormGroup label="Volunteers">
                        <EntityMultiSelect entity="volunteer" ref={this.vs} callback={this.onVolunteersUpdated}/>
                    </FormGroup>
                    <div className="form-actions">
                        <FormGroup>
                            <input type="submit" className="btn btn-primary" value="Save Changes" disabled={!this.valid()}/>
                        </FormGroup>
                    </div>
                    <input type="button" className="btn btn-danger" value="Delete" onClick={this.onDelete}/>
                </form>
            </div>
        )
    }

}

export default AssignmentEdit;