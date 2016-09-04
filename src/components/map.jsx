import React from "react"
import Info from "./info.jsx"
import {ProvideLocations} from "../stores/locations.js"

let styles = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]

@ProvideLocations
export default class Map extends React.Component {
    static propTypes = {
        lat: React.PropTypes.number,
        lng: React.PropTypes.number
    }

    static defaultProps = {
        lat: 0,
        lng: 0
    }

    constructor(props){
        super(props)
        this.state = {info: null}
        this.locations = [];
    }

    componentDidMount() {
        this.map = new google.maps.Map(this.container, {
            center: {lat: this.props.lat, lng: this.props.lng},
            zoom: 15,
            zoomControl: false,
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            draggable: false,
            styles: styles
        });

        var image = 'https://tippleldn.tech/public/current_loc.png';
        this.marker = new google.maps.Marker({
            position: {lat: this.props.lat, lng: this.props.lng},
            map: this.map,
            icon: image
        });

        google.maps.event.addListener(this.map, 'google-map-ready', (e) => {
            this.props.locations.forEach((loc) => this.processLocation(loc))
        });
   }

    componentWillReceiveProps(props) {
        let panPoint = new google.maps.LatLng(props.lat, props.lng);
        this.map.panTo(panPoint)
        this.clearLocations()

        this.marker.setPosition({lat: props.lat, lng: props.lng})   
        props.locations.forEach((loc) => this.processLocation(loc))
    }

    clearLocations() {
        this.locations.forEach((marker) => marker.setMap(null));
        this.locations = [];
    }

    clearInfo() {
        this.setState({info: null});
    }

    processLocation(loc) {
        console.log("Adding location", loc)
        var marker = new google.maps.Marker({
          position: {lat: loc.geo.lat, lng: loc.geo.long},
          map: this.map,
          image: loc.icon ? 'https://tippleldn.tech/public/' + loc.icon + '.png' : 'https://tippleldn.tech/public/Multiple.png', 
          zIndex: 100
        });

        marker.addListener('click', () => {
            this.setState({info: <Info map={this.map} location={loc} onClose={this.clearInfo.bind(this)} />})
        });

        this.locations.push(marker)
    }

    render() {
        return (
            <div>
                <div ref={(o) => this.container = o} className="map-container" />
                {this.state.info}
            </div>
        );
    }
}