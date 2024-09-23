export async function getSettings() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get("settings", (results) => {
            const settings = results.settings
            if (settings) resolve(settings)
            else reject("Settings not found")
        })
    })
}

export function ifSettingTrue(settingKey: string, callback: () => void) {
    getSettings()
        .then((settings) => {
            if (((settings as Record<string, boolean>)??{})[settingKey] != false) callback()
        })
        .catch((error) => {
            callback()
            console.log(error)
        })
}

export function setSetting(settingKey: string, setValue: boolean, callback?: () => void) {
    getSettings()
        .then((settings) => {
            ((settings as Record<string, boolean>)??{})[settingKey] = setValue
            chrome.storage.sync.set({ settings: settings }, callback)
        })
        .catch((error) => console.log(error))
}

export function setFullSettings(settingsData: Record<string, boolean>, callback?: () => void) {
    chrome.storage.sync.set({ settings: settingsData }, callback)
}



const exampleData = {
    sparxSaveBookworks: true,
    sparxInjectBookworks: true,
    sparxAddChatbot: true,
    sparxAddDesmos: true,
    sparxAddSolution: true,
    sparxCleanHomescreen: true,

    educakeAddChatbot: true,
    educakeAddAutoComplete: true,

    senecaAddInputFilling: true
}
