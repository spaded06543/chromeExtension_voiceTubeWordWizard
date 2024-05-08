var searchIconImgUrl = chrome.runtime.getURL("images/cambridge-logo.png");

document.onreadystatechange = () =>
{
    console.debug(`dom state : ${document.readyState}`);
    addSearchButton();
}

let wordElementMap = {};
function addSearchButton()
{
    var cardCollection = document.getElementsByClassName("vocab-card");
    console.debug(`word collection size: ${cardCollection.length}`);
    for (let index = 0; index < cardCollection.length; index++) {
        const element = cardCollection.item(index);
        const word = element.querySelector("h6").textContent.match(/\w+/);
        
        if (word.length == 0)
            continue;
        const wordContent = word[0];
        
        const title = element.getElementsByClassName("vocab-title")[0];
        
        var button = document.createElement('img');
        button.classList.add("action-item");
        button.src = searchIconImgUrl;
        button.alert = 'Search in Cambridge';
        //TODO: dynamically change button's style
        button.style.marginLeft = '16px';
        button.width = 24;
        button.height = 24;
        button.addEventListener(
            'click', 
            () => 
            {
                // alert(`Search <${wordContent}>`);
                //append the definition at the end
                wordElementMap[word] = element.getElementsByClassName("vocab-definition")[0];

                console.log(`searching <${word}>`);

                chrome.runtime.sendMessage(word);
            });

        // Append the button to the container
        title.appendChild(button);
    }
}

chrome.runtime.onMessage.addListener(
    (message, sender, sendMessage) =>
    {
        let word = message.word;
        let definitions = message.definitions;

        if (word === undefined)
            return;
        
        let elementRoot = wordElementMap[word];

        if(elementRoot === undefined)
        {
            console.warn(`element root for ${word} dose not exist`);
            return;
        }

        let lastRow = elementRoot.children.item(elementRoot.children.length - 1);
        
        console.info(`definitions count: ${definitions.length}`);
        definitions.forEach(
            definition =>
            {
                let cloneOne = lastRow.cloneNode(true);
                cloneOne.textContent = definition;
                elementRoot.appendChild(cloneOne);
            });
        wordElementMap[word] = undefined;
    });