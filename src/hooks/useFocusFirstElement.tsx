/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect } from 'react';

/**
 * Focuses the first focusable element within the given container element.
 * @param container - The container element within which to find the first focusable element
 */
export const focusOnFirstElement = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll<HTMLElement>(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length) {
        focusableElements[0].focus();
    }
};

/**
 * This hook focuses the first focusable element within the given ref container when the component mounts.
 * This is useful for accessibility, ensuring that keyboard users can easily navigate to the first interactive element.
 * @param ref - React ref object pointing to a container element
 */
export const useFocusFirstElement = (ref: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        if (ref.current) {
            focusOnFirstElement(ref.current);
        }
    }, [ref]);
};

// export default useFocusFirstElement;
