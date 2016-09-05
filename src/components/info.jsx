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
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let day = days[now.getDay()];
        let tomorrow = now.getDay() == 6 ? "sunday" : days[now.getDay()+1]
        let hour = now.getHours() + (now.getMinutes()/60);

        let offers = []

        let description = "";
        let remaining = "No deals right now!"
        this.props.location.deals.forEach((deal) => {
            deal.active.forEach((a) => {
                if (a.day == day) {
                    if (a.start < hour && a.end > hour) {
                        let remaining = ((a.end - hour)*60).toFixed(0);
                        let suffix = " minutes left" 
                        if (remaining > 60) {
                            remaining = (remaining/60).toFixed(1); 
                            suffix = " hours left"
                        }

                        offers.push({
                            description: deal.description,
                            remaining: remaining + suffix
                        });
                    } else if (a.start > hour) {
                        let remaining = ((a.start - hour)*60).toFixed(0);
                        let suffix = " minutes" 
                        if (remaining > 60) {
                            remaining = (remaining/60).toFixed(1); 
                            suffix = " hours"
                        }

                        offers.push({
                            description: deal.description,
                            remaining: "starts in " + remaining + suffix                                                         
                        })
                    }
                } else if (a.day == tomorrow) {
                    let h = Math.floor(a.start)
                    let m = ((a.start - h) * 60).toFixed()
                    let time = h + ":" + (m < 10 ? "0" + m : m)

                    offers.push({
                        description: deal.description,
                        remaining: "tomorrow at " + time                                                        
                    })
                }
            })
        })

        let style = {}
        if (this.state.image) {
            style = {backgroundImage: "url(" + this.state.image + ")"}        
        }

        let url = this.props.location.website.startsWith("http") ?
            this.props.location.website : "//" + this.props.location.website;


        return (
            <div className="location-info">
                <div className="location-info__back" onClick={this.props.onClose} />
                <div className="location-info__header" style={style}>
                    <div className="location-info__header__title">
                        {this.props.location.name}
                    </div>
                    <div className="location-info__header__tags">
                        {this.props.location.filter.join(", ")}
                    </div>
                </div>

                <div className="location-info__buttons">
                    {this.props.location.phone ? 
                        <a className="location-info__buttons__call" href={"tel:" + this.props.location.phone}>Call</a>
                    :null }
                    {url ? 
                        <a className="location-info__buttons__website" href={url} target="_blank">Website</a>
                    :null }
                </div>
                
                {this.props.location.description ? 
                    <div className="location-info__description hr">
                        <p>{this.props.location.description}</p>
                    </div>
                    : null
                }

                {offers.map((offer, i) => 
                    <div key={"offer_" + i} className="location-info__ttl hr">
                        <div className="location-ingo__ttl__title">
                            Happy hour
                        </div>
                        <div className="location-info__ttl__description">
                            {offer.description}
                        </div>
                        <div className="location-info__ttl__ttl">
                            {offer.remaining}
                        </div>
                    </div>
                )}
                
            </div>
        );
    }
}