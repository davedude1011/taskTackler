import { sendMessage } from "../utils/communication";

function todaysDateCounter() {
    const currentDate = new Date();
    const unixEpoch = new Date('1970-01-01');
    const timeDifference = currentDate.getTime() - unixEpoch.getTime();
    const daysSinceEpoch = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysSinceEpoch
}

async function fetchIsSubscribed(): Promise<boolean> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["stripeId"], async function(result) {
            const stripeId: string = result.stripeId ?? "";

            if (stripeId) {
                try {
                    const response = await fetch('https://www.task-tackler.com/api/is-subscribed', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: JSON.stringify(stripeId),
                    });
                    
                    const data = await response.json();
                    resolve(data.isSubscribed);
                } catch (error) {
                    console.error('Error:', error);
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    });
}

export async function getLocalSubscriptionCheck(forceDatabaseRecheck = false): Promise<boolean> {
    const useDateLimit = true;

    return new Promise((resolve) => {
        chrome.storage.sync.get(["localSubscriptionData"], async function(result) {
            const subcriptionData = result["localSubscriptionData"] as {
                isSubscribed: boolean,
                lastCheckDate: number
            };

            if ((useDateLimit && !forceDatabaseRecheck) && subcriptionData?.lastCheckDate >= todaysDateCounter()) {
                // If the date limit is valid, resolve with the local data.
                resolve(subcriptionData.isSubscribed);
            } else {
                // Fetch the subscription data if needed.
                const isSubscribed = await fetchIsSubscribed();
                console.log(isSubscribed);

                // Update the local storage with the new subscription data.
                chrome.storage.sync.set({
                    localSubscriptionData: {
                        isSubscribed: isSubscribed,
                        lastCheckDate: todaysDateCounter(),
                    }
                }, function() {
                    // Resolve with the updated subscription status.
                    resolve(isSubscribed);
                });
            }
        });
    });
}

export function runOnSubscription(callback: Function) {
    getLocalSubscriptionCheck()
        .then((isSubscribed) => {
            console.log(isSubscribed)
            if (isSubscribed) {
                callback()
            }
        })
}

export function setStripeId(stripeId: string) {
    chrome.storage.sync.set({ stripeId: stripeId }, function() {
        console.log("Set stripeId")
    })
}

export function clearStripeId() {
    chrome.storage.sync.remove("stripeId", () => {
        sendMessage("reloadPage", "true")
    })
}