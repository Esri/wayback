import classNames from 'classnames';
import React, {
    useState,
    useRef,
    useCallback,
    useMemo,
    useEffect,
} from 'react';

/**
 * type for the dragging state of the slider handles, can be 'min', 'max', or null when no handle is being dragged
 */
export type SliderHandleType = 'min' | 'max' | null;

type SliderProps = {
    /**
     * Minimum value of the slider, default to 1 if not provided
     */
    min?: number;
    /**
     * Maximum value of the slider, default to 23 if not provided
     */
    max?: number;
    /**
     * Default start value for the slider handle, default to min if not provided
     */
    defaultStart?: number;
    /**
     * Default end value for the slider handle, default to max if not provided
     */
    defaultEnd?: number;
    /**
     * emits the current start and end values when user finishes dragging either of the handles
     * @param start
     * @param end
     * @returns
     */
    onChange: (start: number, end: number) => void;
    /**
     * Emits which handle is being dragged whenever user drags either of the handles, emits null when user stops dragging.
     * This is useful if the parent component wants to show some helper UI based on which handle is being dragged.
     * @param handleOnDragging
     * @returns
     */
    draggedHandleOnChange: (handleOnDragging: SliderHandleType) => void;
};

interface HandleProps {
    position: number;
    value: number;
    isDragging: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    type: 'min' | 'max';
    isAdjacent: boolean;
}

const Handle: React.FC<HandleProps> = ({
    position,
    value,
    isDragging,
    onMouseDown,
    type,
    isAdjacent,
}) => {
    // Adjust label position when handles are adjacent to prevent overlap
    const labelTransform =
        isAdjacent && type === 'min' ? 'translateX(-75%)' : 'translateX(-50%)';

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
                    transform: labelTransform,
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
    draggedHandleOnChange,
}) => {
    const [startValue, setStartValue] = useState(defaultStart);
    const [endValue, setEndValue] = useState(defaultEnd);
    const [dragging, setDragging] = useState<SliderHandleType>(null);
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

    // Check if handles are adjacent (next to each other)
    const isAdjacent = endValue - startValue === 1;

    /**
     * Initiates the dragging interaction when a handle is pressed.
     * Prevents default to avoid text selection during drag.
     */
    const handleMouseDown =
        (handle: SliderHandleType) => (e: React.MouseEvent) => {
            e.preventDefault();
            setDragging(handle);
        };

    /**
     * Ends the dragging interaction when mouse button is released.
     */
    const handleMouseUp = useCallback(() => {
        // console.log('Mouse up, end dragging');
        setDragging(null);
    }, []);

    /**
     * Handles the mouse movement during drag operation.
     * Updates the appropriate handle value while preventing overlap between handles.
     */
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!dragging) return;

            const newValue = getValueFromPosition(e.clientX);

            if (dragging === 'min') {
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
        [dragging, startValue, endValue]
    );

    // Generate tick marks
    const ticks = useMemo(() => {
        const tickArray = [];
        for (let i = min; i <= max; i++) {
            tickArray.push(i);
        }
        return tickArray;
    }, [min, max]);

    /**
     * Sets up and tears down document-level event listeners for drag operations.
     * Only active when a handle is being dragged.
     */
    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragging, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        draggedHandleOnChange(dragging);
    }, [dragging]);

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
                    isDragging={dragging === 'min'}
                    onMouseDown={handleMouseDown('min')}
                    type="min"
                    isAdjacent={isAdjacent}
                />

                {/* End Handle */}
                <Handle
                    position={endPosition}
                    value={endValue}
                    isDragging={dragging === 'max'}
                    onMouseDown={handleMouseDown('max')}
                    type="max"
                    isAdjacent={isAdjacent}
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
