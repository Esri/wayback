import React from 'react';

declare global {
    namespace JSX {
        export interface IntrinsicElements {
            'calcite-loader': any;
            'calcite-icon': any;
            'calcite-button': any;
        }
    }
}
