export function getJwtToken() {
    const jwtToken = sessionStorage.getItem("token")
    if (jwtToken) {
        return "Bearer " + jwtToken
    }
    return null
}

export function getQuizId() {
    const pathname = window.location.pathname
    const quizId = pathname.split("/")[pathname.split("/").length - 1]
    return quizId
}