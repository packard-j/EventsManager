import React, {Component} from "react";
import EntitySelect from "./EntitySelect";
import "../css/EntitySelect.css";


class EntityMultiSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entities: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.entity !== nextProps.entity) {
            this.setState({entities: []});
            this.props.callback([]);
        }
    }

    onEntitySelected = (id, name) => {
        if (!id) return;
        const updatedEntities = [...this.state.entities, {id: id, name: name}];
        this.setState({entities: updatedEntities});
        this.props.callback(updatedEntities.map(e => e['id']));
    };

    removeEntity = (id) => {
        let index = -1;
        this.state.entities.forEach((e, i) => {
            if (e['id'] === id) {
                index = i;
            }
        });
        if (index === -1) return;
        const updatedEntities = this.state.entities;
        updatedEntities.splice(index, 1);
        this.setState({entities: updatedEntities});
        this.props.callback(updatedEntities.map(e => e['id']));
    };

    setEntities = (entities) => this.setState({entities: entities});

    render() {
        const entities = this.state.entities.map(e => <li key={e['id']} onClick={() => this.removeEntity(e['id'])}>{e['name']}</li>);
        const classNames = this.state.entities.length > 0 ? "" : "hidden";
        return (
            <div className="multi-select">
                <ul className={classNames}>
                    {entities}
                </ul>
                <EntitySelect entity={this.props.entity} multi={true} callback={this.onEntitySelected}/>
            </div>
        )
    }

}

export default EntityMultiSelect;