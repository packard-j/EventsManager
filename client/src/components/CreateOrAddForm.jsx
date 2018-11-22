import React, {Component} from "react";
import EntityMultiSelect from "./EntityMultiSelect";
import FormGroup from "./FormGroup";
import CreateForm from "./CreateForm";
import urls from "../Urls";
import {capitalize} from "./App";


class CreateOrAddForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entities: [],
            showCreateForm: false
        }
    }

    callApi = async () => {
        const response = await fetch("/api/" + urls[this.props.entity] + "/add-event", {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify({
                event: this.props.event,
                [this.props.entity + "s"]: this.state.entities
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (response.status !== 200) {
            throw new Error("Entities not added.");
        }
    };

    valid = () => this.state.entities.length > 0;

    submit = () => {
        this.callApi()
            .then(this.props.callback)
            .catch(err => console.log(err));
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef = (node) => this.wrapperRef = node;

    handleClickOutside = (event) => {
        if (this.props.show && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.close();
        }
    };

    hideCreateForm = () => this.setState({showCreateForm: false});

    createFormCallback = () => {
        this.loadEntities(this.props.entity);
        this.hideCreateForm();
    };

    render() {
        const classNames = this.props.show ? "popup-form" : "popup-form hidden";
        const entityName = capitalize(this.props.entity);
        return (
            <div className={classNames} ref={this.setWrapperRef}>
                <h3>Select Existing {entityName}</h3>
                <form className="form">
                    <FormGroup>
                        <EntityMultiSelect entity={this.props.entity} callback={(ids) => this.setState({entities: ids})}/>
                    </FormGroup>
                    <div className="form-actions">
                        <FormGroup>
                            <input type="button" className="btn btn-secondary" value="Submit" disabled={!this.valid()} onClick={this.submit}/>
                        </FormGroup>
                    </div>
                </form>
                <h3 className="text-center">OR</h3>
                <FormGroup>
                    <input type="button" className="btn btn-primary" value={"New " + entityName} onClick={() => this.setState({showCreateForm: true})}/>
                </FormGroup>
                <CreateForm entity={this.props.entity} event={this.props.event} show={this.state.showCreateForm}
                            close={this.hideCreateForm} callback={this.createFormCallback}/>
            </div>
        )
    }

}

export default CreateOrAddForm;