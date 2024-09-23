import { getSparxData } from "../../storage/sparxData";
import { classContains, easingFunction, removeElements } from "../../utils/utils";
import { getCurrentQuestionId } from "./solution";

function fillBookworkCheck() {
    const questionId = getCurrentQuestionId(true)

    getSparxData((data) => {
        const currentQuestionData = data[questionId]

        const subtitleElement = classContains("_Subtitle_") as HTMLElement
        if (subtitleElement) {
            subtitleElement.innerHTML = currentQuestionData?.submitAnswer ?? "Bookwork Not Found :("
        }

        const calculatorContainer = classContains("_VerticalSwipeEntryExit_")
        if (calculatorContainer) removeElements([calculatorContainer])
    })
}

function changeButton() {
    const didntWriteButton = document.querySelector("._Buttons_1cxo7_43 ._ButtonBase_nt2r3_1 ._Content_nt2r3_194")
    if (didntWriteButton) {
        didntWriteButton.textContent = "Refresh Auto Bookmark"
        didntWriteButton.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()
            fillBookworkCheck()
        })
    }
}

export function cleanBookworkCheck() {
    easingFunction(() => {
        fillBookworkCheck()
        changeButton()
    }, 2, 0.5)
}