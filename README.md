# Leaflet Interactive Path Ruler Tool
Ruler measurement tool for [Leaflet](https://github.com/Leaflet/Leaflet) with distance values updating on changing path points.
Requires [Leaflet.EasyButton](https://github.com/CliffCloud/Leaflet.EasyButton) to be installed.

Check the [demo page](https://htmlpreview.github.io/?https://github.com/apdevelop/leaflet-interactive-path-ruler/blob/master/index.html) to see it in action.

### Sample usage

Include script file
```html
<script src="leaflet.interactive-path-ruler.js" type="text/javascript"></script>
```

Assuming that `map` variable is Leaflet map, initialize ruler with optional parameters:
```javascript
L.interactivePathRuler(map, {
    buttonIconOff: 'fa-ellipsis-h fa-lg',   // Button icon in 'off' state
    buttonIconOn: 'fa-ellipsis-h fa-lg',	// Button icon in 'on' state
    buttonTitleOff: 'Turn ruler on',		// Button tooltip text in 'off' state
    buttonTitleOn: 'Turn ruler off',		// Button tooltip text in 'on' state
    buttonBackgroundColorOff: 'white',		// Button background color in 'off' state
    buttonBackgroundColorOn: 'orange',		// Button background color in 'on' state
    markerPopupClassName: '',				// Custom CSS class name for popup [Popup options className](http://leafletjs.com/reference-1.3.0.html#popup-classname)
    decimalSeparator: '.',					// Used to format distance values in popups
    unitNameMeter: 'M',						// Unit name for distance values expressed in meters
    unitNameKilometer: 'KM'					// Used to format distance values expressed in kilometers
});
```
**Note** this example options requires [Font Awesome](https://fontawesome.com/v4.7.0/) installed for button icons.

Now ruler button will be added to other map buttons.

### TODOs
* More customization options
* Add vertex on click on path line