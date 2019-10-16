import * as React from 'react';


interface IProps {

}

interface IState {

}

class TitleText extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){
        return(
            <div className='app-title-text text-center'>
                <span className='font-size-2 avenir-light trailer-0'>World Imagery <span className='text-white'>Wayback</span></span>
            </div>
        );
    }

};

export default TitleText;