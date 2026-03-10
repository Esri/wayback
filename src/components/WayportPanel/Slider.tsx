import classNames from 'classnames';
import React, { useState, useRef, useCallback, useMemo } from 'react';

interface SliderProps {
    min?: number;
    max?: number;
    defaultStart?: number;
    defaultEnd?: number;
    onChange?: (start: number, end: number) => void;
}

interface HandleProps {
    position: number;
    value: number;
    isDragging: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
}

const Handle: React.FC<HandleProps> = ({
    position,
    value,
    isDragging,
    onMouseDown,
}) => {
    return (
        <>
            <div
                onMouseDown={onMouseDown}
                style={{
                    position: 'absolute',
                    left: `${position}%`,
                    transform: 'translateX(-50%)',
                    width: '14px',
                    height: '14px',
                    backgroundColor: isDragging
                        ? 'var(--calcite-color-brand)'
                        : '#2b2b2b',
                    border: `2px solid ${isDragging ? 'var(--calcite-color-brand)' : '#9e9e9e'}`,
                    borderRadius: '50%',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: isDragging ? 3 : 2,
                }}
            />
            <span
                style={{
                    position: 'absolute',
                    left: `${position}%`,
                    transform: 'translateX(-50%)',
                    top: '-8px',
                    fontSize: '12px',
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                {value}
            </span>
        </>
    );
};

export const Slider: React.FC<SliderProps> = ({
    min = 1,
    max = 23,
    defaultStart = 1,
    defaultEnd = 23,
    onChange,
}) => {
    const [startValue, setStartValue] = useState(defaultStart);
    const [endValue, setEndValue] = useState(defaultEnd);
    const [dragging, setDragging] = useState<'start' | 'end' | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    /**
     * This function converts a value to a position percentage for rendering the handles and highlighted range on the slider.
     * @param value
     * @returns
     */
    const getPositionFromValue = (value: number) => {
        return ((value - min) / (max - min)) * 100;
    };

    /**
     * This function converts a clientX position from a mouse event to a corresponding value on the slider,
     * based on the slider's track dimensions and the defined min/max values.
     * @param clientX
     * @returns
     */
    const getValueFromPosition = (clientX: number) => {
        if (!trackRef.current) return min;

        // Get the bounding rectangle of the slider track to calculate the relative position of the mouse event
        const rect = trackRef.current.getBoundingClientRect();

        // Calculate the percentage position of the mouse event within the track, clamping it between 0 and 1
        const percentage = Math.max(
            0,
            Math.min(1, (clientX - rect.left) / rect.width)
        );

        // Convert the percentage to a value within the defined min and max range, rounding to the nearest integer
        const value = Math.round(min + percentage * (max - min));

        // Clamp the value to ensure it stays within the defined min and max bounds
        return Math.max(min, Math.min(max, value));
    };

    // Calculate the position percentages for both handles based on their current values
    const startPosition = getPositionFromValue(startValue);
    const endPosition = getPositionFromValue(endValue);

    /**
     * Initiates the dragging interaction when a handle is pressed.
     * Prevents default to avoid text selection during drag.
     */
    const handleMouseDown =
        (handle: 'start' | 'end') => (e: React.MouseEvent) => {
            e.preventDefault();
            setDragging(handle);
        };

    /**
     * Handles the mouse movement during drag operation.
     * Updates the appropriate handle value while preventing overlap between handles.
     */
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!dragging) return;

            const newValue = getValueFromPosition(e.clientX);

            if (dragging === 'start') {
                // Prevent overlap: start must be at least 1 less than end
                const clampedValue = Math.min(newValue, endValue - 1);
                setStartValue(clampedValue);
                onChange?.(clampedValue, endValue);
            } else {
                // Prevent overlap: end must be at least 1 more than start
                const clampedValue = Math.max(newValue, startValue + 1);
                setEndValue(clampedValue);
                onChange?.(startValue, clampedValue);
            }
        },
        [dragging, startValue, endValue, onChange, min, max]
    );

    /**
     * Ends the dragging interaction when mouse button is released.
     */
    const handleMouseUp = useCallback(() => {
        setDragging(null);
    }, []);

    /**
     * Sets up and tears down document-level event listeners for drag operations.
     * Only active when a handle is being dragged.
     */
    React.useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragging, handleMouseMove, handleMouseUp]);

    // Generate tick marks
    const ticks = useMemo(() => {
        const tickArray = [];
        for (let i = min; i <= max; i++) {
            tickArray.push(i);
        }
        return tickArray;
    }, [min, max]);

    return (
        <div className="w-full px-2">
            <div className="relative h-[36px] flex items-center">
                {/* Track */}
                <div
                    ref={trackRef}
                    className="absolute w-full h-[2px] bg-[#4a4a4a] cursor-pointer"
                />

                {/* Highlighted Range */}
                <div
                    className="absolute h-[2px] bg-[var(--calcite-color-brand)] pointer-events-none"
                    style={{
                        left: `${startPosition}%`,
                        width: `${endPosition - startPosition}%`,
                    }}
                />

                {/* Start Handle */}
                <Handle
                    position={startPosition}
                    value={startValue}
                    isDragging={dragging === 'start'}
                    onMouseDown={handleMouseDown('start')}
                />

                {/* End Handle */}
                <Handle
                    position={endPosition}
                    value={endValue}
                    isDragging={dragging === 'end'}
                    onMouseDown={handleMouseDown('end')}
                />

                {/* Tick Marks */}
                {ticks.map((tick) => {
                    const isInRange = tick >= startValue && tick <= endValue;
                    return (
                        <div
                            key={tick}
                            className={classNames(
                                'absolute -translate-x-1/2 w-[2px] h-1 pointer-events-none',
                                {
                                    'bg-[var(--calcite-color-brand)]':
                                        isInRange,
                                    'bg-[#757575]': !isInRange,
                                }
                            )}
                            style={{
                                left: `${getPositionFromValue(tick)}%`,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
