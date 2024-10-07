function getSessionKey() {
    return window.location.hostname;
}

export async function getSessionHistory(isGlobal = false) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(["chatbotData"], (results) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                const chatbotData = results["chatbotData"] as Record<string, { role: "user" | "model", parts: { text: string }[] }[] | undefined>;
                resolve(chatbotData?.[isGlobal ? "global" : getSessionKey()] ?? []);
            }
        });
    });
}

export function setSessionHistory(sessionHistory: { role: "user" | "model", parts: { text: string }[] }[], isGlobal = false, callback?: Function) {
    chrome.storage.sync.get(["chatbotData"], (results) => {
        let chatbotData = results.chatbotData || {};
        chatbotData[isGlobal ? "global" : getSessionKey()] = sessionHistory;
        chrome.storage.sync.set({ chatbotData }, function () {
            console.log("Saved chatbotData");
            if (callback) {
                callback();
            }
        });
    });
}

export function clearSessionHistory(isGlobal = false, callback?: Function) {
    chrome.storage.sync.get("chatbotData", function (result) {
        let chatbotData = result.chatbotData || {};
        if (isGlobal) {
            chatbotData.global = [];
        } else {
            chatbotData[getSessionKey()] = [];
        }
        chrome.storage.sync.set({ chatbotData }, function () {
            console.log("Cleared chatbotData");
            if (callback) {
                callback();
            }
        });
    });
}

export function addSessionHistory(newChatbotData: { role: "user" | "model", parts: { text: string }[] }[], isGlobal = false, callback?: Function) {
    getSessionHistory(isGlobal)
        .then((sessionHistory) => {
            // @ts-expect-error
            const updatedHistory = [...sessionHistory, ...newChatbotData]; // Concatenate new data
            setSessionHistory(updatedHistory, isGlobal, callback);
        })
        .catch((error) => {
            console.error("Failed to retrieve session history:", error);
        });
}

export async function callbackResponse(input: string, isGlobal = false, callback: (result: {response: string, history: { role: "user" | "model", parts: { text: string }[] }[]}) => void) {
    fetch('https://www.task-tackler.com/api/gemini/get-response', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
            input: input,
            history: await getSessionHistory(isGlobal)
        }),
    })
    .then(response => response.json())
    .then(data => {
        callback(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}