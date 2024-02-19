import axios from "./axios";
import { setQuizData } from "../store/reducers/quizSlice";
import { setChosenRound } from "../store/reducers/chosenRoundSlice";
import { setChosenQuestion } from "../store/reducers/chosenQuestionSlice";


export const fetchQuizData = (quizId) => async (dispatch, getState) => {
  try {
    const response = await axios.get(`/quizzes/${quizId}`);

    // Assuming you want to keep the transformation for UI reasons, but do it more safely
    const roundsWithLabels = response.data.quiz.rounds.map((round) => ({
      ...round,
      value: round.id,
      label: `${round.count} ${round.name}`,
    }));

    // Dispatch the original quiz data to the store
    dispatch(setQuizData({ ...response.data.quiz, rounds: roundsWithLabels }));

    const currentState = getState();
    const { chosenRound, chosenQuestion } = currentState;

    // Check if chosenRound is defined and not empty
    if (!chosenRound.data || Object.keys(chosenRound.data).length === 0) {

      dispatch(setChosenRound(roundsWithLabels[0]));
      dispatch(setChosenQuestion(roundsWithLabels[0].questions[0]));
    } else {
      // Find and update the chosenRound and chosenQuestion if they exist
      const currentRound = roundsWithLabels.find(round => round.id === chosenRound.data.id);
      if (currentRound) {
        const currentQuestion = currentRound.questions.find(question => question.id === chosenQuestion.data.id);
        dispatch(setChosenRound(currentRound));
        dispatch(setChosenQuestion(currentQuestion));
        
        }
    }
  } catch (error) {
    console.error('Failed to fetch quiz data', error);
  }
};
