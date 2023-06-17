export type MapView = {
    lat: number;
    lng: number;
    zoom: number;
    bearing: number;
    pitch: number;
};

export type GeoBoundsSelectorProps = {
    updateView: (mapview: MapView) => void;
    mapView: MapView;
};
