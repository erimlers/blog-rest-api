import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/api";
import ENDPOINTS from "@lib/endpoints";

// ─── Asenkron Thunk'lar ──────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Kayıt işlemi başarısız.");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
      // Backend { success: true, data: { user: {...} }, message: "..." } döner.
      // api.js'teki interceptor response.data döndüğü için, user bilgisi response.data.user içindedir.
      return response.data?.user || response.user; 
    } catch (error) {
      return rejectWithValue(error.message || "Giriş işlemi başarısız. Bilgilerinizi kontrol edin.");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // Backend'deki httpOnly çerezi temizleyen endpoint'i tetikler
      await api.post(ENDPOINTS.AUTH.LOGOUT);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Çıkış işlemi başarısız.");
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // Tarayıcıdaki httpOnly cookie geçerliyse, kullanıcı bilgilerini getirir.
      const response = await api.get(ENDPOINTS.PROFILE.GET);
      return response.data?.user || response.user;
    } catch (error) {
      return rejectWithValue("Oturum süresi dolmuş veya geçersiz.");
    }
  }
);

// ─── Slice ve State ──────────────────────────────────────────────────

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // İhtiyaç halinde component'lerden error'u temizlemek için senkron aksiyon
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- LOGIN ---
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload; // Backend'den gelen temiz user objesi
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // --- REGISTER ---
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        // Kullanıcı kayıt olduktan sonra giriş yapmış sayılmaz (e-posta onayı beklendiği için).
        // Yönlendirmeyi UI (page.js) tarafında yapacağız.
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- LOGOUT ---
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Çıkışta ağ hatası olsa bile güvenlik için client state'i temizlemek iyi bir pratiktir
        state.user = null;
        state.isAuthenticated = false;
      })

      // --- CHECK AUTH ---
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
