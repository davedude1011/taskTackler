import { easingFunction } from "../../utils/utils";

function extractQuizData() {
    // Get all the script tags on the page
    const scripts = document.querySelectorAll('script');

    // Loop through the script tags to find the one containing wpProQuizFront
    for (let script of scripts) {
        if (script.innerText.includes('wpProQuizFront')) {
            // Extract the quizId, quiz, and quiz_nonce using regex
            const quizIdMatch = script.innerText.match(/quizId:\s*(\d+)/);
            const quizMatch = script.innerText.match(/quiz:\s*(\d+)/);
            const quizNonceMatch = script.innerText.match(/quiz_nonce:\s*'([^']+)'/);

            if (quizIdMatch && quizMatch && quizNonceMatch) {
                const quizId = quizIdMatch[1];
                const quiz = quizMatch[1];
                const quizNonce = quizNonceMatch[1];

                console.log(`quizId: ${quizId}`);
                console.log(`quiz: ${quiz}`);
                console.log(`quiz_nonce: ${quizNonce}`);

                // You can now return the data or use it as needed
                return {
                    quizId,
                    quiz,
                    quizNonce
                };
            }
        }
    }
    
    // Return null if the script with wpProQuizFront wasn't found
    return null;
}

export function getPageData(): { quizId: number, quiz: number, quizNonce: number }|null {
    const data = extractQuizData()

    // @ts-expect-error
    return data ?? null
}