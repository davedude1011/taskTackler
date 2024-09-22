import { addSessionHistory, callbackResponse, clearSessionHistory, getSessionHistory, setSessionHistory } from "../../storage/chatbot"
import { classContains, removeElements } from "../../utils/utils"

function setChatDataElements(isGlobal = false) {
    getSessionHistory(isGlobal)
        // @ts-expect-error
        .then((chatData: { role: "user" | "model", parts: { text: string }[] }[]) => {
            const chatbotBody = document.querySelector(".task-tackler-chatbot-chatbody")
            if (chatbotBody) {
                chatbotBody.innerHTML = ""
                const chatDataElements = chatData.map((data) => {
                    const chatDataElement = document.createElement("div")
                    chatDataElement.style.textAlign = (data.role == "user" ? "right" : "left")
                    chatDataElement.textContent = data.parts[0].text
                    return chatDataElement
                })
                for (const chatDataElement of chatDataElements) {
                    chatbotBody.appendChild(chatDataElement)
                }
            }
        })
}

function ChatbotElement() {
    // for the session selection buttons
    const selectedClass = "bg-purple-50"
    const unselectedClass = "task-tackler-sparx-local-session-button-unselected"

    function isGlobal() {
        return document.querySelector(".task-tackler-educake-global-session-button")?.classList.contains(selectedClass)
    }

    const chatbotShell = document.createElement("div")
    chatbotShell.classList.add("task-tackler-chatbot-page-educake", "question-container", "p-3", "p-lg-4")
    chatbotShell.setAttribute("data-v-7930d7f7", "1")
    chatbotShell.style.display = "flex"
    chatbotShell.style.flexDirection = "column"
    chatbotShell.style.gap = "12px"
    chatbotShell.style.padding = "12px"
    chatbotShell.style.overflow = "auto"
    chatbotShell.style.resize = "horizontal"
    chatbotShell.style.width = "500px"
    chatbotShell.style.borderRadius = "4px"

    function sessionSelectionElement() {
        let selectedSession = "local" as "local"|"global"

        const sessionSelectionOuter = document.createElement("div")
        sessionSelectionOuter.style.display = "flex"
        sessionSelectionOuter.style.flexDirection = "row"
        sessionSelectionOuter.style.gap = "12px"

        function setSessionVisuals(sessionType: "local"|"global") {
            if (sessionType == "local") {
                document.querySelector(".task-tackler-educake-local-session-button")?.classList.add(selectedClass)
                document.querySelector(".task-tackler-educake-local-session-button")?.classList.remove(unselectedClass)
                document.querySelector(".task-tackler-educake-global-session-button")?.classList.add(unselectedClass)
                document.querySelector(".task-tackler-educake-global-session-button")?.classList.remove(selectedClass)
                setChatDataElements(false)
            }
            else {
                document.querySelector(".task-tackler-educake-local-session-button")?.classList.add(unselectedClass)
                document.querySelector(".task-tackler-educake-local-session-button")?.classList.remove(selectedClass)
                document.querySelector(".task-tackler-educake-global-session-button")?.classList.add(selectedClass)
                document.querySelector(".task-tackler-educake-global-session-button")?.classList.remove(unselectedClass)
                setChatDataElements(true)
            }
        }
    
        const localSessionSelectionButton = document.createElement("button")
        localSessionSelectionButton.textContent = "Educake"
        localSessionSelectionButton.style.width = "100%"
        localSessionSelectionButton.classList.add("task-tackler-educake-local-session-button", "btn", selectedSession == "local" ? selectedClass : unselectedClass)
        localSessionSelectionButton.addEventListener("click", () => {
            selectedSession = "local"
            setSessionVisuals("local")
        })
    
        const globalSessionSelectionButton = document.createElement("button")
        globalSessionSelectionButton.textContent = "Global"
        globalSessionSelectionButton.style.width = "100%"
        globalSessionSelectionButton.classList.add("task-tackler-educake-global-session-button", "btn", selectedSession == "global" ? selectedClass : unselectedClass)
        globalSessionSelectionButton.addEventListener("click", () => {
            selectedSession = "global"
            setSessionVisuals("global")
        })
    
        sessionSelectionOuter.appendChild(localSessionSelectionButton)
        sessionSelectionOuter.appendChild(globalSessionSelectionButton)

        return sessionSelectionOuter
    }
    function chatbotBodyElement() {
        const chatbotBody = document.createElement("div")
        chatbotBody.style.display = "flex"
        chatbotBody.style.flexGrow = "1"
        chatbotBody.style.flexDirection = "column"
        chatbotBody.style.gap = "12px"
        chatbotBody.style.padding = "12px"
        chatbotBody.style.overflow = "auto"
        chatbotBody.style.borderRadius = "4px"
        chatbotBody.classList.add("task-tackler-chatbot-chatbody", "r-bg-cream", "bg-textbox-grey")

        return chatbotBody
    }
    function chatbotFooterElement() {
        function send() {
            const inputValue = (document.querySelector(".task-tackler-chatbot-input") as HTMLInputElement | undefined)?.value
            if (inputValue) {
                addSessionHistory([{ role: "user", parts: [{ text: inputValue }] }], isGlobal(), () => {
                    setChatDataElements(isGlobal())
                })
                callbackResponse(inputValue, isGlobal(), (result) => {
                    setSessionHistory(result.history, isGlobal(), () => {
                        setChatDataElements(isGlobal())
                    })
                })
            }
            const input = document.querySelector(".task-tackler-chatbot-input") as HTMLInputElement | undefined
            if (input) input.value = ""
        }

        const chatbotFooter = document.createElement("div")
        chatbotFooter.style.display = "flex"
        chatbotFooter.style.flexDirection = "row"
        chatbotFooter.style.gap = "12px"
        chatbotFooter.style.padding = "12px"

        const inputField = document.createElement("input")
        inputField.type = "text"
        inputField.placeholder = "Whats your question..."
        inputField.classList.add("task-tackler-chatbot-input", "_Search_bay8e_90", "_FocusTarget_1nxry_1")
        inputField.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent the default action (like form submission)
                event.stopImmediatePropagation();
                send()
            }
        });

        const clearButton = document.createElement("button")
        clearButton.textContent = "Clear"
        clearButton.style.cursor = "pointer"
        clearButton.classList.add("btn")
        clearButton.addEventListener("click", () => {
            clearSessionHistory(isGlobal(), () => {
                setChatDataElements(isGlobal())
            })
        })

        const sendButton = document.createElement("button")
        sendButton.textContent = "Send"
        sendButton.style.cursor = "pointer"
        sendButton.classList.add("btn")
        sendButton.addEventListener("click", send)

        chatbotFooter.appendChild(clearButton)
        chatbotFooter.appendChild(inputField)
        chatbotFooter.appendChild(sendButton)

        return chatbotFooter
    }

    chatbotShell.appendChild(sessionSelectionElement())
    chatbotShell.appendChild(chatbotBodyElement())
    chatbotShell.appendChild(chatbotFooterElement())

    setTimeout(setChatDataElements, 100)

    return chatbotShell
}

export function toggleChatbot() {
    const questionContainer = document.querySelector(".content-container")
    const chatbotPage = classContains("task-tackler-chatbot-page-educake", questionContainer)
    if (chatbotPage) {
        chatbotPage.remove()
    }
    else {
        (questionContainer as HTMLElement).style.display = "flex";
        (questionContainer as HTMLElement).style.gap = "12px";
        (questionContainer as HTMLElement).style.padding = "12px";
        (questionContainer as HTMLElement).style.flexDirection = "row";
        (questionContainer as HTMLElement).style.height = `calc(100vh - ${(document.querySelector(".bg-purple.header-container") as HTMLElement)?.offsetHeight ?? "20"}px)`;
        (questionContainer as HTMLElement).style.minHeight = `calc(100vh - ${(document.querySelector(".bg-purple.header-container") as HTMLElement)?.offsetHeight ?? "20"}px)`;
        questionContainer?.insertBefore(ChatbotElement(), questionContainer?.firstChild)
    }
}