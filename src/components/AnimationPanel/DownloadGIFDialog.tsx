import React, { useState, useCallback, useMemo } from 'react'

import { useDispatch } from 'react-redux'
import { isDownloadGIFDialogOnToggled } from '../../store/reducers/AnimationMode';
import { FrameData } from './generateFrames4GIF';

import LoadingSpinner from './LoadingSpinner'

import classnames from 'classnames';

// import gifshot from 'gifshot';
import GifStream from '@entryline/gifstream';

type Props = {
    frameData: FrameData[];
    rNum2Exclude: number[];
    speed?: number // animation speed in second
}

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

type SaveAsGIFParams = {
    frameData:FrameData[];
    outputFileName: string;
    speed: number;
}

type ResponseCreateGIF = {
    error: string;
    blob : Blob
}

type ImagesCreateGIF = {
    src: string;
    delay: number;
}

const gifStream = new GifStream();

const donwload = (dataURI='', fileName=''):void=>{
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const saveAsGIF = async({    
    frameData,
    outputFileName,
    speed
}:SaveAsGIFParams):Promise<void>=>{

    return new Promise((resolve, reject)=>{

        // const gifShotCallBack: CreateGIFCallBack = (response) => {

        //     if (!response.error) {
        //         donwload(response.image, outputFileName)
        //         resolve();
        //     } else {
        //         reject(response.error)
        //     }
        // };

        // gifshot.createGIF(
        //     {
        //         images,
        //         frameDuration: speed * 10,
        //         gifWidth: frameData[0].width,
        //         gifHeight: frameData[0].height,
        //         // showFrameText: true,
        //         // sampleInterval: 5000,
        //         numWorkers: 2
        //     },
        //     gifShotCallBack
        // );

        const images: ImagesCreateGIF[] = frameData.map(d=>{
            const { frameCanvas, height } = d;

            // const { releaseDateLabel } = waybackItem;

            const context = frameCanvas.getContext('2d');

            // context.font = '22px "Avenir Next';
            // context.shadowColor="black";
            // context.shadowBlur= 5;
            // context.fillStyle = "#fff";
            // context.fillText(`${releaseDateLabel}`, 15, 30);

            context.font = '12px "Avenir Next';
            context.shadowColor="black";
            context.shadowBlur= 5;
            context.fillStyle = "#fff";
            context.fillText(`World Imagery Wayback`, 15, height - 15);

            return {
                src: frameCanvas.toDataURL(),
                delay: speed * 1000
            };
        });

        gifStream.createGIF(
            {
                gifWidth: frameData[0].width,
                gifHeight: frameData[0].height,
                images,
                progressCallback: (progress:number)=>{
                    // console.log(progress)
                }
            },
            (res:ResponseCreateGIF) => {
            //   this.onGifComplete(obj, width, height);
                // console.log(res)

                if(res.error){
                    reject(res.error)
                }

                const blobURL = URL.createObjectURL(res.blob);
                donwload(blobURL, outputFileName)
                resolve();
            },
          );
    })
}

const DownloadGIFDialog:React.FC<Props> = ({
    frameData,
    speed=1,
    rNum2Exclude,
}) => {

    const dispatch = useDispatch();

    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const [outputFileName, setOutputFileName ] = useState<string>('wayback-imagery-animation');

    const closeDialog = useCallback(() => {
        dispatch(isDownloadGIFDialogOnToggled())
    },[])

    const downloadBtnOnClick = useCallback(async()=>{

        setIsDownloading(true)

        const data = !rNum2Exclude.length 
            ? frameData
            : frameData.filter(d=>rNum2Exclude.indexOf(d.releaseNum) === -1)

        try {
            await saveAsGIF({
                frameData: data,
                outputFileName,
                speed
            });

            closeDialog();

        } catch(err){
            console.error(err);
        }

    }, [frameData, rNum2Exclude, outputFileName])

    const getContent = ()=>{
        if(isDownloading){
            return (
                <>
                    <div className='text-center leader-1'>
                        <p className='trailer-quarter'>Generating animated GIF file...</p>
                        <p>Your download will begin shortly.</p>
                    </div>


                    <div className='text-right'>
                        <div className='btn' onClick={closeDialog}>Cancel</div>
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%'
                        }}
                    >
                        <LoadingSpinner />
                    </div>
                </>
            )
        }

        return (
            <>
                <div className='text-center'>
                    <span className='font-size-2'>Download GIF</span>
                </div>

                <div className='leader-1 trailer-1'>
                    <div>
                        <span>File name:</span>
                        <label>
                            <input
                                type="text"
                                // placeholder="https://<my-enterprise-url>/portal"
                                onChange={(evt:React.ChangeEvent<HTMLInputElement>)=>{
                                    setOutputFileName(evt.target.value)
                                }}
                                value={outputFileName}
                            />
                        </label>
                    </div>
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
            </>
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
                { getContent() }
            </div>
        </div>
    )
}

export default DownloadGIFDialog
