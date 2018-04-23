# Leaflet Interactive Path Ruler Tool
Ruler measurement tool for [Leaflet](https://github.com/Leaflet/Leaflet) with distance values updating on changing location of path points.
Requires [Leaflet.EasyButton](https://github.com/CliffCloud/Leaflet.EasyButton) to be installed.

### How it looks in action
Check the [demo page](https://htmlpreview.github.io/?https://github.com/apdevelop/leaflet-interactive-path-ruler/blob/master/index.html) to see it in action.

![Ruler in action](https://github.com/apdevelop/leaflet-interactive-path-ruler/blob/master/Docs/ruler-in-action.gif)

### Sample usage

Include script file
```html
<script src="leaflet.interactive-path-ruler.js" type="text/javascript"></script>
```

Assuming that `map` variable is Leaflet map, initialize ruler with optional parameters:
```javascript
L.interactivePathRuler(map, {
    buttonIconOff: 'fa-ellipsis-h fa-lg',	// Button icon in 'off' state
    buttonIconOn: 'fa-ellipsis-h fa-lg',	// Button icon in 'on' state
    buttonTitleOff: 'Turn ruler on',		// Button tooltip text in 'off' state
    buttonTitleOn: 'Turn ruler off',		// Button tooltip text in 'on' state
    buttonBackgroundColorOff: 'white',		// Button background color in 'off' state
    buttonBackgroundColorOn: 'orange',		// Button background color in 'on' state
	rulerLineColor: 'red',			// Line stroke color
    rulerLineWeight: 3,				// Line stroke width in pixels
    markerPopupClassName: '',			// Custom CSS class name for popup
    decimalSeparator: '.',			// Used to format distance values in popups
    unitNameMeter: 'M',				// Unit name for distance values expressed in meters
    unitNameKilometer: 'KM'			// Used to format distance values expressed in kilometers
});
```
> **Note:** this example options requires [Font Awesome](https://fontawesome.com/v4.7.0/) installed for button icons.

Now ruler button will be added to other map buttons.

### TODOs
* More customization options for line/markers/popups
* Easy adding vertex on path line (with click tolerance distance)
* More measurement units