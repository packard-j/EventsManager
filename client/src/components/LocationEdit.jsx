import React from "react";
import Form from "./Form";
import FormGroup from "./FormGroup";
import EntityMultiSelect from "./EntityMultiSelect";
import EntitySelect from "./EntitySelect";
import EntityList from "./EntityList";

class LocationEdit extends Form {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            events: [],
            selectedEvent: null
        };
        this.es = React.createRef();
        this.assignmentList = React.createRef();
    }

    callEditApi = async () => {
        const response = await fetch('/api/l/' + this.props.id + "/edit", {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify({
                name: this.state.name,
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
            .then(() => window.location = "/locations")
            .catch(err => console.log(err))
    };

    callDeleteApi = async () => {
        const response = await fetch('/api/l/' + this.props.id + '/delete', {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json"
            }
        });
        return await response;
    };

    callLoadApi = async () => {
        const response = await fetch('/api/l/' + this.props.id, {
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
                const events = res['events'];
                this.es.current.setEntities(events);
                this.setState({
                    name: res['name'],
                    events: events.map(e => e['id'])
                });
            })
            .catch(err => console.log(err));
    }

    valid = () => this.state.name.length > 0;

    render() {
        const assignmentListSection = this.props.event ?
            <EntityList entity="assignment" event={this.props.event} location={this.props.id}/> :
            <div>
                <form className="form">
                    <FormGroup>
                        <h3>Assignments</h3>
                    </FormGroup>
                    <FormGroup>
                        <p>Select an event to view assignments.</p>
                    </FormGroup>
                    <FormGroup label="Event">
                        <EntitySelect entity="event" callback={(id) => this.setState({selectedEvent: id}, () => this.assignmentList.current.loadEntities("assignment"))}/>
                    </FormGroup>
                </form>
                <EntityList entity="assignment" ref={this.assignmentList} event={this.state.selectedEvent} location={this.props.id}/>
            </div>;
        return (
            <div className="location-edit">
                <form className="form" onSubmit={this.handleSubmit}>
                    <h2>Edit Location</h2>
                    <FormGroup label="Name*">
                        <input type="text" name="name" value={this.state.name} autoCapitalize="true" onChange={this.handleChange}/>
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

export default LocationEdit;