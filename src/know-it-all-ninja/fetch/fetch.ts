export async function fetchAnswer(bodyData: {
    quizId: number,
    quiz: number,
    quizNonce: number,
    proId: number,
    postId: number
}) {
    const data = await fetch("https://www.knowitallninja.com/wp-admin/admin-ajax.php", {
        "headers": {
          "accept": "application/json, text/javascript, */*; q=0.01",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"129\", \"Not=A?Brand\";v=\"8\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://www.knowitallninja.com/dashboard/quizzes/logic-diagrams/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `action=ld_adv_quiz_pro_ajax&func=checkAnswers&data%5BquizId%5D=${bodyData.quizId}&data%5Bquiz%5D=${bodyData.quiz}&data%5Bquiz_nonce%5D=${bodyData.quizNonce}&data%5Bresponses%5D=%7B%22${bodyData.proId}%22%3A%7B%22question_pro_id%22%3A${bodyData.proId}%2C%22question_post_id%22%3A${bodyData.postId}%7D%7D`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    return await data.json()
}