import { ifSettingTrue } from "../../settings/settings"
import { LuSparkles } from "../../utils/icons"
import { removeElements } from "../../utils/utils"
import { toggleChatbot } from "./chatbot"

function addChatbotButton() {
    const container = document.querySelector("#quiz-top .column .bg-purple-80")?.parentElement
    const chatbotButtonExists = container?.querySelector(".task-tackler-educake-chatbot-button")
    if (container && LuSparkles && !chatbotButtonExists) {
        const chatbotButton = document.createElement("div")
        chatbotButton.classList.add("task-tackler-educake-chatbot-button", "btn", "bg-purple-80", "bg-purple-hover", "ml-2", "lh-close", "mb-2", "mb-sm-0", "r-bg-light", "r-bg-light-hover", "r-text-dark", "align-self-start")

        const chatbotButtonText = document.createElement("span")
        chatbotButtonText.textContent = "Chatbot"

        chatbotButton.addEventListener("click", () => {
            toggleChatbot()
        })

        //chatbotButton.appendChild(LuSparkles)
        chatbotButton.appendChild(chatbotButtonText)
        container.appendChild(chatbotButton)
    }
}

function removeFooter() {
    const footer = document.querySelector(".bg-white.footer-container")
    if (footer) {
        removeElements([footer])
    }
}

export function cleanQuizScreen() {
    ifSettingTrue("educakeAddChatbot", addChatbotButton)
    ifSettingTrue("educakeAddAutoComplete", removeFooter)
}