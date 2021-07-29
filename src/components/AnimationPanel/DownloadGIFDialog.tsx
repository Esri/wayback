import React, { useState, useCallback, useMemo } from 'react'

import { useDispatch } from 'react-redux'
import { isDownloadGIFDialogOnToggled } from '../../store/reducers/AnimationMode';
import { FrameData } from './generateFrames4GIF';

import classnames from 'classnames';

type Props = {
    frameData: FrameData[]
}

import gifshot from 'gifshot';

type CreateGIFCallBack = (response: {
    // image - Base 64 image
    image: string;
    // error - Boolean that determines if an error occurred
    error: boolean;
    // errorCode - Helpful error label
    errorCode: string;
    // errorMsg - Helpful error message
    errorMsg: string;
}) => void;

const donwload = (dataURI='', fileName='')=>{
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const DownloadGIFDialog:React.FC<Props> = ({
    frameData
}) => {

    const dispatch = useDispatch();

    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const [outputFileName, setOutputFileName ] = useState<string>('wayback-imagery-animation');

    const closeDialog = useCallback(() => {
        dispatch(isDownloadGIFDialogOnToggled())
    },[])

    const downloadBtnOnClick = useCallback(()=>{

        setIsDownloading(true)

        const callback: CreateGIFCallBack = (response) => {
            if (!response.error) {
                donwload(response.image, outputFileName)
            }

            closeDialog()
        };

        gifshot.createGIF(
            {
                images: frameData.map(d=>d.frameDataURI),
                frameDuration: 10,
                gifWidth: frameData[0].width,
                gifHeight: frameData[0].height,
                showFrameText: true,
            },
            callback
        );
    }, [frameData, outputFileName])

    const getContent = ()=>{
        if(isDownloading){
            return <span>Generating GIF file, please don't close the window</span>
        }

        return (
            <div>
                <span>Output file name:</span>
                <label>
                    <input
                        type="text"
                        // placeholder="https://<my-enterprise-url>/portal"
                        // onChange={this.portalUrlInputOnChange}
                        value={outputFileName}
                    />
                </label>
            </div>
        )
    }

    return (
        <div
            className="modal-overlay customized-modal is-active"
        >
            <div
                className="modal-content column-8"
                role="dialog"
                aria-labelledby="modal"
            >
                <div className='text-center'>
                    <span className='font-size-2'>Save Animation as GIF file</span>
                </div>

                <div className='leader-1 trailer-1'>
                    { getContent() }
                </div>

                <div 
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}
                >
                    <div className='btn btn-transparent' onClick={closeDialog}>Close</div>
                    <div className={classnames('btn', {'btn-disabled': isDownloading})} onClick={downloadBtnOnClick}>Download</div>
                </div>
            </div>
            
        </div>
    )
}

export default DownloadGIFDialog
