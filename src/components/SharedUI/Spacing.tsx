import React from 'react';

type Props = {
    padding?: number | string;
    margin?: number | string;
    paddingTop?: number | string;
    paddingBottom?: number | string;
    paddingLeft?: number | string;
    paddingRight?: number | string;
    marginTop?: number | string;
    marginBottom?: number | string;
    marginLeft?: number | string;
    marginRight?: number | string;
    children: React.ReactNode;
};

const Spacing: React.FC<Props> = ({
    padding = 0,
    margin = 0,
    paddingTop = 0,
    paddingRight = 0,
    paddingBottom = 0,
    paddingLeft = 0,
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    marginLeft = 0,
    children,
}: Props) => {
    return (
        <div
            style={{
                padding: `
                    ${padding || paddingTop} 
                    ${padding || paddingRight} 
                    ${padding || paddingBottom} 
                    ${padding || paddingLeft}
                `,
                margin: `
                    ${margin || marginTop} 
                    ${margin || marginRight} 
                    ${margin || marginBottom} 
                    ${margin || marginLeft}
                `,
            }}
        >
            {children}
        </div>
    );
};

export default Spacing;
