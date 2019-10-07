import './style.scss';
import * as React from 'react';
import * as calcite from 'calcite-web/dist/js/calcite-web.min.js';
import config from './config';

interface IProps {
    isVisible:boolean

    onClose:()=>void
}

interface IState {
    title:string
    tags:string
    description:string

    isCreatingWebmap:boolean
    isWebmapReady:boolean
}

class SaveAsWebmapDialog extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);

        this.state = {
            title: config.title,
            tags: config.tags,
            description: config.description,
            isCreatingWebmap:false,
            isWebmapReady:false
        }

        this.setTitle = this.setTitle.bind(this);
        this.setTags = this.setTags.bind(this);
        this.setDescription = this.setDescription.bind(this);
    }

    setTitle(event:React.ChangeEvent<HTMLInputElement>){
        this.setState({
            title: event.target.value
        });
    }

    setTags(event:React.ChangeEvent<HTMLInputElement>){
        this.setState({
            tags: event.target.value
        });
    }

    setDescription(event:React.ChangeEvent<HTMLTextAreaElement>){
        this.setState({
            description: event.target.value
        });
    }

    getEditDialog(){

        const { title, tags, description, isCreatingWebmap } = this.state;

        const creatingIndicator = isCreatingWebmap 
            ? (
                <span className='font-size--2 margin-right-quarter web-map-on-creating-indicator'>Creating Web Map...</span>
            ) : null;

        const creatWebMapBtn = !isCreatingWebmap 
            ? (
                <div className="btn upload-webmap-btn">
                    Create Wayback Map
                </div>
            ) : null;

        return (
            <div className='dialog-content'>
                <h5>Wayback Map Settings:</h5>
                <label>
                    Title
                    <input type="text" placeholder="Tilte is required" className={ title ? 'input-success' : 'input-error'} value={title} onChange={this.setTitle} required={true} disabled={ isCreatingWebmap ? true : false }/>
                </label>

                <label>
                    Tags
                    <input type="text" placeholder="tags are required" className={ tags ? 'input-success' : 'input-error'} value={tags} onChange={this.setTags} required={true} disabled={ isCreatingWebmap ? true : false }/>
                </label>

                <label>
                    Description: (Optional)
                    <textarea value={description} onChange={this.setDescription} disabled={ isCreatingWebmap ? true : false }></textarea>
                </label>

                <div className="leader-half text-right">
                    { creatingIndicator }
                    { creatWebMapBtn }
                </div>
            </div>
        )
    }

    getOpenWebmapContent(){
        return (
            <div>
                <p className='message-webamap-is-ready'>Your Wayback Map is ready!</p>
                <div className="btn btn-fill">
                    Open Wayback Map
                </div>
            </div>
        );
    }

    toggleDialog(){
        const { isVisible } = this.props;

        if(isVisible){
            calcite.bus.emit('modal:open', {id: "save-as-webmap-dialog"})
        } else {
            calcite.bus.emit('modal:close')
        }
    }

    componentDidUpdate(prevPros:IProps){
        if(prevPros.isVisible !== this.props.isVisible){
            this.toggleDialog();
        }

        // if()
    }

    componentDidMount(){
        calcite.modal();
    }

    render(){

        const { onClose } = this.props;
        const { isWebmapReady } = this.state;

        const editDialogContent = !isWebmapReady ? this.getEditDialog() : null;

        const openWebmapContent = isWebmapReady ? this.getOpenWebmapContent() : null;

        return(
            <div className='save-as-webmap-dialog-container'>
                <div className="js-modal modal-overlay customized-modal" data-modal="save-as-webmap-dialog">
                    <div className="modal-content column-6" role="dialog" aria-labelledby="modal">

                        <div className='trailer-0 text-right'>
                            <span className="cursor-pointer" aria-label="close-modal" onClick={onClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 32 32" className="svg-icon"><path d="M18.404 16l9.9 9.9-2.404 2.404-9.9-9.9-9.9 9.9L3.696 25.9l9.9-9.9-9.9-9.898L6.1 3.698l9.9 9.899 9.9-9.9 2.404 2.406-9.9 9.898z"/></svg>
                            </span>
                        </div>

                        { editDialogContent }

                        { openWebmapContent }
                    </div>
                </div>
            </div>
        );
    }

};

export default SaveAsWebmapDialog;