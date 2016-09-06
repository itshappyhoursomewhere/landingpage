
let cache = {};

export default function grabImage(map, lat, long) {
    if (typeof cache[lat + "," + long] !== "undefined") {
        return new Promise((res) => res(cache[lat + "," + long]));
    }

    let get = new Promise((res, rej) => {
        let service = new google.maps.places.PlacesService(map);
        let callback = (result, status) => {
            if(status == google.maps.places.PlacesServiceStatus.OK){
                res(result)
            }else{
                rej(new Error(status))
            }
        }
        service.nearbySearch({location: new google.maps.LatLng(lat, long), radius: 10 }, callback);
    })
    
    return get.then(
        (result) => result.length ? result[0].photos : null
    ).then(
        (result) => result.length ? result[0].getUrl({'maxWidth': 400, 'maxHeight': 400}) : null
    ).then(
        (image) => {
            cache[lat + "," + long] = image;
            return image;
        }
    )
}
