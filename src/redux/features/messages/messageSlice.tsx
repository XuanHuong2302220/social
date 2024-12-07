import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation, Message } from "@/types";

const initialState = {
    conversations: [] as Conversation[],
    boxConversation: [] as Conversation[]
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
                if(state.boxConversation.length > 3){
                    state.boxConversation.pop();
                }
            }
        },
        removeBoxMessage : (state, action: PayloadAction<string>) => {
            const index = state.boxConversation.findIndex(conversation => conversation.id === action.payload);
            if (index !== -1) {
              state.boxConversation.splice(index, 1);
            }        },
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
        addMessage: (state, action: PayloadAction<{id: String, message: Message}>) => {
            const index = state.boxConversation.findIndex(conversation => conversation.id === action.payload.id);
            if (index !== -1) {
                state.boxConversation[index].messages = [ ...state.boxConversation[index].messages, action.payload.message];
            }
            const indexMessage = state.conversations.findIndex(conversation => conversation.id === action.payload.id);
            if (indexMessage !== -1) {
                state.conversations[indexMessage].messages = [ ...state.conversations[indexMessage].messages, action.payload.message];
            }
        },
        clearMessages: (state) => {
            state.conversations = [];
            state.boxConversation = [];
        }
        
    }
})

export const { setConversations, setBoxConversations,addConversation, removeBoxMessage, clearConversation, addMessages, addMessage, clearMessages} = messageSlice.actions;
export default messageSlice.reducer;