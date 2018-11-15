import $ from 'jquery';

import './style.scss';

export default class PopupInfoWindow {
    constructor(){
        this.container = null;

        this.render();
    }

    initEventHandler(){

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

        this.setPosition(screenPoint.x, screenPoint.y);
        this.setContent(metaData);

        this.toggleVisibility(true);
    }

    hide(){
        this.toggleVisibility(false);
    }

    setPosition(x=0, y=0){
        // const containerWidth = this.container.width();
        this.container.css('left', x + 'px');
        this.container.css('top', y + 'px');
    }

    setContent(metaData){
        const contentHtml = this.getPopupContentHtml(metaData);
        this.container.html(contentHtml);
    }

    toggleVisibility(isVisible){
        this.container.toggleClass('hide', !isVisible);
    }

    render(){
        const containertHtml = this.getContainerHtml();
        this.container = $(containertHtml);
        $('body').append(this.container);
    }

    getPopupContentHtml(data){
        const componentHtml = `
            <div class='content-wrap text-white font-size--2'>
                <span>imagery date: ${data.date}</span>
                <br>
                <span>${data.resolution}m source resolution</span>
            </div>
        `;
        return componentHtml;
    }

    getContainerHtml(){
        const containertHtml = `
            <div id='customizedPopupInfoWindow' class='hide'></div>
        `;
        return containertHtml;
    }
}