export function classContains(containedString: string, containerElement: Element|Document|null = document) {
    return (containerElement??document).querySelector("[class*=" + containedString + "]") ?? null
}
export function classContainsAll(containedString: string, containerElement: Element|Document|null = document) {
    return (containerElement??document).querySelectorAll("[class*=" + containedString + "]") ?? null
}
export function removeElements(elements: Element[]|ChildNode[]) {
    for (const element of elements) {
        element.remove()
    }
}
export function onPageChange(callback: Function) {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if (request.message === 'urlChange') {
            callback()
            //new URL(request.url).pathname
          }
    });
}
export function functionMapping(mapping: Record<string, Function[]>) {
    onPageChange(() => {
        const path = window.location.pathname;
        for (const [pattern, functions] of Object.entries(mapping)) {
            const regexPattern = pattern.replace(/\*/g, '.*').replace(/\/\//g, '/');
            if (new RegExp(`^${regexPattern}$`).test(path)) {
                functions.forEach(fn => fn());
            }
        }
    });
}
export function injectCss(css: string) {
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
}
export function easingFunction(callback: Function, duration = 0.5, step = 0.1) {
    let counter = 0
    const easingInterval = setInterval(() => {
        if (counter >= duration) {
            clearInterval(easingInterval)
        }
        counter += step
        callback()
    }, step*1000)
}