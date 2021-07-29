import React from 'react'
import { useDispatch } from 'react-redux'
import { isDownloadGIFDialogOnToggled } from '../../store/reducers/AnimationMode';

const DonwloadGifButton = () => {

    const dispatch = useDispatch();

    const onClickHandler = ()=>{
        dispatch(isDownloadGIFDialogOnToggled())
    }

    return (
        <div className='btn btn-fill' onClick={onClickHandler}>Download GIF</div>
    )
}

export default DonwloadGifButton
