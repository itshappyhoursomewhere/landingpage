import {Post} from "../utils/ajax.js"
import React from "react"

class Locations {
    constructor() {
        this.lat = 0;
        this.lng = 0;
        this.locations = [];
        this.highAccuracyObtained = false;

        this.onUpdateHandlers = [];

        this.getGeneralCurrentPosition()
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
        return this.add(this.lat, this.lng)
    }

    add(lat, lng) {
        return Post("https://tippleldn.tech/data.json", JSON.stringify({lat: lat, long: lng})).then(
            (results) => JSON.parse(results)
        ).then(
            (results) => this.merge(results.locations)
        ).then(
            () => {
                this.onUpdateHandlers.forEach((func) => func());
            }
        );
    }

    merge(results) {
        this.locations.forEach((existing) => {
            let overwrite = false;
            results.forEach((pulled) => {
                if (existing.name == pulled.name) {
                    overwrite = true;
                }
            });

            if (!overwrite) {
                results.push(existing)
            }
        })

        this.locations = results;
    }

    updateLocation(loc) {
        this.lat = loc.coords.latitude
        this.lng = loc.coords.longitude
        this.pull()
    }

    getGeneralCurrentPosition() {
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(
                (loc) => {
                    if (!this.highAccuracyObtained) {
                        this.updateLocation(loc) 
                    }
                    res(loc);
                },
                (err) => {
                    console.error(err)
                    rej(err)
                },
                {maximumAge:60000}
            );
        });
    }

    getCurrentPosition() {
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(
                (loc) => {       
                    this.highAccuracyObtained = true;
                    this.updateLocation(loc) 
                    res(loc);
                },
                (err) => {
                    console.error(err)
                    rej(err)
                },
                {maximumAge:60000, enableHighAccuracy:true}
            );
        });
    }

    watchCurrentPosition() {
        navigator.geolocation.watchPosition(
            this.updateLocation.bind(this), 
            console.error, 
            {maximumAge:60000, enableHighAccuracy:true}
        );
    }
}

const LocationStore = new Locations();

export {LocationStore};
export default LocationStore;

export function ProvideLocations(Elem) {
    return class Provider extends React.Component {

        constructor(props) {
            super(props);
            LocationStore.onUpdate(() => this.forceUpdate());
        }

        render() {
            return <Elem {...this.props} highAccuracyObtained={LocationStore.highAccuracyObtained} locations={LocationStore.locations} lat={LocationStore.lat} lng={LocationStore.lng} />;
        }
    }
}