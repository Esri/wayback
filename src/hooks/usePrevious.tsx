import { useRef, useEffect } from "react";

export const usePrevious = <T extends unknown>(value:T):T=>{

    const ref = useRef<T>();

    // Store current value in ref
    useEffect(() => {
        ref.current = value;
    }, [value]); // Only re-run if value changes

    // Return previous value (happens before update in useEffect above)
    return ref.current;

}