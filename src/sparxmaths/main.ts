import { easingFunction, functionMapping } from "../utils/utils"
import { cleanHomescreen } from "./domChanges/homeScreen"
import { cleanQuestionScreen } from "./domChanges/questionScreen"

console.log("WOAH")

function main() {
    const mapping = {
        "/student/homework/": [ cleanHomescreen ],
        "/student/package/*/task/*/item/*": [ cleanQuestionScreen ]
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