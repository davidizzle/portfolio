class TextManager {
    constructor() {
        this.textAboveDiv = document.getElementById('textAbove');
        this.textBelowDiv = document.getElementById('textBelow');
        this.textSets = [
            { above: "This is my personal website. Have a look around.", below: "Oh! Feel free to navigate with ← and → arrows." },
            { above: "Here, I keep a collection of my favorite projects.", below: "Let's explore some together!" },
            { above: "Under construction...", below: "Wow, such empty..." },
            { above: "Under construction...", below: "Wow, such empty..." },
            { above: "Under construction...", below: "Wow, such empty..." }
        ];
        this.currWordIndexAbove = 0;
        this.currWordIndexBelow = 0;
    }

    updateTextForIndex(index) {
        index = index % this.textSets.length;
        index = (index < 0) ? (this.textSets.length + index) : index;

        const textData = this.textSets[index % this.textSets.length]; // Use modulo to loop over text sets
        console.log(textData);
        // Reset current word indices
        this.currWordIndexAbove = 0;
        this.currWordIndexBelow = 0;

        // Set up the new text content in the divs
        this.setupText(this.textAboveDiv, textData.above);
        this.setupText(this.textBelowDiv, textData.below);
    }

    setupText(element, text) {
        const words = text.split(' ');
        element.innerHTML = words
            .map(word  => `<span class="hidden-word">${word} </span>`)
            .join('');
    }

    revealWord(element, which) {
        
        let index = (which == 'above') ? this.currWordIndexAbove : this.currWordIndexBelow;
        
        const wordSpans = element.querySelectorAll('.hidden-word');
        if (index < wordSpans.length) {
            wordSpans[index].style.opacity = 1; // Trigger the CSS fade-in
            index += 1; // Return the next index
        }
        
        if (which == 'above') { this.currWordIndexAbove = index; } 
        else { this.currWordIndexBelow = index; }
    }
    
}
export default TextManager;