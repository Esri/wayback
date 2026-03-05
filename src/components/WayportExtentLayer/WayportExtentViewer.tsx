import React, { useState, useRef } from 'react';

const MIN_SIZE = 256;

type Dimensions = {
    width: number;
    height: number;
};

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export const WayportExtentViewer = () => {
    const [dimensions, setDimensions] = useState<Dimensions>({
        width: 600,
        height: 400,
    });

    const dragInfoRef = useRef<{
        corner: Corner;
        startX: number;
        startY: number;
        startWidth: number;
        startHeight: number;
    } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent) => {
        if (!dragInfoRef.current || !containerRef.current) return;

        const { corner, startX, startY, startWidth, startHeight } =
            dragInfoRef.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Get parent dimensions
        const parentRect = containerRef.current.getBoundingClientRect();
        const maxWidth = parentRect.width * 0.8;
        const maxHeight = parentRect.height * 0.8;

        let newWidth = startWidth;
        let newHeight = startHeight;

        // Calculate new dimensions based on which corner is being dragged
        // Multiply by 2 because the box is centered, so it expands equally on both sides
        if (corner.includes('right')) {
            newWidth = startWidth + deltaX * 2;
        } else if (corner.includes('left')) {
            newWidth = startWidth - deltaX * 2;
        }

        if (corner.includes('bottom')) {
            newHeight = startHeight + deltaY * 2;
        } else if (corner.includes('top')) {
            newHeight = startHeight - deltaY * 2;
        }

        // Enforce minimum and maximum size
        newWidth = Math.max(MIN_SIZE, Math.min(maxWidth, newWidth));
        newHeight = Math.max(MIN_SIZE, Math.min(maxHeight, newHeight));

        setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
        dragInfoRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (corner: Corner, evt: React.MouseEvent) => {
        evt.preventDefault();
        dragInfoRef.current = {
            corner,
            startX: evt.clientX,
            startY: evt.clientY,
            startWidth: dimensions.width,
            startHeight: dimensions.height,
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            ref={containerRef}
            className="absolute top-0 left-0 w-full h-full z-0 flex items-center justify-center pointer-events-none"
        >
            <div
                className="relative "
                style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
                }}
            >
                {/* Corner handles */}
                <button
                    className="absolute -top-2 -left-2 w-4 h-4 bg-white pointer-events-auto cursor-nw-resize"
                    onMouseDown={(e) => handleMouseDown('top-left', e)}
                />
                <button
                    className="absolute -top-2 -right-2 w-4 h-4 bg-white pointer-events-auto cursor-ne-resize"
                    onMouseDown={(e) => handleMouseDown('top-right', e)}
                />
                <button
                    className="absolute -bottom-2 -left-2 w-4 h-4 bg-white  pointer-events-auto cursor-sw-resize"
                    onMouseDown={(e) => handleMouseDown('bottom-left', e)}
                />
                <button
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-white pointer-events-auto cursor-se-resize"
                    onMouseDown={(e) => handleMouseDown('bottom-right', e)}
                />
            </div>
        </div>
    );
};
