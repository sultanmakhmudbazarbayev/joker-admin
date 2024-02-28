import axios from "@/application/actions/axios";

export const _createQuiz = async (data) => {
    return await axios.post("/quiz", data)  
}
export const _fetchQuizzes = async () => {
    return await axios.get("/quizzes");
}
export const _fetchQuizById = async (id) => {
    return await axios.get(`/quizzes/${id}`);
}


export const _createQuestion = async (data) => {
    return await axios.post("/question", data)  
}
export const _fetchQuestionById = async (id) => {
    return await axios.get(`/question/${id}`);
}
export const _updateQuestionData = async (id, data) => {
    return await axios.put(`/question/${id}`, data);
}
export const _fetchQuestionTypes = async () => {
    return await axios.get(`/question-types`);
}
export const _fetchQuestionTypeById = async (id) => {
    return await axios.get(`/question-types/${id}`);
}
export const _fetchQuestionTimeOptions = async () => {
    return await axios.get(`/question-time`);
}


export const _createQuestionAnswer = async (question_id, data) => {
    return await axios.post(`/answer?question_id=${question_id}`, data)  
}
export const _updateQuestionAnswer = async (id, data) => {
    return await axios.put(`/answer/${id}`, data);
}
export const _deleteQuestionAnswer = async (id) => {
    return await axios.delete(`/answer/${id}`);
}


export const _fetchRoundById = async (id) => {
    return await axios.get(`/rounds/${id}`);
}









export const _saveImage = async (formData) => {
    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/upload-image`, {
        method: 'POST',
        body: formData,
    });
}

export const _saveAudio = async (formData) => {
    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/upload-audio`, {
        method: 'POST',
        body: formData,
    });
}