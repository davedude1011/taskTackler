import { sendMessage } from "../utils/communication";
import { easingFunction } from "../utils/utils";

export function sparxDashboard() {
    chrome.storage.local.get("sparxData", (result) => {
        const sparxData = result.sparxData ?? {};
        easingFunction(() => {
            sendMessage("sparxData", JSON.stringify(sparxData))
        }, 0.5, 0.05)
    })
}