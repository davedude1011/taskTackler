import { prepareStartScreenFroAutoCompletion, setAutoCompletionAnswer, setAutoCompletionQuestion } from "../domChanges/quizStartScreen"
import { Question, QuizData } from "../educakeTypes"
import { getJwtToken, getQuizId } from "./sessionData"

const QUESTION_DELAY = 5000

export async function getQuizData(): Promise<QuizData|null> {
    const jwtToken = getJwtToken()
    const quizId = getQuizId()

    if (jwtToken && quizId) {
        const quizData = await fetch("https://my.educake.co.uk/api/student/quiz/" + quizId, {
            method: "GET",
            headers: {
                Accept: "application/json;version=2",
                Authorization: jwtToken,
            },
            referrer: "https://my.educake.co.uk/my-educake/quiz/" + quizId
        })

        return (await quizData.json()).attempt[quizId]
    }
    return null
}

export function getAnswer(questionData: Question): string {
    return "ANSWER OF " + questionData.question
}

export async function loopAnswerQuestions() {
    const quizData = await getQuizData()
    if (quizData) {
        prepareStartScreenFroAutoCompletion()

        const questionMap = quizData.questionMap
        const questionIds = quizData.questions
    
        const answerDict: Record<string, string> = {}
    
        for (let i = 0; i < questionIds.length; i++) {
            setTimeout(() => {
                const questionId = questionIds[i]
                const questionData = questionMap[questionId]
        
                setAutoCompletionAnswer("Fetching answer...")
                setAutoCompletionQuestion(questionData.question)
                getGeminiAnswer(questionData)
                    .then((answer) => {
                        if (answer) {
                            setAutoCompletionAnswer(answer)
                            postAnswer(answer, questionId)
                        }
                        console.log(answer)
                    })
                    .catch((error) => { console.error(error) })
        
                answerDict[questionId] = getAnswer(questionData)
            }, i*QUESTION_DELAY)
        }
        setTimeout(() => {
            window.location.reload()
        }, (questionIds.length*QUESTION_DELAY)+100)
    }
}

async function getGeminiAnswer(questionData: Question): Promise<string|null> {
    const answerData = await fetch('https://task-tackler-nu.vercel.app/api/educake/getAnswer', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(questionData),
    })
    return (await answerData.json()).answer
}

async function postAnswer(answer: string, questionId: number) {
    const jwtToken = getJwtToken()
    const quizId = getQuizId()

    if (jwtToken && quizId) {
        await fetch(`https://my.educake.co.uk/api/attempt/${quizId}/question/${String(questionId)}/answer`, {
            method: "POST",
            headers: {
                Accept: "application/json;version=2",
                Authorization: jwtToken,
            },
            body: `{\"givenAnswer\":\"${answer}\"}`,
            referrer: "https://my.educake.co.uk/my-educake/quiz/" + quizId
        });
    }
}