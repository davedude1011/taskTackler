export function saveSparxData(data: { question: string|null, submitAnswer: string|null, timestamp?: number }, id: string, callback: (newData: Record<string, { question: string|null, submitAnswer: string|null, timestamp: number }>) => void) {
    chrome.storage.local.get("sparxData", (result) => {
        const sparxData: Record<string, { question: string|null, submitAnswer: string|null, timestamp: number }> = result.sparxData ?? {};
        if (sparxData[id]) {
            sparxData[id].question = data.question ?? sparxData[id].question ?? null
            sparxData[id].submitAnswer = data.submitAnswer ?? sparxData[id].submitAnswer ?? null
            sparxData[id].timestamp = Date.now()
        }
        else {
            sparxData[id] = {...data, timestamp: Date.now()}
        }

        chrome.storage.local.set({ sparxData }, () => {
            callback(sparxData)
        });
    })
}

export function getSparxData(callback: (data: Record<string, { question: string|null, submitAnswer: string|null, timestamp: number }>) => void) {
    chrome.storage.local.get("sparxData", (result) => {
        callback(result.sparxData ?? {})
    })
}