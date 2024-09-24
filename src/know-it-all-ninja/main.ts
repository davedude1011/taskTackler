import { easingFunction, functionMapping } from "../utils/utils";
import { cleanQuizScreen } from "./domChanges/cleanQuizScreen";
import { injectButton } from "./domChanges/skipLessons";

console.log("WOAH")

function main() {
    const mapping = {
        "/dashboard/quizzes/*": [ cleanQuizScreen ],
        "/dashboard/lessons/*": [ injectButton ]
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