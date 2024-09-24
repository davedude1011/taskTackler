import { classContains, classContainsAll } from "../../utils/utils";

export function injectButton() {
    const buttonContainers = classContainsAll("kian-course-lesson-steps-footer")

    for (const buttonContainer of buttonContainers) {
        const buttonExists = classContains("task-tackler-know-it-all-ninja-skip-button", buttonContainer)
        if (!buttonExists) {
            const newButton = document.createElement("button")
            newButton.classList.add("task-tackler-know-it-all-ninja-skip-button", "kian-course-lesson-prev-step")
            newButton.textContent = "Skip Tutorial"
    
            newButton.addEventListener("click", () => {
                skipTutorial()
            })
        
            buttonContainer?.appendChild(newButton)
        }
    }
}

function skipTutorial() {
    const currentUrl = window.location.href;
    const updatedUrl = currentUrl.replace("lessons", "quizzes");
    
    // Only change the URL if there's a difference
    if (updatedUrl !== currentUrl) {
      window.location.href = updatedUrl;
    }
}
