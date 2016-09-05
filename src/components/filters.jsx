import React from "react"
import LocationStore from "../stores/locations.js"

class Filter extends React.Component {
    render() {
        return (
            <div className="filter hr">
                <div className="filter__label">{this.props.label}</div>
                <div className="filter__checkbox">
                    <input type="checkbox" checked={LocationStore.filters[this.props.filter]} onChange={(e) => LocationStore.toggleFilter(this.props.filter, e.target.checked)} />
                </div>
            </div>
        )
    }
}

export default class Filters extends React.Component {
    render() {
        return (
            <div className="filters">
                <div className="filters__header">
                    <div className="filters__header__back" onClick={this.props.onClose} />
                    <div className="filters__header__title">Filter</div>
                </div>
                <div className="filters__type">
                    <div className="filters__type__title">Type</div>
                    <Filter label="Beer" filter="Beer" />        
                    <Filter label="Cocktails" filter="Cocktails" />        
                    <Filter label="Wine" filter="Wine" />        
                </div>
            </div>
        );
    }
}