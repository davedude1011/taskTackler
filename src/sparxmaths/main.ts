import { easingFunction, functionMapping } from "../utils/utils"
import { cleanBookworkCheck } from "./domChanges/bookworkCheck"
import { cleanHomescreen } from "./domChanges/homeScreen"
import { cleanQuestionScreen } from "./domChanges/questionScreen"
import { makeTextCopyable } from "./domChanges/textCopyInject"

console.log("WOAH")

function main() {
    const mapping = {
        "/student/homework/": [ cleanHomescreen, makeTextCopyable ],
        "/student/package/*/task/*/item/*": [ cleanQuestionScreen, makeTextCopyable ],
        "/student/package/*/task/*/item/*/wac": [ cleanBookworkCheck, makeTextCopyable ],
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