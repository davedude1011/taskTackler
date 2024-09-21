import { classContains } from "../../utils/utils"

export function toggleDesmos() {
    const questionContainer = classContains("_Activity_")
    const desmosPage = classContains("task-tackler-desmos-page", questionContainer)
    if (desmosPage) {
        if (desmosPage.classList.contains("task-tackler-desmos-page-active")) {
            (desmosPage as HTMLElement).style.display = "none";
        }
        else {
            (desmosPage as HTMLElement).style.display = "flex";
        }
        desmosPage.classList.toggle("task-tackler-desmos-page-active")
    }
    else {
        (questionContainer as HTMLElement).style.gap = "12px";
        (questionContainer as HTMLElement).style.paddingLeft = "12px";
        (questionContainer as HTMLElement).style.paddingRight = "12px";
        (questionContainer as HTMLElement).style.flexDirection = "row";

        const desmosShell = document.createElement("div")
        desmosShell.classList.add("task-tackler-desmos-page", "_QuestionContainer_1nj91_1", "task-tackler-desmos-page-active")
        desmosShell.style.width = "fit-content"
        desmosShell.style.padding = "12px"
        desmosShell.style.minWidth = "350px"

        const desmosIframe = document.createElement("iframe")
        desmosIframe.src = "https://www.desmos.com/scientific"
        desmosIframe.style.height = "100%"
        desmosIframe.style.borderRadius = "6px"

        desmosShell.appendChild(desmosIframe)
        questionContainer?.appendChild(desmosShell)
    }
}