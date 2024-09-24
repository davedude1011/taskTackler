import { classContains, classContainsAll, easingFunction, removeElements } from "../../utils/utils";
import { fetchAnswer } from "../fetch/fetch";
import { getPageData } from "../getData/getData";

function revealAllQuestions() {
    const allQuestions = classContainsAll("wpProQuiz_listItem")
    for (const questionElement of allQuestions) {
        //(questionElement as HTMLElement).style.display = "block";
        (questionElement as HTMLElement).id = JSON.parse((questionElement as HTMLElement).getAttribute("data-question-meta")??"{}").question_pro_id;

        (questionElement as HTMLElement).style.marginBottom = "1.5rem";
        (classContains("kian-quiz-question-content", questionElement) as HTMLElement).style.marginBottom = "0px";
    }
}
function handleButtons() {
    const buttons = classContainsAll("wpProQuiz_button")
    for (const buttonElement of buttons) {
        //// @ts-expect-error
        //if (buttonElement.textContent == "Next Question" || buttonElement.value == "Next Question" || buttonElement.textContent == "Check" || buttonElement.value == "Check") {
        //    const buttonForRemoval = buttonElement?.parentElement
        //    if (buttonForRemoval) {
        //        removeElements([buttonForRemoval])
        //    }
        //}
        // @ts-expect-error
        if (buttonElement.textContent == "Previous Question" || buttonElement.value == "Previous Question") {
            const parent = buttonElement?.parentElement
            removeElements([buttonElement])
            if (parent) {
                const newButton = document.createElement("button")
                newButton.classList.add("wpProQuiz_button", "wpProQuiz_QuestionButton")
                newButton.textContent = "Auto-fill"
                newButton.style.border = "2px solid !important"
                newButton.style.background = "transparent !important"
                newButton.style.color = "#398ffc !important"

                newButton.addEventListener("click", (e) => {
                    const thisButton = e.currentTarget as HTMLElement
                    if (thisButton) {
                        const dataParent = thisButton.parentElement?.parentElement?.parentElement
                        const data = JSON.parse(dataParent?.getAttribute("data-question-meta")??"{}") as {question_pro_id: number, question_post_id: number}
                        e.preventDefault()
                        e.stopPropagation()
                        e.stopImmediatePropagation()
                        autoFillAnswer({
                            proId: data.question_pro_id,
                            postId: data.question_post_id
                        })
                    }
                })

                parent.appendChild(newButton)
            }
        }
    }
}

function autoFillAnswer(questionData: {proId: number, postId: number}) {
    const pageData = getPageData()
    if (pageData) {
        console.log(questionData)
        console.log(pageData)
        fetchAnswer({
            quizId: pageData?.quizId,
            quiz: pageData?.quiz,
            quizNonce: pageData?.quizNonce,
            proId: questionData.proId,
            postId: questionData.postId
        })
            .then((response) => {
                console.log(response)
                if (response) {
                    const responseData = response[Object.keys(response)[0]]
                    const answerData = responseData["e"]["c"]
                    const answerType = responseData["e"]["type"]

                    console.log(answerData, answerType)
                    setAnswer({
                        proId: questionData.proId,
                        answerType: answerType,
                        answer: answerData
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

function setAnswer(answerData: {
    proId: number,
    answerType: "single"|"multiple"|"cloze_answer",
    answer: [0|1]|[string[]]
}) {
    const answerContainer = document.getElementById(String(answerData.proId))

    if (answerData.answerType == "single" || answerData.answerType == "multiple") {
        const multipleChoiceElements = classContainsAll("wpProQuiz_questionInput", answerContainer)
        for (let i = 0; i < answerData.answer.length; i++) {
            if (answerData.answer[i] == 1) {
                (multipleChoiceElements[i] as HTMLElement).click()
            }
        }
    }
    else if (answerData.answerType == "cloze_answer") {
        const multipleChoiceElements = answerContainer?.querySelectorAll(".wpProQuiz_cloze input")
        if (multipleChoiceElements) {
            for (let i = 0; i < answerData.answer.length; i++) {
                // @ts-expect-error
                (multipleChoiceElements[i] as HTMLInputElement).value = String(answerData.answer[i][0])
            }
        }
    }
}

function mainClean() {
    revealAllQuestions()
    handleButtons()
}

export function cleanQuizScreen() {
    let buttonFound = false

    const buttons = classContainsAll("wpProQuiz_button")
    for (const buttonElement of buttons) {
        // @ts-expect-error
        if (buttonElement.textContent == "Start Quiz" || buttonElement.value == "Start Quiz") {
            buttonElement.addEventListener("click", mainClean)
            buttonFound = true
        }
    }

    if (!buttonFound) {
        mainClean()
    }
}