import { getSparxData, saveSparxData } from "../../storage/sparxData";
import { classContains } from "../../utils/utils";
import gauthData from "../data/gauthData.json"

export function getQuestion() {
    const questionElement = classContains("_QuestionWrapper_")
    return questionElement?.innerHTML ?? ""
}

function removeBracketedContent(questionData: string) {
    let output = [];
    let insideBrackets = false;

    for (let char of questionData) {
        if (char === '<') {
            insideBrackets = true;
        } else if (char === '>') {
            insideBrackets = false;
        } else if (!insideBrackets) {
            output.push(char);
        }
    }

    return output.join('').replace(/&ZeroWidthSpace;/g, "").replace("\n    To pick up a draggable item, press the space bar.\n    While dragging, use the arrow keys to move the item.\n    Press space again to drop the item in its new position, or press escape to cancel.\n  ", "")
}

export function getSolutionString(question = getQuestion()) {
    const newQuestion = removeBracketedContent(question)

    for (const data of (gauthData as {id: string, question: string, answer: string}[])) {
        if (data.question.includes(newQuestion) || newQuestion.includes(data.question)) {
            return data.answer
        }
    }
    return ""
}

export function getCurrentQuestionId(isBookworkCheck = false): string {
    const homeworkId = window.location.pathname.split("/")[3] ?? ""
    const bookworkCode = (
        isBookworkCheck ?
            (classContains("_Chip_")?.textContent ?? "").replace("Bookwork ", "") ?? "" : // bookwork check
            (classContains("_Chip_")?.textContent ?? "").replace("Bookwork code: ", "") ?? ""  // normal question
    )
    return homeworkId + bookworkCode
}

export function toggleSolution() {
    const questionId = getCurrentQuestionId()

    const questionElement = classContains("_QuestionWrapper_")
    if (questionElement?.classList.contains("task-tackler-sparx-solution")) {
        getSparxData((data) => {
            questionElement.innerHTML = data[questionId].question ?? "DATA NOT FOUND 1"
            const solutionButton = document.querySelector(".solution-question-button")
            if (solutionButton) { solutionButton.textContent = "Solution" }
                    
            questionElement.classList.remove("task-tackler-sparx-solution")
        })
    }
    else {
        saveSparxData(
            {
                question: getQuestion(),
                submitAnswer: null
            },
            questionId,
            (newData) => {
                const questionElement = classContains("_QuestionWrapper_")
                if (questionElement) {
                    questionElement.innerHTML = getSolutionString(newData[questionId].question??"") ?? "DATA NOT FOUND 2"
                    const solutionButton = document.querySelector(".solution-question-button")
                    if (solutionButton) { solutionButton.textContent = "Question" }

                    questionElement.classList.add("task-tackler-sparx-solution")
                }
            }
        )
    }
}