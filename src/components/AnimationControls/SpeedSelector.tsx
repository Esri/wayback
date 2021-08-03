import React from 'react'


declare global {
    namespace JSX {
        export interface IntrinsicElements {
            'calcite-slider': any;
        }
    }
}

type Props = {
    onChange: (speed:number)=>void;
}

const SpeedSelector:React.FC<Props> = ({
    onChange
}:Props) => {

    const sliderRef = React.useRef<any>()

    const onChangeDely = React.useRef<NodeJS.Timeout>()

    React.useEffect(() => {
        sliderRef.current.addEventListener('calciteSliderChange', (evt:any)=>{
            
            clearTimeout(onChangeDely.current);

            onChangeDely.current = setTimeout(()=>{
                console.log('slider on change', evt.target.value)

                onChange(+evt.target.value)
            }, 500)
        })

        return ()=>{
            clearTimeout(onChangeDely.current);
            sliderRef.current.removeEventListener('calciteSliderChange')
        }
    }, [])

    return (
        <div className='leader-half trailer-1'>

            <div className='trailer-quarter'>
                <span className='font-size--2'>Animation Speed</span>
            </div>

            <div className="padding-left-half padding-right-half ">
                <calcite-slider 
                    ref={sliderRef} 
                    min=".5" 
                    max="3" 
                    snap 
                    ticks=".5" 
                    step=".5" 
                    value="1" 
                    label-ticks
                    theme="dark"
                ></calcite-slider>
            </div>
        </div>
    )
}

export default SpeedSelector
