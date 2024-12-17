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
import socketReducer from './features/socket/socketSlice';
import notifiReducer from './features/notification/notifySlice'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['post', 'comment', 'socket', 'notification'],
};

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  theme: themeReducer,
  post: postReducer,
  comment: commentReducer,
  message: messageReducer,
  socket: socketReducer,
  notification: notifiReducer
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