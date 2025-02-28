import { easingFunction, functionMapping } from "../utils/utils";
import { cleanQuizScreen } from "./domChanges/quiz";
import { cleanQuizStartScreen } from "./domChanges/quizStartScreen";

console.log("WOAH")

function main() {
    const mapping = {
        "/my-educake/quiz/*": [ cleanQuizStartScreen, cleanQuizScreen ],
    }
    functionMapping(mapping)
    easingFunction(() => {
        console.log("KHIUHLUIKHBKULGHBKULGBKYUGBKVU")
        const path = window.location.pathname;
        for (const [pattern, functions] of Object.entries(mapping)) {
            const regexPattern = pattern.replace(/\*/g, '.*').replace(/\/\//g, '/');
            if (new RegExp(`^${regexPattern}$`).test(path)) {
                functions.forEach(fn => fn());
            }
        }
    }, 1.5, 0.1)
}

main()