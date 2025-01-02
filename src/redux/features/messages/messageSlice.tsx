import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation, Message } from "@/types";

const initialState = {
    conversations: [] as Conversation[],
    boxConversation: [] as Conversation[],
    countNotify: 0 as number,
    countMessage: [] as string[]
}

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setConversations: (state, action: PayloadAction<Conversation[]>) => {
            state.conversations = action.payload;
        },
        setBoxConversations: (state, action: PayloadAction<Conversation>) => {
            state.boxConversation = [...state.boxConversation, action.payload];
        },
        addConversation: (state, action: PayloadAction<Conversation>) => {
            const newConversation = state.boxConversation.find(conversation => conversation.id === action.payload.id);
            if(!newConversation){
                if(state.boxConversation.length < 3){
                    state.boxConversation = [...state.boxConversation, action.payload];
                }
                if(state.boxConversation.length === 3){
                    state.boxConversation.pop();
                    state.boxConversation = [action.payload,...state.boxConversation];
                }
            }
            const newConversationMess = state.conversations.find(conversation => conversation.id === action.payload.id);
            if(!newConversationMess){
                console.log(newConversationMess, 'newConversationMess')
                state.conversations = [action.payload,...state.conversations];
            }
        },
        addMessConversation: (state, action: PayloadAction<Conversation>) => {
            const newConversation = state.conversations.find(conversation => conversation.id === action.payload.id);
            if(!newConversation){
                state.conversations = [action.payload,...state.conversations];
            }
        },
        removeBoxMessage : (state, action: PayloadAction<string>) => {
            const index = state.boxConversation.findIndex(conversation => conversation.id === action.payload);
            if (index !== -1) {
              state.boxConversation.splice(index, 1);
            }        
        },
        clearConversation: (state) => {
            state.conversations = [];
            state.boxConversation = [];
        },
        addMessages: (state, action: PayloadAction<{id: string, messages: Message[]}>) => {
            const index = state.boxConversation.findIndex(conversation => conversation.id === action.payload.id);
            if (index !== -1) {
                state.boxConversation[index].messages = action.payload.messages.reverse();
            }

            const indexConversataion = state.conversations.findIndex(conversation => conversation.id === action.payload.id);
            if (indexConversataion !== -1) {
                state.conversations[indexConversataion].messages = action.payload.messages
            }
        },
        addMessage: (state, action: PayloadAction<{id: string, message: Message}>) => {
            const index = state.boxConversation.findIndex(conversation => conversation.id === action.payload.id);
            if (index !== -1) {
                state.boxConversation[index].messages = [ ...state.boxConversation[index]?.messages, action.payload.message];
            }
            const indexMessage = state.conversations.findIndex(conversation => conversation.id === action.payload.id);
            if (indexMessage !== -1) {
                state.conversations[indexMessage].messages = [ ...state.conversations[indexMessage]?.messages, action.payload.message];
            }
        },
        clearMessages: (state) => {
            state.conversations = [];
            state.boxConversation = [];
        },
        setCountNotify: (state) => {
            state.countNotify = state.countNotify ? state.countNotify + 1: 1;
        },
        clearCountNotify: (state) => {
            state.countNotify = 0;
        },
        setCountMessage: (state, action: PayloadAction<string>) => {
            if(!state.countMessage){
                state.countMessage = [];
            }
            const index = state.countMessage.findIndex(id => id === action.payload);
            if (index === -1) {
              state.countMessage.push(action.payload);
            }
        },
        clearCountMessage: (state) => {
            state.countMessage = []
        },
        decreaCountMessage: (state, action: PayloadAction<string>) => {
            
            const index = state.countMessage.findIndex(id => id === action.payload);
            if (index !== -1) {
              state.countMessage.splice(index, 1);
            }
        }
        
    }
})

export const { setConversations, setBoxConversations,addConversation, removeBoxMessage, clearConversation, addMessages, addMessage, clearMessages, setCountNotify, clearCountNotify, setCountMessage, clearCountMessage, decreaCountMessage, addMessConversation} = messageSlice.actions;
export default messageSlice.reducer;