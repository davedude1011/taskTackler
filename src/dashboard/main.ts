import { getLocalSubscriptionCheck, setStripeId } from "../storage/subscription";
import { onRecieveMessage, sendMessage } from "../utils/communication";
import { easingFunction, functionMapping } from "../utils/utils";
import { sparxDashboard } from "./sparx";

function stripeConnection() {
    chrome.storage.sync.get(["stripeId"], function(result) {
        const stripeId = result["stripeId"] as string
        if (stripeId) {
            easingFunction(() => {
                sendMessage("chromeExtensionSynced", "true")
            }, 1, 0.1)
        }
        else {
            onRecieveMessage("stripeId", (stripeId) => {
                setStripeId(stripeId)
                sendMessage("chromeExtensionSynced", "true")
            })
        }
    })
    onRecieveMessage("refreshSubscriptionData", (_) => {
        getLocalSubscriptionCheck(true)
    })
}

function main() {
    const mapping = {
        "/dashboard": [ stripeConnection ],
        "/dashboard/sparx": [ sparxDashboard ]
    }
    functionMapping(mapping)
    easingFunction(() => {
        const path = window.location.pathname;
        for (const [pattern, functions] of Object.entries(mapping)) {
            const regexPattern = pattern.replace(/\*/g, '.*').replace(/\/\//g, '/');
            if (new RegExp(`^${regexPattern}$`).test(path)) {
                functions.forEach(fn => fn());
            }
        }
    })
}

main()