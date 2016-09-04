import React from "react"
import grabImage from "../stores/images.js";

export default class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        grabImage(this.props.map, this.props.location.geo.lat, this.props.location.geo.long)
            .then(
                this.updateImageCallback(this.props.location.geo.lat, this.props.location.geo.long)
            );
    }

    componentWillReceiveProps(props) {
        this.setState({image: null})

        grabImage(props.map, props.location.geo.lat, props.location.geo.long)
            .then(
                this.updateImageCallback(props.location.geo.lat, props.location.geo.long)
            );
    }

    updateImageCallback(lat, lng) {
        return ((image) => {
            if (this.props.location.geo.lat == lat && this.props.location.geo.long == lng) {
                this.setState({image})
            }
        }).bind(this);
    }


    render() {
        let now = new Date();
        let day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][now.getDay()];
        let hour = now.getHours() + (now.getMinutes()/60);

        let description = "";
        let remaining = "No deals right now!"
        this.props.location.deals.forEach((deal) => {
            deal.active.forEach((a) => {
                if (a.day == day && a.start < hour && a.end > hour) {
                    description = deal.description;
                    remaining = ((a.end - hour)*60).toFixed(0) + " minutes left";
                } 
            })
        })

        let style = {}
        if (this.state.image) {
            style = {backgroundImage: "url(" + this.state.image + ")"}        
        }
        return (
            <div className="location-info">
                <div className="location-info__back" onClick={this.props.onClose} />
                <div className="location-info__header" style={style}>
                    <div className="location-info__header__title">
                        {this.props.location.name}
                    </div>
                </div>
                <div className="location-info__ttl">
                    <div className="location-info__ttl__title">
                        {description}
                    </div>
                    <div className="location-info__ttl__info">
                        {remaining}
                    </div>
                </div>
            </div>
        );
    }
}