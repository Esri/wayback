import $ from 'jquery';

import './style.scss';

const POPUP_WINDOW_WIDTH = 310;

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

    setPosition(screenPoint){
        // const containerWidth = this.container.width();
        const x = screenPoint.x || 0;
        const y = screenPoint.y || 0;
        const isReticleOnRight = this.shouldPlaceReticleOnRight(x);
        const offset = 22.5;

        const xPos = isReticleOnRight ? ( (x - POPUP_WINDOW_WIDTH) + offset ) : x - offset;
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
        const resolution = data.resolution >= 1 ? data.resolution : data.resolution.toFixed(1);
        const isSelectedClass = data.isSelected ? 'is-selected' : '';
        const isReticleRightClass = isReticleOnRight ? 'is-right' : '';

        const reticleHtml = `<div class='reticle-wrap ${isReticleRightClass}'></div>`;
        const contentHtml = `
            <div class='content-wrap flex-container text-white'>
                <div class='text-wrap'>
                    <span class='release-name'>${data.releaseDate} Release</span><br>
                    <span>Taken on ${data.dateFormatted} | ${resolution}m res</span>
                </div>
                <div class='btns-wrap flex-container'>
                    <div class='open-item-btn margin-right-half' title='Learn more about this update'>
                        <a class='text-white' href='${data.itemAgolUrl}' target='_blank'><span class='icon-ui-link-external'></span></a>
                    </div>
                    <div class='js-add-to-webmap add-to-webmap-btn cursor-pointer ${isSelectedClass}' data-release-number='${data.releaseNum}' title='Add this update to an ArcGIS Online Map'></div>
                </div>
                <div class='close-btn js-close-popup-window text-center ${isReticleRightClass}'>
                    <span class='icon-ui-close'></span>
                </div>
            </div>
        `;

        return isReticleOnRight ? contentHtml + reticleHtml : reticleHtml + contentHtml;
    }

    getContainerHtml(){
        const containertHtml = `
            <div id='customizedPopupInfoWindow' class='flex-container hide' style='width:${POPUP_WINDOW_WIDTH}px;'></div>
        `;
        return containertHtml;
    }

}