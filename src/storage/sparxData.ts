function removeRedundantData(data: Record<string, { question: string|null, submitAnswer: string|null, timestamp: number }>): Record<string, { question: string|null, submitAnswer: string|null, timestamp: number }> {
    const dataEntries = Object.entries(data);
    
    if (dataEntries.length > 60) {
        // Sort data based on timestamp in descending order to keep the most recent entries
        const sortedData = dataEntries.sort(([, a], [, b]) => b.timestamp - a.timestamp);
        const cleanData = sortedData.slice(0, 55).reduce((acc, [id, dataItem]) => {
            acc[id] = dataItem;
            return acc;
        }, {} as Record<string, { question: string|null, submitAnswer: string|null, timestamp: number }>);

        return cleanData;
    }
    
    // Return original data if less than or equal to 60 entries
    return data;
}

export function saveSparxData(data: { question: string|null, submitAnswer: string|null, timestamp?: number }, id: string, callback: (newData: Record<string, { question: string|null, submitAnswer: string|null, timestamp: number }>) => void) {
    chrome.storage.local.get("sparxData", (result) => {
        let sparxData: Record<string, { question: string|null, submitAnswer: string|null, timestamp: number }> = result.sparxData ?? {};

        try {
            sparxData = removeRedundantData(sparxData)
        }
        catch {
            console.error("Error while removing redundant data from sparxData")
            console.log(sparxData)
        }

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