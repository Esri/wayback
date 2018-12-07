import $ from 'jquery';

import './style.scss';

const POPUP_WINDOW_WIDTH = 360;

export default class PopupInfoWindow {

    constructor(options={}){
        this.container = null;
        this.addToWebMapBtnOnClick = options.addToWebMapBtnOnClick || null;

        this.render();
        this.initEventHandler();
    }

    initEventHandler(){
        const self = this;

        this.container.on('click', '.js-add-to-webmap', function(){
            const target = $(this);
            const releaseNum = target.attr('data-release-number');
            const isSelected = !target.hasClass('is-selected');
            
            if(self.addToWebMapBtnOnClick){
                self.addToWebMapBtnOnClick({
                    releaseNum,
                    isSelected
                });
            }

        });

        this.container.on('click', '.js-close-popup-window', function(){
            self.hide();
        });
        
    }

    show(options={}){

        // console.log('show popup window', options);

        const screenPoint = options.screenPoint || null;
        const metaData = options.metadata || null;

        this.hide(); // hide popup window first

        if(!screenPoint || !metaData){
            console.error('screen point and metadata is required to open popup window');
            return;
        } 

        const isReticleOnRight = this.shouldPlaceReticleOnRight(screenPoint.x);

        this.setPosition(screenPoint);
        this.setPopupHtml(metaData, isReticleOnRight);

        this.toggleVisibility(true);
    }

    hide(){
        this.toggleVisibility(false);
    }

    setPosition(screenPoint, isUpdatingPosition){
        const x = screenPoint.x || 0;
        const y = screenPoint.y || 0;
        const offset = 22.5;

        const shouldPlaceReticleOnRight = isUpdatingPosition ? $('.reticle-wrap').hasClass('is-right') : this.shouldPlaceReticleOnRight(x);

        const xPos = shouldPlaceReticleOnRight ? ( (x - POPUP_WINDOW_WIDTH) + offset ) : x - offset;
        const yPos = y - offset;

        this.container.css('left', xPos + 'px');
        this.container.css('top', yPos + 'px');
    }

    shouldPlaceReticleOnRight(x){
        const popupRightEndX = x + POPUP_WINDOW_WIDTH ;
        const windowWidth = $( window ).width();
        return popupRightEndX > windowWidth ? true : false;
    }

    setPopupHtml(metaData, isReticleOnRight){
        const popupHtml = this.getPopupHtml(metaData, isReticleOnRight);
        this.container.html(popupHtml);
    }

    toggleVisibility(isVisible){
        this.container.toggleClass('hide', !isVisible);
    }

    toggleAddToWebMapBtnStatus(options={}){
        const isSelected = options.isSelected;
        $('.add-to-webmap-btn').toggleClass('is-selected', isSelected);
    }

    render(){
        const containertHtml = this.getContainerHtml();
        this.container = $(containertHtml);
        $('body').append(this.container);
    }

    getPopupHtml(data, isReticleOnRight){
        const resolution = data.resolution % 1 === 0 ? data.resolution : data.resolution.toFixed(1);
        const accuracy = data.accuracy % 1 === 0 ? data.accuracy : data.accuracy.toFixed(1);
        // const isSelectedClass = data.isSelected ? 'is-selected' : '';
        const isReticleRightClass = isReticleOnRight ? 'is-right' : '';
        const provider = data.provider;
        const source = data.source;

        const reticleHtml = `<div class='reticle-wrap ${isReticleRightClass}'></div>`;

        const contentHtml = `
            <div class='content-wrap text-white'>
                <div class='text-wrap'>
                    <p class='trailer-half'>${provider} (${source}) image captured on <b>${data.dateFormatted}</b> and published in the <b>${data.releaseDate}</b> World Imagery basemap update.</p>
                    <p class='trailer-half'><b>Resolution</b>: Pixels in the source image<br>represent a ground distance of ${resolution} meters</p>
                    <p class='trailer-0'><b>Accuracy</b>: Objects displayed in this image<br>are within ${accuracy} meters of true location</p>
                </div>
                <div class='close-btn js-close-popup-window text-white text-center cursor-pointer ${isReticleRightClass}'>
                    <span class='icon-ui-close'></span>
                </div>
            </div>
        `;

        // const contentHtml = `
        //     <div class='content-wrap flex-container text-white'>
        //         <div class='text-wrap'>
        //             <span class='release-name'>Release ${data.releaseDate}</span><br>
        //             <span>Photo taken on ${data.dateFormatted}</span><br>
        //             <span>${resolution}m resolution | ${accuracy}m accuracy</span>
        //         </div>
        //         <div class='btns-wrap'>
        //             <div class='open-item-btn' title='Learn more about this release'>
        //                 <a class='text-white' href='${data.itemAgolUrl}' target='_blank'><span class='icon-ui-link-external'></span></a>
        //             </div>
        //             <div class='js-add-to-webmap add-to-webmap-btn cursor-pointer ${isSelectedClass}' data-release-number='${data.releaseNum}' title='Add this release to an ArcGIS Online Map'></div>
        //         </div>
        //         <div class='close-btn js-close-popup-window text-center ${isReticleRightClass}'>
        //             <span class='icon-ui-close'></span>
        //         </div>
        //     </div>
        // `;

        return isReticleOnRight ? contentHtml + reticleHtml : reticleHtml + contentHtml;
    }

    getContainerHtml(){
        const containertHtml = `
            <div id='customizedPopupInfoWindow' class='flex-container hide' style='width:${POPUP_WINDOW_WIDTH}px;'></div>
        `;
        return containertHtml;
    }

}