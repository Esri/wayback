import './style.scss';
import * as React from 'react';
import AppTitleText from '../TitleText';

interface IProps {
    isGutterVisible?:boolean
    leftNavBtnOnClick?:()=>void
}

interface IState {

}

class TitleText extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){

        const { isGutterVisible, leftNavBtnOnClick } = this.props;

        const leftNavBtnIcon = isGutterVisible
            // close btn
            ? <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path d="M13.207 12.5l7.778 7.778-.707.707-7.778-7.778-7.778 7.778-.707-.707 7.778-7.778-7.778-7.778.707-.707 7.778 7.778 7.778-7.778.707.707z"/></svg>
            // menu btn
            : <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path d="M21 6H3V5h18zm0 6H3v1h18zm0 7H3v1h18z"/></svg>

        return(
            <div className='mobile-header'>
                <div className='header-nav-btn margin-right-1' onClick={leftNavBtnOnClick}>
                    {leftNavBtnIcon}
                </div>
                <AppTitleText/>
            </div>
        );
    }

};

export default TitleText;