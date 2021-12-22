import Auth from "@aws-amplify/auth";
import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface AuthState {
    value: 'loggedIn' | 'notLoggedIn';
    status: 'unknown' | 'idle' | 'loading' | 'failed';
    error: SerializedError | null;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

const initialState: AuthState = {
    value: 'notLoggedIn',
    status: 'unknown',
    error: null,
};

export const performLogin = createAsyncThunk(
    'auth/performLogin',
    async (credentials: AuthCredentials): Promise<boolean> => {
        await Auth.signIn(credentials.email, credentials.password);
        return true;
    },
);

export const performGoogleLogin = createAsyncThunk(
    'auth/performGoogleLogin',
    async (): Promise<boolean> => {
        const ga = window.gapi.auth2.getAuthInstance();
        const googleUser = await ga.signIn();

        const { id_token, expires_at } = googleUser.getAuthResponse();
        const profile = googleUser.getBasicProfile();
        let user = {
            email: profile.getEmail(),
            name: profile.getName()
        };
        
        await Auth.federatedSignIn(
            'google',
            { token: id_token, expires_at },
            user
        );
        return true;
    },
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.value = 'notLoggedIn';
            state.status = 'idle';
        },
        setLoggedIn: (state) => {
            state.value = 'loggedIn';
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(performLogin.pending, (state) => {
                state.value = 'notLoggedIn';
                state.status = 'loading';
            })
            .addCase(performLogin.fulfilled, (state, action) => {
                state.status = action.payload ? 'idle' : 'failed';
                state.value = action.payload ? 'loggedIn' : 'notLoggedIn';
            })
            .addCase(performLogin.rejected, (state, action) => {
                state.value = 'notLoggedIn';
                state.status = 'failed';
                state.error = action.error;
            })
            .addCase(performGoogleLogin.pending, (state) => {
                state.value = 'notLoggedIn';
                state.status = 'loading';
            })
            .addCase(performGoogleLogin.fulfilled, (state, action) => {
                state.status = action.payload ? 'idle' : 'failed';
                state.value = action.payload ? 'loggedIn' : 'notLoggedIn';
            })
            .addCase(performGoogleLogin.rejected, (state, action) => {
                state.value = 'notLoggedIn';
                state.status = 'failed';
                state.error = action.error;
            })
    }
});

export const { logout, setLoggedIn } = authSlice.actions;

export const selectIsLoggedIn = (state: RootState): boolean => state.auth.value === 'loggedIn';
export const selectIsAuthBusy = (state: RootState): boolean => state.auth.status === 'loading';
export const selectIsAuthKnown = (state: RootState): boolean => state.auth.status !== 'unknown';

export default authSlice.reducer;
