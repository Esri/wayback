export const copy2clipboard = (text: string) => {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // Set the position to be off-screen
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';

    // Append the textarea to the document
    document.body.appendChild(textarea);

    // Select the text in the textarea
    textarea.select();

    // Execute the copy command
    document.execCommand('copy');

    // Remove the textarea from the document
    document.body.removeChild(textarea);
};
