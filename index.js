var map = L.map('map', {
    zoomControl: false
}).setView([51.49962, -0.1462], 18);

L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(map);

L.interactivePathRuler(map, {
    buttonIconOff: 'fa-ellipsis-h fa-lg',
    buttonIconOn: 'fa-ellipsis-h fa-lg',
    buttonBackgroundColorOn: 'green',
    decimalSeparator: '.',
    unitNameMeter: 'm',
    unitNameKilometer: 'km'
});