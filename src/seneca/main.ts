import { easingFunction, functionMapping } from "../utils/utils";
import { inputFillerLoop } from "./domChanges/inputFiller";

console.log("WOAH")

function main() {
    const mapping = {
        "/*": [ inputFillerLoop ],
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