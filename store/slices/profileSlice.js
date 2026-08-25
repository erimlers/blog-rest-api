import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/api";
import ENDPOINTS from "@lib/endpoints";

// Kullanıcı profili getir (Herkese açık)
export const fetchPublicProfile = createAsyncThunk(
  "profile/fetchPublicProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.USERS.GET_PUBLIC(username));
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Kullanıcı profili getirilemedi.");
    }
  }
);

// Kullanıcı ara
export const searchUsersThunk = createAsyncThunk(
  "profile/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.USERS.SEARCH, { params: { q: query } });
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Kullanıcılar aranırken bir hata oluştu.");
    }
  }
);

// Kendi profilini güncelle
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.patch(ENDPOINTS.PROFILE.UPDATE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Profil güncellenirken bir hata oluştu.");
    }
  }
);

// Profil Takip Et / Takipten Çık
export const toggleFollow = createAsyncThunk(
  "profile/toggleFollow",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.USERS.FOLLOW(username));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Takip işlemi başarısız.");
    }
  }
);

const initialState = {
  currentViewedProfile: null, // Şuan incelenen profil (public)
  searchResults: [], // Arama sonuçları
  isSearching: false,
  isLoading: false,
  isUpdating: false,
  error: null,
  updateSuccess: false,
  updateMessage: null,
  requireRelogin: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.currentViewedProfile = null;
      state.error = null;
    },
    clearUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.error = null;
      state.updateMessage = null;
      state.requireRelogin = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchPublicProfile
      .addCase(fetchPublicProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentViewedProfile = action.payload;
      })
      .addCase(fetchPublicProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.updateSuccess = false;
        state.updateMessage = null;
        state.requireRelogin = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
        state.updateMessage = action.payload?.message || "Profil başarıyla güncellendi.";
        state.requireRelogin = action.payload?.requireRelogin || false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // searchUsersThunk
      .addCase(searchUsersThunk.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchUsersThunk.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsersThunk.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload;
      });
  }
});

export const { clearProfileState, clearUpdateStatus } = profileSlice.actions;
export default profileSlice.reducer;
