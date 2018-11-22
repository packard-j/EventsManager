import React, { Component } from 'react';
import {Route, Switch, BrowserRouter as Router} from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./Login";
import Event from "./Event";
import VolunteerEdit from "./VolunteerEdit";
import CboEdit from "./CboEdit";
import LocationEdit from "./LocationEdit";
import AssignmentEdit from "./AssignmentEdit";
import '../css/App.css';
import EntityList from "./EntityList";


const TITLE = "Events Manager";
const event = ({match}) => <Event id={match.params.id}/>;
const volunteer = ({match}) => <VolunteerEdit id={match.params.id}/>;
const cbo = ({match}) => <CboEdit id={match.params.id}/>;
const location = ({match}) => <LocationEdit id={match.params.id}/>;
const assignment = ({match}) => <AssignmentEdit id={match.params.id}/>;
const NoMatch = ({ location }) => <h3>No match for <code>{location.pathname}</code></h3>;


export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
async function isAuthenticated() {
    const response = await fetch("/api/status", {
        method: "GET",
        credentials: "same-origin",
        headers: {
            "Accept": "application/json"
        }
    });
    const json = await response.json();
    return json['authenticated'];
}
*/

class App extends Component {

    render() {
        return (
            <Router>
            <div className="app">
            <Navbar title={TITLE}/>
            <div className="container">
                <Switch>
                    <Route exact path="/login" render={() => (<Login callback={() => window.location="/"}/>)}/>
                    /* Entity Lists */
                    <Route exact path="/" render={() => <EntityList entity="event"/>}/>
                    <Route exact path="/volunteers" render={() => <EntityList entity="volunteer"/>}/>
                    <Route exact path="/orders" render={() => <EntityList entity="order"/>}/>
                    <Route exact path="/locations" render={() => <EntityList entity="location"/>}/>
                    /* Individual Entities */
                    <Route exact path="/e/:id/" component={event}/>
                    <Route path="/e/:id/volunteers" render={({match}) => <Event id={match.params.id} tab="volunteers"/>}/>
                    <Route path="/e/:id/locations" render={({match}) => <Event id={match.params.id} tab="locations"/>}/>
                    <Route path="/e/:id/assignments" render={({match}) => <Event id={match.params.id} tab="assignments"/>}/>
                    <Route path="/v/:id" component={volunteer}/>
                    <Route path="/cbo/:id" component={cbo}/>
                    <Route path="/l/:id" component={location}/>
                    <Route path="/a/:id" component={assignment}/>
                    <Route component={NoMatch}/>
                </Switch>
            </div>
            </div>
            </Router>
        );
    }
}

export default App;
