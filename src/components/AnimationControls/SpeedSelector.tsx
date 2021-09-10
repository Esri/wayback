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

const MIN_VAL = .0; // min animation speed is .5 second
const MAX_VAL = 2; // max animation speed is 3 second
const SLIDER_STEP = .25

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
                // onChange(+evt.target.value)

                const tickVal = Math.floor(+evt.target.value * 100) / 100;
                
                // the max val indciates fastes time and min val indicates slowest, therefore we need to use max val to minus the tick val 
                // to get the actual animation speed, let's say the tick val is 2 and max val is 3, that gives a current speed of 1 second
                const val = MAX_VAL - tickVal;

                onChange(val);

            }, 500)
        })

        return ()=>{
            clearTimeout(onChangeDely.current);
        }
    }, [])

    // React.useEffect(() => {
    //     console.log(defaultVal)
    // }, [defaultVal])

    return (
        <div 
            style={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center'
            }}
            className="calcite-theme-dark"
        >
            <span className='margin-right-half avenir-demi'>-</span>

            <div 
                style={{
                    flexGrow: 1,
                }}
            >
                <calcite-slider 
                    ref={sliderRef} 
                    min={MIN_VAL} 
                    max={MAX_VAL}
                    snap 
                    ticks={SLIDER_STEP.toString()}
                    step={SLIDER_STEP}
                    value={MAX_VAL - defaultVal} 
                ></calcite-slider>
            </div>

            <span className='margin-left-half avenir-demi'>+</span>

        </div>
    )
}

export default SpeedSelector
