import Auth from "@aws-amplify/auth";
import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { onError } from "../../lib/errorLib";

type AuthProvider = 'none' | 'cognito' | 'google';

export interface AuthState {
    value: 'loggedIn' | 'notLoggedIn';
    status: 'unknown' | 'idle' | 'loading' | 'failed';
    provider: AuthProvider;
    error: SerializedError | null;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

const initialState: AuthState = {
    value: 'notLoggedIn',
    status: 'unknown',
    provider: 'none',
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
        await loginToGoogle();
        return true;
    },
);

const loginToGoogle = async () => {
    const googleAuth = window.gapi.auth2.getAuthInstance();
    const googleUser = googleAuth.isSignedIn.get()
        ? googleAuth.currentUser.get()
        : await googleAuth.signIn();

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
};

export const checkLoggedIn = createAsyncThunk(
    'auth/checkLoggedIn',
    async (): Promise<AuthProvider> => {
        try {
            await Auth.currentSession();
            return 'cognito';
        } catch (e) {
            if (e !== 'No current user') {
                onError(e);
                return 'none';
            }
        }

        await new Promise((resolve) => {
            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: '344279965332-4cma6kuef2essduetjc4mb19dpr5663b.apps.googleusercontent.com',
                    // authorized scopes
                    scope: 'profile email openid'
                }).then((googleAuth) => resolve(googleAuth));
            });
        });

        const googleAuth = gapi.auth2.getAuthInstance();
        if (!googleAuth.isSignedIn.get()) {
            return 'none';
        }

        try {
            await Auth.currentUserCredentials();
            return 'google';
        } catch (e) {
            console.error(e);
        }

        await loginToGoogle();
        return 'google';
    },
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (provider: AuthProvider = 'cognito'): Promise<boolean> => {
        await Auth.signOut();
        if (provider === 'google') {
            const googleAuth = gapi.auth2.getAuthInstance();
            await googleAuth.signOut();
            googleAuth.disconnect();
        }
        return true;
    },
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkLoggedIn.pending, (state) => {
                state.value = 'notLoggedIn';
                state.status = 'loading';
            })
            .addCase(checkLoggedIn.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = action.payload === 'none' ? 'notLoggedIn' : 'loggedIn';
                state.provider = action.payload;
            })
            .addCase(checkLoggedIn.rejected, (state, action) => {
                state.value = 'notLoggedIn';
                state.status = 'failed';
                state.error = action.error;
            })
            .addCase(logout.pending, (state) => {
                state.value = 'notLoggedIn';
                state.status = 'loading';
                state.provider = 'none';
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = 'notLoggedIn';
                state.provider = 'none';
            })
            .addCase(logout.rejected, (state, action) => {
                state.value = 'notLoggedIn';
                state.status = 'failed';
                state.provider = 'none';
                state.error = action.error;
            })
            .addCase(performLogin.pending, (state) => {
                state.value = 'notLoggedIn';
                state.status = 'loading';
                state.provider = 'none';
            })
            .addCase(performLogin.fulfilled, (state, action) => {
                state.status = action.payload ? 'idle' : 'failed';
                state.value = action.payload ? 'loggedIn' : 'notLoggedIn';
                state.provider = 'cognito';
            })
            .addCase(performLogin.rejected, (state, action) => {
                state.value = 'notLoggedIn';
                state.status = 'failed';
                state.provider = 'none';
                state.error = action.error;
            })
            .addCase(performGoogleLogin.pending, (state) => {
                state.value = 'notLoggedIn';
                state.status = 'loading';
                state.provider = 'none';
            })
            .addCase(performGoogleLogin.fulfilled, (state, action) => {
                state.status = action.payload ? 'idle' : 'failed';
                state.value = action.payload ? 'loggedIn' : 'notLoggedIn';
                state.provider = 'google';
            })
            .addCase(performGoogleLogin.rejected, (state, action) => {
                state.value = 'notLoggedIn';
                state.status = 'failed';
                state.provider = 'none';
                state.error = action.error;
            })
    }
});

export const selectIsLoggedIn = (state: RootState): boolean => state.auth.value === 'loggedIn';
export const selectIsAuthBusy = (state: RootState): boolean => state.auth.status === 'loading';
export const selectIsAuthKnown = (state: RootState): boolean => state.auth.status !== 'unknown';

export const selectAuthProvider = (state: RootState): AuthProvider => state.auth.provider;

export default authSlice.reducer;
