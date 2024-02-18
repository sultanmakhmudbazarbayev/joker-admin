import axios from "@/application/actions/axios";

export const _createQuiz = async (postData) => {
    return await axios.post("/quiz", postData)  
}

export const _createQuestion = async (postData) => {
    return await axios.post("/question", postData)  
}

export const _fetchQuizzes = async () => {
    return await axios.get("/quizzes");
}

export const _fetchQuizById = async (id) => {
    return await axios.get(`/quizzes/${id}`);
}

export const _fetchQuestionById = async (id) => {
    return await axios.get(`/question/${id}`);
}

export const _fetchRoundById = async (id) => {
    return await axios.get(`/rounds/${id}`);
}