import { classContains, classContainsAll, easingFunction, removeElements } from "../../utils/utils";
import { getQuizData, loopAnswerQuestions } from "../fetching/fetches";
import { getJwtToken } from "../fetching/sessionData";
import { cleanQuizScreen } from "./quiz";

function insertAutoCompleteButton() {
    const buttonAlreadyExists = document.querySelector(".task-tackler-auto-complete-quiz-button")
    if (!buttonAlreadyExists) {
        const beginQuizButton = classContainsAll("large-arrow-right")[1]
        const quizButtonsContainer = beginQuizButton?.parentElement
        if (quizButtonsContainer) {
            quizButtonsContainer.style.display = "flex"
            quizButtonsContainer.style.gap = "6px"
            quizButtonsContainer.style.justifyContent = "end"
        
            const autoCompleteQuizButton = document.createElement("button")
            autoCompleteQuizButton.textContent = "Auto Complete Quiz"
            autoCompleteQuizButton.classList.add("lgr-2", "btn", "thb-0", "mvb-7", "mvb-1", "cdx-2", "task-tackler-auto-complete-quiz-button")

            autoCompleteQuizButton.addEventListener("click", () => {
                loopAnswerQuestions()
                    .catch((error) => console.log(error))
            })
        
            quizButtonsContainer?.insertBefore(autoCompleteQuizButton, beginQuizButton)
        }
    }
}

function insertCard() {
    const cardAlreadyExists = document.querySelector(".task-tackler-card")
    if (!cardAlreadyExists) {
        const cardContainer = document.querySelector(".bg-purple.header-container")?.firstElementChild?.lastElementChild
        if (cardContainer) {
            const newCardSpan = document.createElement("span")
            newCardSpan.classList.add("mr-2", "task-tackler-card")
    
            const newCardLink = document.createElement("a")
            newCardLink.href = "https://www.task-tackler.com/dashboard"
            newCardLink.classList.add("header-link")
            newCardLink.textContent = "Task-Tackler"
            newCardLink.setAttribute("data-v-367f2ab0", "")
    
            newCardSpan.appendChild(newCardLink)
    
            cardContainer.insertBefore(newCardSpan, cardContainer.firstChild)
        }
    }
}

export function prepareStartScreenFroAutoCompletion() {
    const randomElement = document.querySelector(".text-purple")?.nextElementSibling?.nextElementSibling
    if (randomElement) { removeElements([randomElement]) }

    const randomElement2 = document.querySelector(".text-purple")?.nextElementSibling?.nextElementSibling?.nextElementSibling
    if (randomElement2) { removeElements([randomElement2]) }

    const beginQuizButton = document.querySelectorAll(".large-arrow-right:not(.task-tackler-auto-complete-quiz-button)")[1]
    if (beginQuizButton) { removeElements([beginQuizButton]) }
}
export function setAutoCompletionQuestion(question: string) {
    const titleElement = document.querySelector(".text-purple")
    if (titleElement) {
        titleElement.textContent = question
    }
}
export function setAutoCompletionAnswer(answer: string) {
    const answerElement = document.querySelector(".text-purple")?.nextElementSibling
    if (answerElement) {
        answerElement.textContent = answer
    }
}

function beginButtonEvent() {
    const beginQuizButton = document.querySelectorAll(".large-arrow-right:not(.task-tackler-auto-complete-quiz-button)")[1]
    if (beginQuizButton) {
        beginQuizButton.addEventListener("click", () => {
            easingFunction(() => {
                console.log("hi there")
                cleanQuizScreen()
            }, 1, 0.2)
        })
    }
}

export function cleanQuizStartScreen() {
    insertAutoCompleteButton()
    insertCard()
    beginButtonEvent()
}