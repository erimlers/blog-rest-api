import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/api";
import ENDPOINTS from "@lib/endpoints";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.LIST);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Bildirimler getirilemedi.");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      await api.put(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Bildirim işaretlenemedi.");
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await api.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Bildirimler işaretlenemedi.");
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(ENDPOINTS.NOTIFICATIONS.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Bildirim silinemedi.");
    }
  }
);

export const deleteAllNotifications = createAsyncThunk(
  "notifications/deleteAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete(ENDPOINTS.NOTIFICATIONS.DELETE_ALL);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Bildirimler silinemedi.");
    }
  }
);

const initialState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotificationSocket: (state, action) => {
      // Socket'ten gelen bildirimi en başa ekle
      state.items.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    }
  },
  extraReducers: (builder) => {
    // fetchNotifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data.notifications || [];
        state.unreadCount = action.payload.data.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // markAsRead
    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const id = action.payload;
      const notification = state.items.find((n) => n._id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        if (state.unreadCount > 0) state.unreadCount -= 1;
      }
    });

    // markAllAsRead
    builder.addCase(markAllAsRead.fulfilled, (state) => {
      state.items.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    });

    // deleteNotification
    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      const id = action.payload;
      const notificationIndex = state.items.findIndex((n) => n._id === id);
      if (notificationIndex !== -1) {
        if (!state.items[notificationIndex].isRead && state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
        state.items.splice(notificationIndex, 1);
      }
    });

    // deleteAllNotifications
    builder.addCase(deleteAllNotifications.fulfilled, (state) => {
      state.items = [];
      state.unreadCount = 0;
    });
  },
});

export const { addNotificationSocket } = notificationSlice.actions;

export default notificationSlice.reducer;
