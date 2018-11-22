import React from "react";
import EntityList from "./EntityList";
import ButtonGroup from "./ButtonGroup";
import {capitalize} from "./App";
import FormGroup from "./FormGroup";
import Form from "./Form";


const buttons = id => [
    {
        name: "Volunteers",
        href: "/e/" + id + "/volunteers"
    },
    {
        name: "Locations",
        href: "/e/" + id + "/locations"
    },
    {
        name: "Assignments",
        href: "/e/" + id + "/assignments"
    }
];

class Event extends Form {

    constructor(props) {
        super(props);
        this.state = {
            name: "Event",
            date: ""
        };
    }

    submit = () => {
        this.callEditApi()
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    callApi = async () => {
        const response = await fetch("/api/e/" + this.props.id, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json"
            }
        });
        return response.json();
    };

    callEditApi = async () => {
        const response = await fetch('/api/e/' + this.props.id + '/edit', {
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

    componentDidMount() {
        this.callApi()
            .then(res => this.setState(res))
            .catch(err => console.log(err));
    }

    render() {
        let entityList = null;
        switch (this.props.tab) {
            case "volunteers":
                entityList = <EntityList entity="volunteer" event={this.props.id}/>;
                break;
            case "locations":
                entityList = <EntityList entity="location" event={this.props.id}/>;
                break;
            case "assignments":
                entityList = <EntityList entity="assignment" event={this.props.id}/>;
                break;
            default:
                entityList = <EntityList entity="volunteer" event={this.props.id}/>;
        }
        return (
            <div className="event">
                <h1 className="text-center">{this.state.name.length > 0 ? this.state.name : "[Event]"}</h1>
                <form className="form" onSubmit={this.handleSubmit}>
                    <FormGroup label="Name">
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
                    </FormGroup>
                    <div className="form-actions">
                        <FormGroup>
                            <input type="submit" className="btn btn-primary" value="Save Changes"/>
                        </FormGroup>
                    </div>
                </form>
                <ButtonGroup buttons={buttons(this.props.id)} active={this.props.tab || "volunteers"}/>
                <h2>{capitalize(this.props.tab || "Volunteers")}</h2>
                {entityList}
            </div>
        )
    }

}

export default Event;