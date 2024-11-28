// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import userReducer from './features/user/userSlice';
import authReducer from './features/auth/authSlice';
import themeReducer from './features/theme/themeSlice';
import postReducer from './features/post/postSlice';
import commentReducer from './features/comment/commentSlice';
import messageReducer from './features/messages/messageSlice';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['post', 'comment'],
};

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  theme: themeReducer,
  post: postReducer,
  comment: commentReducer,
  message: messageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;