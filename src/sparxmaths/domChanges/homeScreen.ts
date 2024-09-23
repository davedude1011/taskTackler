import { ifSettingTrue } from "../../settings/settings";
import { classContainsAll, easingFunction, functionMapping, removeElements } from "../../utils/utils";

function cleanTitleArea() {
    const titleElements = classContainsAll("_Hello_")
    const titleDescriptionElements = classContainsAll("_PackageTypeDescription_")
    const progressWheels = classContainsAll("_ProgressWheelContainer_")
    removeElements([...titleElements, ...titleDescriptionElements, ...progressWheels])
}
function cleanHomeworkListArea() {
    const completionStatus = classContainsAll("_CompletionStatus_")
    const bookworkAccuracyText = classContainsAll("_BookworkAccuracyText_")
    const deviderElements = classContainsAll("_Divider_")
    removeElements([...completionStatus, ...bookworkAccuracyText, ...deviderElements])

    const accordianItems = classContainsAll("_AccordionItem_")
    for (let i = 0; i < accordianItems.length; i++) {
        if (accordianItems.item(i)?.classList.contains("_Completed_9fvag_50")) {
            (accordianItems.item(i) as HTMLElement).style.display = "none"
        }
    }
}

export function cleanHomescreen() {
    ifSettingTrue("sparxCleanHomescreen", () => {
        cleanTitleArea()
        cleanHomeworkListArea()
    })
}