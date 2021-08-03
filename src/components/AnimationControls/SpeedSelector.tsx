import React from 'react'

type Props = {
    onChange: (speed:number)=>void;
}

const SpeedSelector:React.FC<Props> = ({
    onChange
}:Props) => {
    return (
        <div>
            <div onClick={onChange.bind(this, 500)}>.5</div>
            <div onClick={onChange.bind(this, 1000)}>1</div>
            <div onClick={onChange.bind(this, 2000)}>2</div>
            <div onClick={onChange.bind(this, 3000)}>3</div>
        </div>
    )
}

export default SpeedSelector
