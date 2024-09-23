import { ifSettingTrue } from "../../settings/settings";
import { saveSparxData } from "../../storage/sparxData";
import { runOnSubscription } from "../../storage/subscription";
import { LuCalculator, LuSparkles } from "../../utils/icons";
import { classContains, easingFunction, injectCss, removeElements } from "../../utils/utils";
import { toggleChatbot } from "./chatbot";
import { toggleDesmos } from "./desmos";
import { getCurrentQuestionId, getQuestion, getSolutionString, toggleSolution } from "./solution";

function cleanHeader() {
    injectCss(`[class*="_CalculatorInfoContainer_"] { display: none }`)
    const calculatorInfoContainer = classContains("_CalculatorInfoContainer_")
    if (calculatorInfoContainer) {
        removeElements([calculatorInfoContainer])
    }
}

function cleanNewBanner() {
    injectCss(`[class*="_BannerContainer_"] { display: none }`)
    const bannerElement = classContains("_BannerContainer_")
    if (bannerElement) {//?.textContent?.includes("Multi Part Question")
        removeElements([bannerElement])
    }
}

function createQuestionFooterButton(varient: "primary"|"outline", customClass: string, onclick?: (event: MouseEvent) => void, text?: string, icon?: ChildNode|Element|null) {
    const buttonElement = document.createElement("button")
    buttonElement.classList.add(customClass)
    const buttonClasses = {
        "primary": ["_ButtonBase_nt2r3_1", "_FocusTarget_1nxry_1", "_ButtonMd_nt2r3_35", "_ButtonBlue_nt2r3_76", "_ButtonContained_nt2r3_111"],
        "outline": ["_ButtonBase_nt2r3_1", "_FocusTarget_1nxry_1", "_ButtonMd_nt2r3_35", "_ButtonBlue_nt2r3_76", "_ButtonOutlined_nt2r3_129"],
    }[varient]
    buttonElement.classList.add(...buttonClasses)
    
    if (onclick) {
        buttonElement.addEventListener("click", onclick)
    }

    if (icon) {
        const iconContainer = document.createElement("div")
        iconContainer.classList.add("_HiddenAt_gk0gx_1", "_Xs_gk0gx_2", "_LeftIcon_nt2r3_57")
        iconContainer.appendChild(icon)
        buttonElement.appendChild(iconContainer)
    }

    if (text) {
        const textElement = document.createElement("div")
        textElement.classList.add("_Content_nt2r3_194")
        textElement.textContent = text
        buttonElement.appendChild(textElement)
    }

    return buttonElement
}

function cleanFooterBar() {
    easingFunction(() => {
        const footerElement = classContains("_BottomBar_")?.firstElementChild

        if (footerElement) {
            (footerElement as HTMLElement).style.display = "flex";
            (footerElement as HTMLElement).style.justifyContent = "space-between";
        }

        const prevButton = footerElement?.firstChild
        if (prevButton) {
            if (prevButton.textContent?.includes("Back")) { // the answering page
                prevButton.addEventListener("click", cleanQuestionScreen)

                const submitButton = footerElement?.lastChild?.firstChild
                if (submitButton) {
                    submitButton.addEventListener("click", saveBookworkCheck)
                }
            }
            
            else if (prevButton.textContent?.includes("Previous") || prevButton.textContent == "") { // the question page
                removeElements([prevButton])
                //footerElement?.insertBefore(createQuestionFooterButton("outline", () => {}, "Ask Gemini", LuBrainCircuit), footerElement?.firstChild)
                ifSettingTrue("sparxAddDesmos", () => {
                    footerElement?.insertBefore(createQuestionFooterButton("outline", "calculator-button", toggleDesmos, "Calculator", LuCalculator), footerElement?.firstChild)
                })
                ifSettingTrue("sparxAddSolution", () => {
                    footerElement?.insertBefore(createQuestionFooterButton("primary", "solution-question-button", toggleSolution, "Solution"), footerElement?.firstChild)
                })
                ifSettingTrue("sparxAddChatbot", () => {
                    runOnSubscription(() => {
                        footerElement?.insertBefore(createQuestionFooterButton("outline", "task-tackler-chatbot", toggleChatbot, "Chatbot", LuSparkles), footerElement?.childNodes[2])
                    })
                })
                
                const answerButton = footerElement?.lastChild
                answerButton?.addEventListener("click", cleanQuestionScreen)
            }
        }
    }, 1, 0.05)
}

function saveBookworkCheck() {
    ifSettingTrue("sparxSaveBookworks", () => {
        const questionId = getCurrentQuestionId();
    
        saveSparxData({
            question: getQuestion(),
            submitAnswer: classContains("_QuestionWrapper_")?.innerHTML ?? ""
        }, questionId, (newData) => {
            console.log(newData)
        })
    })
}

function addCard() {
    easingFunction(() => {
        let cardElement = document.querySelector(".task-tackler-sparx-card")
        if (!cardElement) {
            const cardContainer = classContains("_QuestionInfo_")
            if (cardContainer) {
                (cardContainer as HTMLElement).style.gap = "12px"
    
                cardElement = document.createElement("div")
                cardElement.classList.add("_Chip_bu06u_1", "_Selected_bu06u_13", "_Boxy_bu06u_75", "_Filled_bu06u_8", "_md_bu06u_84", "task-tackler-sparx-card")
                cardElement.textContent = "Task-Tackler"
                cardElement.addEventListener("click", () => {
                    window.open("https://task-tackler-nu.vercel.app/dashboard")
                })
    
                cardContainer.appendChild(cardElement)
    
                injectCss(`
                    .task-tackler-sparx-card {
                        background: transparent !important;
                        border: 1px solid var(--colours-selected) !important;
                        color: var(--colours-selected) !important;
                        border-radius: 100px !important;
                        cursor: pointer !important;
                    }    
                `)
            }
        }
    }, 1, 0.05)
    //<div class="_Chip_bu06u_1 _Selected_bu06u_13 _Boxy_bu06u_75 _Filled_bu06u_8 _md_bu06u_84">Bookwork code: 1D</div>
}

export function cleanQuestionScreen() {
    cleanHeader()
    cleanNewBanner()
    cleanFooterBar()
    addCard()
}