export function sendMessage(id: string, message: string) {
    window.postMessage(
        {
          type: "task_tackler_" + id,
          text: message,
        },
        "*",
    );
}
export function onRecieveMessage(id: string, callback: (message: string) => void) {
    window.addEventListener("message", (event) => {
        if (event.source != window) return;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (event.data.type && event.data.type == "task_tackler_" + id) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            callback(event.data.text as string)
        }
    });
}