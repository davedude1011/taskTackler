import { classContains, classContainsAll, easingFunction, injectCss } from "../../utils/utils";

export function inputFillerLoop() {
    document.body.addEventListener('click', () => {
        console.log("CLICK")
        easingFunction(() => {
            injectCss(`[class*="TestedWord_word_skeleton_"] {
                visibility: visible !important;
                opacity: 0.5 !important;
                font-weight: 100 !important;
            }
            
            [class*="Input_input__"] {
                text-align: start !important;
            }`)
            for (const inputContainer of classContainsAll("MissingWordInput_container")) {
              const invisInput = classContains("TestedWord_word_skeleton_", inputContainer) as HTMLElement
              invisInput.style.visibility = "visible"
              invisInput.style.opacity = "0.5"
              invisInput.style.fontWeight = "100"

              const inputElement = classContains("Input_input__", inputContainer) as HTMLInputElement
              inputElement.style.textAlign = "start"
            }
        })
    }, true)
}