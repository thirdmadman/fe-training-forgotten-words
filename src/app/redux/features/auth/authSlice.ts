import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuth } from '../../../interfaces/IAuth';
import { IUser } from '../../../interfaces/IUser';
import DataLocalStorageProvider from '../../../services/DataLocalStorageProvider';
import { clearStorageState } from '../../../services/local-storage-service';
import { SigninService } from '../../../services/SigninService';
import { TokenProvider } from '../../../services/TokenProvider';
import { UserService } from '../../../services/UserService';
import { UserSettingService } from '../../../services/UserSettingService';

interface AuthPageState {
  emailSignIn: string;
  passwordSignIn: string;

  isShowRegister: boolean;
  emailRegister: string;
  passwordRegister: string;
  nameRegister: string;

  userShowName: string;
  userShowEmail: string;
}

const initialState: AuthPageState = {
  emailSignIn: '',
  passwordSignIn: '',

  isShowRegister: false,
  emailRegister: '',
  passwordRegister: '',
  nameRegister: '',

  userShowName: '',
  userShowEmail: '',
};

interface RegisterUserArgs {
  email: string;
  password: string;
  userName?: string;
}

interface SignInUserArgs {
  email: string;
  password: string;
}

interface SignInResult {
  isSignedIn: boolean;
  info?: IAuth;
}

const getUserInfo = async (userId: string) => UserService.getUserById(userId);

const signInAction = async (signInArgs: SignInUserArgs) => {
  const isSignedIn = await SigninService.auth(signInArgs.email, signInArgs.password)
    .then((auth) => {
      const { userId } = auth;
      UserSettingService.getUserSettingById(userId)
        .then((settings) => {
          if (settings.optional) {
            const configs = { ...DataLocalStorageProvider.getData() };
            configs.userConfigs = settings.optional;
            DataLocalStorageProvider.setData(configs);
          }
        })
        .catch((e) => console.error(e));
      return { isSignedIn: true, info: auth };
    })
    .catch((error) => {
      console.error(error);
      return { isSignedIn: false };
    });
  return isSignedIn as SignInResult;
};

const registerUser = async (registerArgs: RegisterUserArgs) => {
  await UserService.createUser(registerArgs.email, registerArgs.password, registerArgs.userName);
  const signInResult = await signInAction({ email: registerArgs.email, password: registerArgs.password });

  return signInResult;
};

export const getUserInfoAction = createAsyncThunk<IUser, string>('auth/getUserInfo', getUserInfo);
export const registerUserAction = createAsyncThunk<SignInResult, RegisterUserArgs>('auth/registerUser', registerUser);
export const signInUserAction = createAsyncThunk<SignInResult, SignInUserArgs>('auth/signInUserUser', signInAction);

export const authSlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    resetStateAuth: () => initialState,
    signOutAction: () => {
      clearStorageState();
      TokenProvider.clearAuthData();
    },
    showRegister: (state) => {
      state.isShowRegister = true;
    },
    hideRegister: (state) => {
      state.isShowRegister = false;
    },
    setEmailSignIn: (state, action: PayloadAction<string>) => {
      state.emailSignIn = action.payload;
    },
    setPasswordSignIn: (state, action: PayloadAction<string>) => {
      state.passwordSignIn = action.payload;
    },
    setPasswordRegister: (state, action: PayloadAction<string>) => {
      state.passwordRegister = action.payload;
    },
    setEmailRegister: (state, action: PayloadAction<string>) => {
      state.emailRegister = action.payload;
    },
    setNameRegister: (state, action: PayloadAction<string>) => {
      state.nameRegister = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfoAction.fulfilled, (state, action) => {
      if (action.payload) {
        state.userShowName = action.payload.name;
        state.userShowEmail = action.payload.email;
      }
    });
    builder.addCase(signInUserAction.fulfilled, (state, action) => {
      if (action.payload && action.payload.isSignedIn) {
        return initialState;
      }
      return state;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      if (action.payload && action.payload.isSignedIn) {
        return initialState;
      }
      return state;
    });
  },
});

export const {
  signOutAction,
  showRegister,
  hideRegister,
  setEmailSignIn,
  setPasswordSignIn,
  setEmailRegister,
  setNameRegister,
  setPasswordRegister,
  resetStateAuth,
} = authSlice.actions;

export default authSlice.reducer;
