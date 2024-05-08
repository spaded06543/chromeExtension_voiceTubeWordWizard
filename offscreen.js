chrome.runtime.onMessage.addListener(
    (word, sender, callbackFn) =>
    {
        if (sender.tab !== undefined)
            return;

        (async () =>
        {
            console.info(`scrapping : <${word}>`);
            callbackFn(await getDefinitionsFromExternal(word));
            console.info(`end of scrapping : <${word}>`);
        })();
        return true;
    });

async function getDefinitionsFromExternal(word)
{
    try
    {
        let response = await fetch(`https://dictionary.cambridge.org/dictionary/english/${word}`);
        
        if (!response.ok) 
            throw new Error('HTTP error ' + response.status);  
        
        let responseHtml = new DOMParser().parseFromString(await response.text(), "text/html");
        let definitions = [];

        responseHtml
            .querySelectorAll(".def.ddef_d.db")
            .forEach(element => 
                {
                    if (element.textContent !== null)
                        definitions.push(element.textContent);
                });
        return definitions.map((val, idx, _) => `${idx + 1}: ${val}`);
    }
    catch(e)
    {
        return [`[error] ${e}`];
    }
}
