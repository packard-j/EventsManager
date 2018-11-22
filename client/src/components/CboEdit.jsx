import React from "react";
import Form from "./Form";
import FormGroup from "./FormGroup"
import EntitySelect from "./EntitySelect";


class CboEdit extends Form {

    constructor(props) {
        super(props);
        this.state = {
            volunteer: null,
            barsOrdered: 1,
            barsReceived: 0,
            moneyReturned: 0,
            notes: ""
        };
        this.vs = React.createRef();
    }

    callEditApi = async () => {
        const response = await fetch('/api/cbo/' + this.props.id + "/edit", {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify(this.state),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        return await response.status;
    };

    submit = () => {
        this.callEditApi()
            .then(res => {
                console.log(res);
                window.location = this.props.prev;
            })
            .catch(err => console.log(err));
    };

    callLoadApi = async () => {
        const response = await fetch('/api/cbo/' + this.props.id, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json"
            }
        });
        return await response.json();
    };

    callDeleteApi = async () => {
        const response = await fetch('/api/cbo/' + this.props.id + '/delete', {
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
            .then(() => window.location = "/orders")
            .catch(err => console.log(err))
    };

    componentDidMount() {
        this.callLoadApi()
            .then(res => {
                const volunteer = res['volunteer'];
                this.vs.current.setQuery(volunteer['firstName'] + " " + volunteer['lastName']);
                this.setState({
                    volunteer: volunteer['id'],
                    barsOrdered: res['barsOrdered'],
                    barsReceived: res['barsReceived'],
                    moneyReturned: res['moneyReturned'],
                    notes: res['notes']
                })
            })
            .catch(err => console.log(err));
    }

    valid = () => this.state.volunteer && this.state.barsOrdered > 0;

    render() {
        return (
            <div className="cbo-edit">
                <form className="form" onSubmit={this.handleSubmit}>
                    <FormGroup label="Volunteer*">
                        <EntitySelect entity="volunteer" ref={this.vs} callback={(id) => this.setState({volunteer: id})}/>
                    </FormGroup>
                    <FormGroup label="Bars Ordered*">
                        <input type="number" name="barsOrdered" value={this.state.barsOrdered} min="1" step="1" onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup label="Bars Received">
                        <input type="number" name="barsReceived" value={this.state.barsReceived} min="0" step="1" onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup label="Money Returned">
                        <input type="number" name="moneyReturned" value={this.state.moneyReturned} min="0" step="0.01" onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup label="Notes">
                        <textarea name="notes" value={this.state.notes} onChange={this.handleChange}/>
                    </FormGroup>
                    <div className="form-actions">
                        <FormGroup>
                            <input type="submit" className="btn btn-primary" value="Submit" disabled={!this.valid()}/>
                        </FormGroup>
                    </div>
                    <input type="button" className="btn btn-danger" value="Delete" onClick={this.onDelete}/>
                </form>
            </div>
        )
    }

}

export default CboEdit;