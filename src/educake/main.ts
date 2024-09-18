import { easingFunction, functionMapping } from "../utils/utils";
import { cleanQuizStartScreen } from "./domChanges/quizStartScreen";

console.log("WOAH")

function main() {
    const mapping = {
        "/my-educake/quiz/*": [ cleanQuizStartScreen ],
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
    }, 1, 0.05)
}

main()