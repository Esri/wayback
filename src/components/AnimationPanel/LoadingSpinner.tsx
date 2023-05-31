import './LoadingSpinner.css';
import React from 'react';

// import styled, { keyframes } from 'styled-components';

// const bounce = keyframes`
// 	0% {
//         margin-left:-25%;
//     }
// 	50% {
//         margin-left:100%;
//     }
// `;

// const SpinnerWrap = styled.div`
//     position: relative;
//     /* top: -1px;
//     left: 0; */
//     width: 100%;
//     height: 3px;
//     overflow: hidden;
// `;

// const SpinnerLine = styled.div`
//     background-color: #fff;
//     width: 30%;
//     height: 100%;
//     margin-top: 0;
//     margin-left: -25%;
//     animation: ${bounce} 2s infinite ease-in;
// `;

const LoadingSpinner = () => {
    return (
        <div className="spinner-wrap">
            <div className="spinner-line" />
        </div>
    );
};

export default LoadingSpinner;
