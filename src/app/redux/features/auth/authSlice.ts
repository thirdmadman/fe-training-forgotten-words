import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../../interfaces/IUser';
import DataLocalStorageProvider from '../../../services/DataLocalStorageProvider';
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

const getUserInfo = async (userId: string) => UserService.getUserById(userId);

const signInAction = (signInArgs: SignInUserArgs) => {
  SigninService.auth(signInArgs.email, signInArgs.password)
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
    })
    .catch((error) => {
      console.error(error);
    });
};

const registerUser = async (registerArgs: RegisterUserArgs) => {
  const result = await UserService.createUser(registerArgs.email, registerArgs.password, registerArgs.userName)
    .then(() => {
      signInAction({ email: registerArgs.email, password: registerArgs.password });
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });

  return result;
};

export const getUserInfoAction = createAsyncThunk<IUser, string>('auth/getUserInfo', getUserInfo);
export const registerUserAction = createAsyncThunk<boolean, RegisterUserArgs>('auth/registerUser', registerUser);
export const signInUserAction = createAsyncThunk<boolean, RegisterUserArgs>('auth/registerUser', registerUser);

export const authSlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    signOutAction: () => {
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
} = authSlice.actions;

export default authSlice.reducer;
