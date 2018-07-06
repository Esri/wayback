# wayback
This app provides a dynamic browsing experience where previous World Imagery versions are presented within the map, along a timeline, and as a list. Versions that resulted in local changes are dynamically presented to the user based on location and scale. Preview changes by hovering and/or selecting individual layers. When ready, one or more Wayback layers can be added to an export queue and pushed to a new ArcGIS Online web map.

[View it live](https://livingatlas.arcgis.com/wayback/)

![App](screenshot.png)

## Installing 
To begin, clone this repository to your computer:

```sh
https://github.com/vannizhang/wayback.git
```

From the project's root directory, install the required packages (dependencies):

```sh
npm install
```

## Running the app 
Now you can start the webpack dev server to test the app on your local machine:

```sh
# it will start a server instance and begin listening for connections from localhost on port 8080
npm run server
```

## Deployment
To build/deploye the app, you can simply run:

```sh
# it will place all files needed for deployment into the /build directory 
npm run build
```

## External Libraries:
- [ArcGIS API for JavaScript (4.7)](https://developers.arcgis.com/javascript/index.html)
- [D3.js v4](https://d3js.org/)

## Resources
- [Wayback - 81 Flavors of World Imagery](https://www.esri.com/arcgis-blog/products/arcgis-living-atlas/imagery/wayback-81-flavors-of-world-imagery/)
- [Wayback Imagery group](http://esri.maps.arcgis.com/home/group.html?id=0f3189e1d1414edfad860b697b7d8311&start=1&view=list#content)
- [ArcGIS Living Atlas of the World](https://livingatlas.arcgis.com/en/browse/#d=2&categories=Imagery:1111)
- [Esri](https://www.esri.com/en-us/home)
