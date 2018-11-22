import React, {Component} from "react";
import "../css/EntitySelect.css";
import urls from "../Urls";


const mapEntities = {
    volunteer: (entities, select) => entities.map(e => {
        const name = e['firstName'] + " " + e['lastName'];
        return <li key={e['id']} onClick={() => select(e['id'], name)}>{name}</li>;
    }),
    location: (entities, select) => entities.map(e => {
        return <li key={e['id']} onClick={() => select(e['id'], e['name'])}>{e['name']}</li>;
    }),
    event: (entities, select) => entities.map(e => {
        return <li key={e['id']} onClick={() => select(e['id'], e['name'])}>{e['name']}</li>;
    })
};

class EntitySelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: "",
            entities: [],
            show: false,
            selected: false
        };
        this.mapEntities = mapEntities[this.props.entity];
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.entity !== nextProps.entity) {
            this.setState({query: "", entities: []});
            this.mapEntities = mapEntities[nextProps.entity];
        }
    }

    setQuery = (query) => {
        this.setState({query: query});
    };

    callApi = async () => {
        const response = await fetch("/api/" + urls[this.props.entity], {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify({
                search: this.state.query,
                page: 0
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    };

    handleChange = (event) => {
        this.props.callback(null);
        this.setState({[event.target.name]: event.target.value,
            selected: false}, () => {
            if (this.state.query.length === 0) {
                this.setState({show: false});
                return;
            }
            this.callApi()
                .then(res => {
                    if (res.length === 0) {
                        this.setState({show: false});
                    }
                    else {
                        this.setState({show: true});
                    }
                    this.setState({entities: res});
                })
                .catch(err => console.log(err));
        });
    };

    handleSelect = (id, name) => {
        if (!this.props.multi) {
            this.setState({selected: true, query: name});
        }
        else {
            this.setState({selected: false, query: ""});
        }
        this.props.callback(id, name);
    };

    render() {
        const entities = this.mapEntities(this.state.entities, this.handleSelect);
        const ulClass = this.state.show ? "" : "hidden";
        const inputClass = this.state.selected ? "selected" : "";
        return (
            <div className="entity-select">
                <input className={inputClass} type="text" name="query" value={this.state.query} onChange={this.handleChange} autoComplete="off"
                       onFocus={() => this.state.query.length > 0 ? this.setState({show: true}) : this.setState({show: false})}
                       onBlur={() => setTimeout(() => this.setState({show: false}), 200)}/>
                <ul className={ulClass}>
                    {entities}
                </ul>
            </div>
        )
    }

}

export default EntitySelect;