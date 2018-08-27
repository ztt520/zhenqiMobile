import Vue from 'vue'

export function getMapJson() {
    return [{
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#fcf9f2ff"
            }
        },
        {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "color": "#f1bd93ff",
                "weight": "0.1",
                "lightness": 55
            }
        },
        {
            "featureType": "green",
            "elementType": "all",
            "stylers": {
                "color": "#c8e49dff"
            }
        },
        {
            "featureType": "poilabel",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "geometry",
            "stylers": {
                "color": "#f1bd93ff",
                "weight": "0.1",
                "lightness": 38
            }
        },
        {
            "featureType": "highway",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }
    ]

}