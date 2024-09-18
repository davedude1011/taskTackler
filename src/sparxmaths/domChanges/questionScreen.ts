import { LuBrainCircuit, LuCalculator } from "../../utils/icons";
import { classContains, classContainsAll, easingFunction, injectCss, removeElements } from "../../utils/utils";
import { toggleDesmos } from "./desmsos";
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
                footerElement?.insertBefore(createQuestionFooterButton("outline", "calculator-button", toggleDesmos, "Calculator", LuCalculator), footerElement?.firstChild)
                footerElement?.insertBefore(createQuestionFooterButton("primary", "solution-question-button", toggleSolution, "Solution"), footerElement?.firstChild)
                
                const answerButton = footerElement?.lastChild
                answerButton?.addEventListener("click", cleanQuestionScreen)
            }
        }
    }, 1, 0.05)
}

function saveBookworkCheck() {
    const questionId = getCurrentQuestionId()
    const localData: Record<string, {question: string, answer: string, submitAnswer: string}> = JSON.parse(localStorage.getItem("localData")??"{}")
    if (!localData[questionId]) {
        localData[questionId] = {
            question: getQuestion(),
            answer: getSolutionString(),
            submitAnswer: classContains("_QuestionWrapper_")?.innerHTML ?? ""
        }
    }
    else {
        localData[questionId] = {
            question: localData[questionId].question,
            answer: localData[questionId].answer,
            submitAnswer: classContains("_QuestionWrapper_")?.innerHTML ?? ""
        }
    }
    localStorage.setItem("localData", JSON.stringify(localData))
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
                    window.open("https://task-tackler-nu.vercel.app/")
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