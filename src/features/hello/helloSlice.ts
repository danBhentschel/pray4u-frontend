import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import { API } from "aws-amplify";
import { RootState } from "../../app/store";

interface HelloResponse {
    message: string;
    cognitoId: string;
}

export interface HelloState extends HelloResponse {
    status: 'unknown' | 'ready' | 'loading' | 'failed';
    error: SerializedError | null;
}

const initialState: HelloState = {
    message: '',
    cognitoId: '',
    status: 'unknown',
    error: null,
};


export const postHello = createAsyncThunk(
    'hello/post',
    async (name: string): Promise<HelloResponse> => {
        return (await API.post('hello', '/hello', { body: { name } })) as HelloResponse;
    }
);

export const helloSlice = createSlice({
    name: 'hello',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postHello.pending, (state) => {
                state.message = '';
                state.cognitoId = '';
                state.status = 'loading';
            })
            .addCase(postHello.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.cognitoId = action.payload.cognitoId;
                state.status = 'ready';
            })
            .addCase(postHello.rejected, (state, action) => {
                state.message = '';
                state.cognitoId = '';
                state.error = action.error;
            })
    },
});

export const selectIsHelloSent = (state: RootState): boolean => state.hello.status !== 'unknown';
export const selectIsHelloReady = (state: RootState): boolean => state.hello.status === 'ready';
export const selectHelloMessage = (state: RootState): string => state.hello.message;
export const selectCognitoId = (state: RootState): string => state.hello.cognitoId;

export default helloSlice.reducer;
