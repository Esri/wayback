import React, { useState, useRef, useCallback } from 'react';

interface SliderProps {
    min?: number;
    max?: number;
    defaultStart?: number;
    defaultEnd?: number;
    onChange?: (start: number, end: number) => void;
}

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

    const getPositionFromValue = (value: number) => {
        return ((value - min) / (max - min)) * 100;
    };

    const getValueFromPosition = (clientX: number) => {
        if (!trackRef.current) return min;

        const rect = trackRef.current.getBoundingClientRect();
        const percentage = Math.max(
            0,
            Math.min(1, (clientX - rect.left) / rect.width)
        );
        const value = Math.round(min + percentage * (max - min));
        return Math.max(min, Math.min(max, value));
    };

    const handleMouseDown =
        (handle: 'start' | 'end') => (e: React.MouseEvent) => {
            e.preventDefault();
            setDragging(handle);
        };

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

    const handleMouseUp = useCallback(() => {
        setDragging(null);
    }, []);

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

    const startPosition = getPositionFromValue(startValue);
    const endPosition = getPositionFromValue(endValue);

    // Generate tick marks
    const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    return (
        <div style={{ padding: '10px', width: '100%' }}>
            <div
                style={{
                    position: 'relative',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {/* Track */}
                <div
                    ref={trackRef}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '2px',
                        backgroundColor: '#4a4a4a',
                        // borderRadius: '1.5px',
                        cursor: 'pointer',
                    }}
                />

                {/* Highlighted Range */}
                <div
                    style={{
                        position: 'absolute',
                        left: `${startPosition}%`,
                        width: `${endPosition - startPosition}%`,
                        height: '2px',
                        backgroundColor: 'var(--calcite-color-brand)',
                        // borderRadius: '1.5px',
                        pointerEvents: 'none',
                    }}
                />

                {/* Start Handle */}
                <div
                    onMouseDown={handleMouseDown('start')}
                    style={{
                        position: 'absolute',
                        left: `${startPosition}%`,
                        transform: 'translateX(-50%)',
                        width: '14px',
                        height: '14px',
                        backgroundColor:
                            dragging === 'start'
                                ? 'var(--calcite-color-brand)'
                                : '#2b2b2b',
                        border: `2px solid ${dragging === 'start' ? 'var(--calcite-color-brand)' : '#9e9e9e'}`,
                        borderRadius: '50%',
                        cursor: 'grab',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: dragging === 'start' ? 3 : 2,
                        ...(dragging === 'start' && { cursor: 'grabbing' }),
                    }}
                />
                <span
                    style={{
                        position: 'absolute',
                        left: `${startPosition}%`,
                        transform: 'translateX(-50%)',
                        top: '0px',
                        fontSize: '12px',
                        // fontWeight: 'bold',
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                >
                    {startValue}
                </span>

                {/* End Handle */}
                <div
                    onMouseDown={handleMouseDown('end')}
                    style={{
                        position: 'absolute',
                        left: `${endPosition}%`,
                        transform: 'translateX(-50%)',
                        width: '14px',
                        height: '14px',
                        backgroundColor:
                            dragging === 'end'
                                ? 'var(--calcite-color-brand)'
                                : '#2b2b2b',
                        border: `2px solid ${dragging === 'end' ? 'var(--calcite-color-brand)' : '#9e9e9e'}`,
                        borderRadius: '50%',
                        cursor: 'grab',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: dragging === 'end' ? 3 : 2,
                        ...(dragging === 'end' && { cursor: 'grabbing' }),
                    }}
                />
                <span
                    style={{
                        position: 'absolute',
                        left: `${endPosition}%`,
                        transform: 'translateX(-50%)',
                        top: '0px',
                        fontSize: '12px',
                        // fontWeight: 'bold',
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                >
                    {endValue}
                </span>

                {/* Tick Marks */}
                {ticks.map((tick) => {
                    const isInRange = tick >= startValue && tick <= endValue;
                    return (
                        <div
                            key={tick}
                            style={{
                                position: 'absolute',
                                left: `${getPositionFromValue(tick)}%`,
                                transform: 'translateX(-50%)',
                                width: '2px',
                                height: '4px',
                                backgroundColor: isInRange
                                    ? 'var(--calcite-color-brand)'
                                    : '#757575',
                                pointerEvents: 'none',
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
