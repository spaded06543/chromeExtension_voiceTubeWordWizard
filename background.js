chrome.runtime.onMessage.addListener(
    (word, sender, callbackFn) =>
    {
        if (sender.tab === undefined)
            return;
        
        (async () =>
        {
            if (!(await chrome.offscreen.hasDocument()))
            {
                await chrome.offscreen.createDocument(
                    {
                        url: '/offscreen.html',
                        reasons: [chrome.offscreen.Reason.DOM_PARSER],
                        justification: 'scraping vocabulary definition.'
                    });
            }
            
            chrome.runtime.sendMessage(
                word,
                (definitions) =>
                {
                    console.log(`send definition (${definitions.length}) back <${word}>`);
                    chrome.tabs.sendMessage(
                        sender.tab.id,
                        {
                            word: word,
                            definitions: definitions
                        })
                });

        })();
        return true;
    });