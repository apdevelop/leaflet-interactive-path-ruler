var map = L.map('map', {}).setView([51.497, -0.144], 17);

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