import { getSettings, setFullSettings, setSetting } from "../settings/settings";
import { onRecieveMessage, sendMessage } from "../utils/communication";

function settingsDataSending() {
    getSettings()
        .then((settings) => {
            sendMessage("settingsValues", JSON.stringify(settings))
        })
}

function settingsListener() {
    onRecieveMessage("settingsUpdate", (message: string) => {
        const updateData: { settingsKey: string, newSettingsValue: boolean } = JSON.parse(message)
        if (updateData) {
            // @ts-expect-error
            sendMessage("logThis", updateData)
            setSetting(updateData.settingsKey, updateData.newSettingsValue, () => { settingsDataSending() })
        }
    })
}

export function handleDashboardSettings() {
    settingsDataSending()
    settingsListener()
    onRecieveMessage("setFullSettings", (message) => {
        const fullSettings: Record<string, boolean> = JSON.parse(message)
        setFullSettings(fullSettings)
        settingsDataSending()
    })
}