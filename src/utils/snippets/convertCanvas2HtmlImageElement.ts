/**
 * Converts an HTMLCanvasElement to an HTMLImageElement.
 * @param canvas - The HTMLCanvasElement to be converted.
 * @returns A promise that resolves to an HTMLImageElement.
 */
export const convertCanvas2HtmlImageElement = async (
    canvas: HTMLCanvasElement
): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const img = new Image();

                img.onload = () => {
                    URL.revokeObjectURL(url);
                    resolve(img);
                };

                img.onerror = (error) => {
                    URL.revokeObjectURL(url);
                    reject(error);
                };

                img.src = url;
            } else {
                reject(new Error('Failed to convert canvas to blob'));
            }
        });
    });
};
