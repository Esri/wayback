import './style.scss';
import * as React from 'react';
import { modal } from 'calcite-web/dist/js/calcite-web.min.js';

interface IProps {

}

interface IState {

}

class AboutThisApp extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    componentDidMount(){
        modal();
    }

    render(){
        return(
            <div className="js-modal modal-overlay customized-modal" data-modal="about">
                <div className="modal-content column-12" role="dialog" aria-labelledby="modal">
                
                    <span className="js-modal-toggle cursor-pointer right" aria-label="close-modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 32 32" className="svg-icon"><path d="M18.404 16l9.9 9.9-2.404 2.404-9.9-9.9-9.9 9.9L3.696 25.9l9.9-9.9-9.9-9.898L6.1 3.698l9.9 9.899 9.9-9.9 2.404 2.406-9.9 9.898z"/></svg>
                    </span>
                
                    <h2 className='trailer-half text-center trailer-1'>World Imagery Wayback</h2>
                    <h5 className=''>WHAT</h5>
                    <p>
                        Wayback is a digital archive, providing users with access to the different versions of <a href='https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9' target='_blank'>World Imagery</a> created over time. Each layer in the archive represents a snapshot of the entire World Imagery map, as it existed on the date it was published. Wayback currently provides access to all published versions of World Imagery, dating back to February 20, 2014. There is an ArcGIS Online item for every version which can be accessed directly from this app or within the <a href='https://www.arcgis.com/home/group.html?id=0f3189e1d1414edfad860b697b7d8311#settings' target='_blank'>Wayback Imagery group</a>.
                    </p>

                    <h5 className=''>WHY</h5>
                    <p>
                        As World Imagery is updated with more current imagery, new versions of the map are published.  When and where updates occur, the previous imagery is replaced and is no longer visible. For many use cases, the new imagery is more desirable and typically preferred. Other times, however, the previous imagery may support use cases that the new imagery does not. In these cases, a user may need to access a previous version of World Imagery.
                    </p>

                    <h5 className=''>HOW</h5>
                    <p>
                        Available versions of the World Imagery map are presented within a timeline and as layers in a list. Versions that resulted in local changes are highlighted in bold white, and the layer currently selected is highlighted in blue. Point and click on the map for additional imagery details within the selected layer. One or more layers can be added to a queue and pushed to a new ArcGIS Online web map.
                    </p>
                
                </div>
            </div>
        );
    }

};

export default AboutThisApp;