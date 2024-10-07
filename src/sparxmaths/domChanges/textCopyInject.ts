import { injectCss } from "../../utils/utils";

export function makeTextCopyable() {
    injectCss(`
        :root {
            --user-select-accessibility-setting: default !important;
            cursor: auto !important;
        }
    `)
}