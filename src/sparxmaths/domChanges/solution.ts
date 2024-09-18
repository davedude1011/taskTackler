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
    question = removeBracketedContent(question)

    for (const data of (gauthData as {id: string, question: string, answer: string}[])) {
        if (data.question.includes(question) || question.includes(data.question)) {
            return data.answer
        }
    }
    return ""
}

export function getCurrentQuestionId(): string {
    const homeworkId = window.location.pathname.split("/")[3] ?? ""
    const bookworkCode = (classContains("_Chip_bu06u_1")?.textContent ?? "").replace("Bookwork code: ", "") ?? ""
    return homeworkId + bookworkCode
}

export function toggleSolution() {
    const questionId = getCurrentQuestionId()

    const localData: Record<string, {question: string, answer: string, submitAnswer: string}> = JSON.parse(localStorage.getItem("localData")??"{}")
    if (!localData[questionId]) {
        localData[questionId] = {
            question: getQuestion(),
            answer: getSolutionString(),
            submitAnswer: "incomplete"
        }
    }
    localStorage.setItem("localData", JSON.stringify(localData))

    const questionElement = classContains("_QuestionWrapper_")
    if (questionElement?.classList.contains("task-tackler-sparx-solution")) {
        questionElement.innerHTML = localData[questionId].question
        const solutionButton = document.querySelector(".solution-question-button")
        if (solutionButton) { solutionButton.textContent = "Solution" }
    }
    else if (questionElement) {
        questionElement.innerHTML = localData[questionId].answer
        const solutionButton = document.querySelector(".solution-question-button")
        if (solutionButton) { solutionButton.textContent = "Question" }
    }
    questionElement?.classList.toggle("task-tackler-sparx-solution")

    console.log(getCurrentQuestionId())
}