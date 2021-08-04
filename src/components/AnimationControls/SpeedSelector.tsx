import React from 'react'


declare global {
    namespace JSX {
        export interface IntrinsicElements {
            'calcite-slider': any;
        }
    }
}

type Props = {
    defaultVal: number;
    onChange: (speed:number)=>void;
}

const MIN_VAL = .5; // min animation speed is .5 second
const MAX_VAL = 3; // max animation speed is 3 second
const SLIDER_STEP = .5

const SpeedSelector:React.FC<Props> = ({
    defaultVal,
    onChange
}:Props) => {

    const sliderRef = React.useRef<any>()

    const onChangeDely = React.useRef<NodeJS.Timeout>()

    React.useEffect(() => {
        sliderRef.current.addEventListener('calciteSliderChange', (evt:any)=>{
            
            clearTimeout(onChangeDely.current);

            onChangeDely.current = setTimeout(()=>{
                // console.log('slider on change', evt.target.value)
                onChange(+evt.target.value)
            }, 500)
        })

        return ()=>{
            clearTimeout(onChangeDely.current);
        }
    }, [])

    React.useEffect(() => {
        console.log(defaultVal)
    }, [defaultVal])

    return (
        <div className='leader-half trailer-1'>

            <div className='trailer-quarter'>
                <span className='font-size--3'>Animation Speed</span>
            </div>

            <div className="padding-left-half padding-right-half ">
                <calcite-slider 
                    ref={sliderRef} 
                    min={MIN_VAL} 
                    max={MAX_VAL}
                    snap 
                    ticks=".5" 
                    step={SLIDER_STEP}
                    value={defaultVal} 
                    label-ticks
                    theme="dark"
                ></calcite-slider>
            </div>
        </div>
    )
}

export default SpeedSelector
