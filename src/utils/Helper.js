import * as d3 from "d3";    

// helpers class with miscellaneous utility functions
const Helper = function(){

    this.arraysEqual = (arr1, arr2)=>{
        if(arr1.length !== arr2.length){
            return false;
        }
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i]){
                return false;
            }
        }
        return true;
    };

    this.getAgolUrlByItemID = (itemID, isDevExt, isUrlForWebMap)=>{
        const agolBaseUrl = isDevExt ? 'https://devext.arcgis.com/': 'https://www.arcgis.com';
        const agolItemUrl = agolBaseUrl + '/home/item.html?id=' + itemID;
        const agolWebmapUrl = agolBaseUrl + '/home/webmap/viewer.html?webmap=' + itemID;
        return isUrlForWebMap ? agolWebmapUrl : agolItemUrl;
    };

    this.getAgolWebMapUrlByItemID = (customBaseUrl, itemID)=>{
        // const customBaseUrl = app.portalUser ? app.portalUser.portal.customBaseUrl : null;
        // const urlKey = app.portalUser ? app.portalUser.portal.urlKey : null;
        // console.log( app.oauthManager.getCustomBaseURL() );

        // const customBaseUrl = app.oauthManager.getCustomBaseURL();
        const agolBaseUrl = customBaseUrl ? customBaseUrl : 'https://www.arcgis.com';
        // const agolItemUrl = agolBaseUrl + '/home/item.html?id=' + itemID;
        const agolWebmapUrl = agolBaseUrl + '/home/webmap/viewer.html?webmap=' + itemID;
        // return isUrlForWebMap ? agolWebmapUrl : agolItemUrl;
        return agolWebmapUrl;
    };

    this.extractDateFromStr = (inputStr)=>{
        const regexpYYYYMMDD = /\d{4}-\d{2}-\d{2}/g;
        const results = inputStr.match(regexpYYYYMMDD);
        return results.length ? results[0] : inputStr;
    };

    // use margin month to get a date in future/past month, need this to optimize the xScale of bar chart 
    this.convertToDate = (dateInStr, marginMonth=0)=>{
        const dateParts = dateInStr.split('-');
        const year = dateParts[0];
        const mon = marginMonth ? ((dateParts[1] - 1) + marginMonth): dateParts[1] - 1;
        const day = marginMonth ? '1' : dateParts[2];
        return new Date(year, mon, day);
    };

    this.formatDate = (epochDate)=>{
        // const dateFormat = d3.timeFormat("%Y-%m-%d");
        const dateFormat = d3.timeFormat("%b %d, %Y");
        return dateFormat(new Date(epochDate))
    };

    this.getSnippetStr = (items)=>{
        let snippetStr = 'Wayback imagery from ';
        items = items.map(d=>{
            return d.releaseDate;
        });
        snippetStr += items.slice(0, items.length - 1).join(', '); // concat all items but the last one, so we will have "a, b, c"
        snippetStr += ' and ' + items[items.length - 1] // add last one to str with and in front, so we will have "a, b, c and d"
        return snippetStr;
    };

    this.long2tile = (lon, zoom)=>{
        return (Math.floor((lon+180)/360 * Math.pow(2,zoom)));
    };

    this.lat2tile = (lat, zoom)=>{
        return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
    };

    this.tile2Long = (x,z)=>{
        return (x/Math.pow(2,z)*360-180);
    };

    this.tile2lat = (y,z)=>{
        const n=Math.PI-2*Math.PI*y/Math.pow(2,z);
        return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
    };

    this.detectBrowserType = ()=>{
        // // Opera 8.0+
        // const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        
        // // Firefox 1.0+
        // const isFirefox = typeof InstallTrigger !== 'undefined';
        
        // // Safari 3.0+ "[object HTMLElementConstructor]" 
        // const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
        
        // Internet Explorer 6-11
        const isIE = /*@cc_on!@*/false || !!document.documentMode;
        
        // Edge 20+
        const isEdge = !isIE && !!window.StyleMedia;
        
        // // Chrome 1+
        // const isChrome = !!window.chrome && !!window.chrome.webstore;
        
        // // Blink engine detection
        // const isBlink = (isChrome || isOpera) && !!window.CSS;

        return {
            isIE,
            isEdge
        };
    };

};

export default Helper;