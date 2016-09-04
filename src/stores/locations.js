import {Post} from "../utils/ajax.js"
import React from "react"

class Locations {
    constructor() {
        this.lat = 0;
        this.lng = 0;
        this.locations = [];

        this.onUpdateHandlers = [];

        this.getCurrentPosition().then(
            () => {
                this.watchCurrentPosition()
            }
        )
    }

    onUpdate(func) {
        this.onUpdateHandlers.push(func)
    }

    pull() {
        return Post("https://tippleldn.tech/data.json", JSON.stringify({lat: this.lat, long: this.lng})).then(
            (results) => JSON.parse(results)
        ).then(
            (results) => {this.locations = results.locations} 
        )
    }

    updateLocation(loc) {
        this.lat = loc.coords.latitude
        this.lng = loc.coords.longitude
        this.pull().then(
            () => {
                this.onUpdateHandlers.forEach((func) => func());
            }
        );
    }

    getCurrentPosition() {
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(
                (loc) => {       
                    this.updateLocation(loc) 
                    res(loc);
                },
                (err) => {
                    console.error(err)
                    rej(err)
                },
                {maximumAge:60000, timeout:5000, enableHighAccuracy:true}
            );
        });
    }

    watchCurrentPosition() {
        navigator.geolocation.watchPosition(
            this.updateLocation.bind(this), 
            console.error, 
            {maximumAge:60000, timeout:5000, enableHighAccuracy:true}
        );
    }
}

const LocationStore = new Locations();

export default LocationStore

export function ProvideLocations(Elem) {
    return class Provider extends React.Component {

        constructor(props) {
            super(props);
            LocationStore.onUpdate(() => this.forceUpdate());
        }

        render() {
            return <Elem {...this.props} locations={LocationStore.locations} lat={LocationStore.lat} lng={LocationStore.lng} />;
        }
    }
}