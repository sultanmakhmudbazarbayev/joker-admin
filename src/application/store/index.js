import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import quizReducer from './reducers/quizSlice';
import chosenRoundReducer from './reducers/chosenRoundSlice';
import chosenQuestionReducer from './reducers/chosenQuestionSlice';
import questionDataReducer from './reducers/questionDataSlice';
import socketClientReducer from './reducers/socketClientSlice';
import sessionQuizIdReducer from './reducers/sessionQuizIdSlice';
import teamsReducer from './reducers/teamsSlice';

const rootReducer = combineReducers({
  quiz: quizReducer,
  question: questionDataReducer,
  chosenRound: chosenRoundReducer,
  chosenQuestion: chosenQuestionReducer,
  socket: socketClientReducer,
  sessionQuizId: sessionQuizIdReducer,
  teams: teamsReducer
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
