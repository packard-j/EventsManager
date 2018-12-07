import React, {Component} from "react";
import urls from "../Urls";
import CreateForm from "./CreateForm";
import CreateOrAddForm from "./CreateOrAddForm";
import {capitalize} from "./App";
import FormGroup from "./FormGroup";


function formatTime(hour, minute) {
    return formatDigit(hour) + ":" + formatDigit(minute);
}

function formatDigit(digit) {
    let result = digit.toString();
    if (result.length === 1) {
        result = "0" + result;
    }
    return result;
}

const headings = {
    volunteer: <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
    </tr>,
    location: <tr>
        <th>Name</th>
    </tr>,
    event: <tr>
        <th>Name</th>
        <th>Date</th>
    </tr>,
    order: <tr>
        <th>Volunteer</th>
        <th>Bars Ordered</th>
        <th>Bars Received</th>
        <th>Money Returned</th>
    </tr>,
    assignment: <tr>
        <th>Location</th>
        <th>Zone</th>
        <th>Time</th>
        <th>Volunteers</th>
    </tr>
};

const mapEntities = {
    volunteer: (entities) => entities.map(e => <tr key={e['id']} onClick={() => entityClicked("volunteer", e['id'])}>
        <td>{e['firstName']}</td>
        <td>{e['lastName']}</td>
        <td>{e['email']}</td>
    </tr>),
    location: (entities) => entities.map(e => <tr key={e['id']} onClick={() => entityClicked("location", e['id'])}>
        <td>{e['name']}</td>
    </tr>),
    event: (entities) => entities.map(e => {
        const date = new Date(e['date']);
        const dateString = date.toLocaleDateString('en-IE');
        return (
            <tr key={e['id']} onClick={() => entityClicked("event", e['id'])}>
                <td>{e['name']}</td>
                <td>{dateString}</td>
            </tr>
        )}),
    order: (entities) => entities.map(e => <tr key={e['id']} onClick={() => entityClicked("order", e['id'])}>
        <td>{e['volunteer']['firstName'] + " " + e['volunteer']['lastName']}</td>
        <td>{e['barsOrdered']}</td>
        <td>{e['barsReceived']}</td>
        <td>{e['moneyReturned']}</td>
    </tr>),
    assignment: (entities) => entities.map(e => <tr key={e['id']} onClick={() => entityClicked("assignment", e['id'])}>
        <td>{e['location']['name']}</td>
        <td>{e['zone']}</td>
        <td>{formatTime(e['startHour'], e['startMinute']) + " - " + formatTime(e['endHour'], e['endMinute'])}</td>
        <td>{e['volunteers'].map(v => <p>{v['firstName'] + " " + v['lastName']}</p>)}</td>
    </tr>)
};

const entityClicked = (entity, id) => {
    window.location = "/" + urls[entity] + "/" + id;
};


class EntityList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: "",
            entities: [],
            page: 0,
            loading: true,
            showCreateForm: false
        };
        this.mapEntities = () => mapEntities[this.props.entity](this.state.entities);
    }

    callApi = async (url) => {
        const response = await fetch("/api/" + url, {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify({
                search: this.state.search,
                page: this.state.page,
                event: this.props.event,
                location: this.props.location,
                volunteer: this.props.volunteer
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (response.status === 401) {
            window.location = "/login";
        }
        return await response.json();
    };

    loadEntities = (entity) => {
        this.setState({loading: true});
        this.callApi(urls[entity])
            .then(res => {
                if (this.state.page !== 0 && res.length === 0) {
                    this.setState({page: this.state.page - 1}, () => this.loadEntities(entity));
                    return;
                }
                this.setState({entities: res, loading: false});
            })
            .catch(err => console.log(err));
    };

    prevPage = () => {
        this.setState({page: Math.max(0, this.state.page - 1)}, () => this.loadEntities(this.props.entity));
    };

    nextPage = () => {
        this.setState({page: this.state.page + 1}, () => this.loadEntities(this.props.entity));
    };

    componentDidMount() {
        this.loadEntities(this.props.entity);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.entity === nextProps.entity) {
            return;
        }
        this.mapEntities = () => mapEntities[nextProps.entity](this.state.entities);
        this.setState({entities: [], search: ""}, () => this.loadEntities(nextProps.entity));
    }

    hideCreateForm = () => this.setState({showCreateForm: false});

    createFormCallback = () => {
        this.loadEntities(this.props.entity);
        this.hideCreateForm();
    };

    render() {
        const create = this.props.event && this.props.entity !== "assignment" ?
            <CreateOrAddForm event={this.props.event} entity={this.props.entity} show={this.state.showCreateForm}
                             close={this.hideCreateForm} callback={this.createFormCallback}/> :
            <CreateForm entity={this.props.entity} show={this.state.showCreateForm}
                        close={this.hideCreateForm} callback={this.createFormCallback}
                        event={this.props.event} location={this.props.location} volunteer={this.props.volunteer}/>;
        const body = this.mapEntities();
        const bodyClass = this.state.loading ? "loading" : "";
        return (
            <div className="entity-list">
                <input type="button" className="btn btn-primary" value={"Add " + capitalize(this.props.entity)}
                       onClick={() => this.setState({showCreateForm: true})}/>
                <form className="form">
                    <FormGroup label="Search">
                        <input type="text" value={this.state.search} onChange={(event) => this.setState({search: event.target.value},
                            () => this.loadEntities(this.props.entity))}/>
                    </FormGroup>
                </form>
                {create}
                <table>
                    <thead>
                    {headings[this.props.entity]}
                    </thead>
                    <tbody className={bodyClass}>
                    {body}
                    </tbody>
                </table>
                <div>
                    <input type="button" className="btn btn-small btn-danger" disabled={this.state.page===0} value="Prev" onClick={this.prevPage}/>
                    <input type="button" className="btn btn-small btn-secondary float-right" value="Next" onClick={this.nextPage}/>
                </div>
            </div>
        )
    }

}

export default EntityList;