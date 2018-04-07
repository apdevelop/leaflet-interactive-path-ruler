(function () {
    'use strict';

    // TODO: check presence of L.EasyButton 

    L.InteractivePathRuler = L.Class.extend({
        _map: null,
        _rulerButton: null,

        _rulerRouteVertices: [],
        _rulerRouteLine: null,

        _dragEndTime: null,

        options: {
            buttonIconOff: '<span>R</span>',
            buttonIconOn: '<span>R</span>',
            buttonTitleOff: 'Turn ruler on',
            buttonTitleOn: 'Turn ruler off',
            buttonBackgroundColorOff: 'white',
            buttonBackgroundColorOn: 'orange',
            markerPopupClassName: '',
            decimalSeparator: '.',
            unitNameMeter: 'm',
            unitNameKilometer: 'km'
        },

        initialize: function (map, options) {
            this._map = map;
            this._dragEndTime = (new Date()).getTime();

            if (options) {
                L.Util.setOptions(this, options);
            }

            var self = this;
            this._rulerButton = L.easyButton({
                states: [{
                    stateName: 'ruler-off',
                    icon: this.options.buttonIconOff,
                    title: this.options.buttonTitleOff,
                    onClick: function (control, map) {
                        self._removeMapObjects();
                        self._map.on('click', self._mapClickHandler, self);
                        control.button.style.backgroundColor = self.options.buttonBackgroundColorOn;
                        control.state('ruler-on');
                    }
                }, {
                    stateName: 'ruler-on',
                    icon: this.options.buttonIconOn,
                    title: this.options.buttonTitleOn,
                    onClick: function (control, map) {
                        self._map.off('click', self._mapClickHandler, self);
                        control.button.style.backgroundColor = self.options.buttonBackgroundColorOff;
                        control.state('ruler-off');
                    }
                }]
            })
                .addTo(this._map);

            return this._rulerButton;
        },

        _mapClickHandler: function (ev) {
            // TODO: There is Chrome issue with unwanted map click event on dragend https://github.com/Leaflet/Leaflet/issues/6112 - not fixed
            // Workaround
            var now = (new Date()).getTime();
            var delta = now - this._dragEndTime;
            if (delta < 50) {
                return;
            }

            var point = ev.latlng;

            var self = this;
            var routeMarker = L.marker(point, {
                icon: L.divIcon({
                    iconSize: [20, 20]
                }),
                opacity: 0.8,
                draggable: true
            })
                .on('drag', function (e) {
                    self._updateDistances();
                    var arr = self._rulerRouteLine.getLatLngs();
                    arr[e.target._vertexIndex] = e.latlng;
                    self._rulerRouteLine.setLatLngs(arr);
                    self._rulerRouteLine.redraw();
                    L.DomEvent.stopPropagation(e);
                })
                .on('dragstart', function (e) {

                })
                .on('dragend', function (e) {
                    if ((e.target._vertexIndex == (self._rulerRouteVertices.length - 1)) || (e.target._wasClicked)) {
                        e.target.openPopup();
                    }

                    self._dragEndTime = (new Date()).getTime();
                })
                .on('click', function (e) {
                    e.target._wasClicked = true;
                    L.DomEvent.stopPropagation(e);
                })
                .on('dblclick', function (e) {
                    if (e.target._vertexIndex == 0) {
                        // Remove entire path when click on first vertex
                        self._removeMapObjects();
                    }
                    else {
                        // Remove only clicked vertex
                        var index = e.target._vertexIndex;
                        self._map.removeLayer(self._rulerRouteVertices[index]);
                        self._rulerRouteVertices.splice(index, 1);

                        var arr = self._rulerRouteLine.getLatLngs();
                        arr.splice(index, 1);
                        self._rulerRouteLine.setLatLngs(arr);
                        self._rulerRouteLine.redraw();

                        for (var i = 0; i < self._rulerRouteVertices.length; i++) {
                            self._rulerRouteVertices[i]._vertexIndex = i;
                        }

                        self._updateDistances();
                    }

                    L.DomEvent.stopPropagation(e);
                });

            this._rulerRouteVertices.push(routeMarker);
            routeMarker._vertexIndex = this._rulerRouteVertices.length - 1;

            if (this._rulerRouteVertices.length > 1) {
                var distance = this._computeDistance(this._rulerRouteVertices.length - 1);

                var routeMarkerPopup = L.popup({
                    autoClose: false,
                    autoPan: false,
                    closeOnClick: false,
                    offset: L.point(0, 0),
                    className: this.options.markerPopupClassName
                })
                    .setContent(this._formatDistance(distance));

                routeMarker.bindPopup(routeMarkerPopup);
            }

            if (this._rulerRouteLine == null) {
                this._rulerRouteLine = L.polyline([point], {
                    color: 'red',
                    weight: 2
                })
                    .on('click', function (e) {
                        // TODO: add vertex
                        L.DomEvent.stopPropagation(e);
                    })
                    .addTo(this._map);
            }
            else {
                this._rulerRouteLine.addLatLng(point);
            }

            routeMarker.addTo(this._map);

            if (this._rulerRouteVertices.length > 1) {
                for (var i = 0; i < this._rulerRouteVertices.length - 1; i++) {
                    if (!this._rulerRouteVertices[i]._wasClicked) {
                        this._rulerRouteVertices[i].closePopup();
                    }
                }

                routeMarker.openPopup();
            }

            L.DomEvent.stopPropagation(ev);
        },

        _removeMapObjects: function () {
            for (var i = 0; i < this._rulerRouteVertices.length; i++) {
                this._map.removeLayer(this._rulerRouteVertices[i]);
            }

            this._rulerRouteVertices = [];

            if (this._rulerRouteLine) {
                this._map.removeLayer(this._rulerRouteLine);
                this._rulerRouteLine = null;
            }
        },

        // TODO: function for full remove of button and tool with map events unsubscribe

        _computeDistance: function (index) {
            var result = 0;
            for (var i = 0; i < index; i++) {
                result += this._map.options.crs.distance(
                    this._rulerRouteVertices[i].getLatLng(),
                    this._rulerRouteVertices[i + 1].getLatLng());
            }

            return result;
        },

        _computeDistances: function (index) {
            var distance = 0;
            var result = [];
            for (var i = 0; i < index; i++) {
                distance += this._map.options.crs.distance(
                    this._rulerRouteVertices[i].getLatLng(),
                    this._rulerRouteVertices[i + 1].getLatLng());
                result.push(distance);
            }

            return result;
        },

        _formatDistance: function (distance) {
            // TODO: ? non-metric units
            if (distance < 100) {
                return distance.toFixed(1).replace('.', this.options.decimalSeparator) + ' ' + this.options.unitNameMeter;
            }
            else if (distance < 1000) {
                return distance.toFixed(0) + ' ' + this.options.unitNameMeter;
            }
            else if (distance < 10000) {
                return (distance / 1000).toFixed(2).replace('.', this.options.decimalSeparator) + ' ' + this.options.unitNameKilometer;
            }
            else {
                return (distance / 1000).toFixed(1).replace('.', this.options.decimalSeparator) + ' ' + this.options.unitNameKilometer;
            }
        },

        _updateDistances: function () {
            if (this._rulerRouteVertices.length > 1) {
                var distances = this._computeDistances(this._rulerRouteVertices.length - 1);
                for (var i = 1; i < this._rulerRouteVertices.length; i++) {
                    this._rulerRouteVertices[i]
                        .getPopup()
                        .setContent(this._formatDistance(distances[i - 1]));
                }
            }
        }
    });

    L.interactivePathRuler = function (map, options) {
        return new L.InteractivePathRuler(map, options);
    }

})();