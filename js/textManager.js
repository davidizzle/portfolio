// Function to set up text with spans for each word
export function setupText(element, text) {
    const words = text.split(' ');
    element.innerHTML = words
        .map(word => `<span class="hidden-word">${word} </span>`)
        .join('');
}

// Function to reveal words by changing opacity
export function revealWord(element, index) {
    const wordSpans = element.querySelectorAll('.hidden-word');
    if (index < wordSpans.length) {
        wordSpans[index].style.opacity = 1; // Trigger the CSS fade-in
        return index + 1; // Return the next index
    }
    return index;
}

// Function to update the text when a new JSON file is loaded
export function updateTextForIndex(index) {
            
    index = index % textSets.length;
    index = (index < 0) ? (textSets.length + index) : index;

    const textData = textSets[index % textSets.length]; // Use modulo to loop over text sets

    // Reset current word indices
    currentWordIndexAbove = 0;
    currentWordIndexBelow = 0;

    fullTextAbove = textData.above;
    fullTextBelow = textData.below;

    // Set up the new text content in the divs
    setupText(textAboveDiv, fullTextAbove);
    setupText(textBelowDiv, fullTextBelow);
}