import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/api";
import ENDPOINTS from "@lib/endpoints";

// ─── Thunks ─────────────────────────────────────────────────────────────

// Tüm postları (veya filtrelenmiş postları) getir
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params, { rejectWithValue }) => {
    try {
      // params objesi { page, limit, search, sortBy, tag, author } içerebilir
      // Axios params nesnesi query string'i otomatik oluşturur
      const response = await api.get(ENDPOINTS.POSTS.LIST, { params });
      
      return {
        posts: response.data?.posts || response.posts || [],
        currentPage: response.data?.currentPage || response.currentPage || 1,
        totalPages: response.data?.totalPages || response.totalPages || 1,
        totalPosts: response.data?.totalPosts || response.totalPosts || 0,
        // Bu istek bir "Daha fazla yükle" isteği miydi? (Gelen veriyi state'e eklemek için)
        isLoadMore: params?.page > 1
      };
    } catch (error) {
      return rejectWithValue(error.message || "Yazılar yüklenirken bir hata oluştu.");
    }
  }
);

// Post beğenme / Beğeniyi kaldırma
export const toggleLikePost = createAsyncThunk(
  "posts/toggleLikePost",
  async (postId, { rejectWithValue }) => {
    try {
      // Beğeni işlemi, hem ekleme hem çıkarma için aynı endpoint
      const response = await api.post(ENDPOINTS.POSTS.LIKE(postId));
      return { postId, post: response.data || response }; // Backend güncel postu dönmeli
    } catch (error) {
      return rejectWithValue(error.message || "Beğeni işlemi başarısız.");
    }
  }
);

// Yeni post oluşturma (Resim içerdiği için FormData kullanılmalı)
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.POSTS.CREATE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Yazı paylaşılırken bir hata oluştu.");
    }
  }
);

// Tek bir postu ID ile getir
export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.POSTS.DETAIL(postId));
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Yazı bulunamadı.");
    }
  }
);

// Bir postun yorumlarını getir
export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.COMMENTS.LIST(postId));
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Yorumlar getirilemedi.");
    }
  }
);

// Yeni yorum ekle
export const createComment = createAsyncThunk(
  "posts/createComment",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(ENDPOINTS.COMMENTS.CREATE(postId), { content });
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Yorum eklenemedi.");
    }
  }
);

// Yorum güncelle
export const updateComment = createAsyncThunk(
  "posts/updateComment",
  async ({ postId, commentId, content }, { rejectWithValue }) => {
    try {
      const response = await api.patch(ENDPOINTS.COMMENTS.UPDATE(postId, commentId), { content });
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Yorum güncellenemedi.");
    }
  }
);

// Yorum sil
export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await api.delete(ENDPOINTS.COMMENTS.DELETE(postId, commentId));
      return commentId; // Silinen yorumun id'sini dön
    } catch (error) {
      return rejectWithValue(error.message || "Yorum silinemedi.");
    }
  }
);

// ─── Slice ve State ──────────────────────────────────────────────────

const initialState = {
  posts: [],
  currentPost: null, // Detay sayfasında gösterilecek post
  comments: [],      // Detay sayfasındaki postun yorumları
  isCurrentPostLoading: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0
  },
  filters: {
    search: "",
    sortBy: "newest", // 'newest', 'oldest', 'popular'
    tag: ""
  }
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      // Yeni bir filtre uygulandığında page her zaman 1'e sıfırlanmalıdır
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- fetchPosts ---
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        
        if (action.payload.isLoadMore) {
          // Daha fazla yükle dendiyse, mevcut postların sonuna ekle
          state.posts = [...state.posts, ...action.payload.posts];
        } else {
          // İlk sayfa veya yeni filtreyse, listeyi tamamen yenile
          state.posts = action.payload.posts;
        }

        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalPosts: action.payload.totalPosts
        };
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload;
      })
      
      // --- toggleLikePost ---
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        // Hangi post güncellendiyse onu bulup güncel haliyle değiştiriyoruz
        const index = state.posts.findIndex(p => p._id === action.payload.postId);
        if (index !== -1 && action.payload.post) {
          state.posts[index].likes = action.payload.post.likes || action.payload.post.data?.likes;
        }
        
        // Eğer detay sayfasındaysak ve mevcut post beğenildiyse onu da güncelle
        if (state.currentPost && state.currentPost._id === action.payload.postId) {
          state.currentPost.likes = action.payload.post.likes || action.payload.post.data?.likes;
        }
      })
      
      // --- fetchPostById ---
      .addCase(fetchPostById.pending, (state) => {
        state.isCurrentPostLoading = true;
        state.error = null;
        state.currentPost = null; // Eski postu temizle
        state.comments = [];      // Eski yorumları temizle
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isCurrentPostLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isCurrentPostLoading = false;
        state.error = action.payload;
      })

      // --- fetchComments ---
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })

      // --- createComment ---
      .addCase(createComment.fulfilled, (state, action) => {
        // Yeni eklenen yorumu listeye ekle
        state.comments.unshift(action.payload); // Yeni yorumlar genelde en üste eklenir (veya push)
      })

      // --- updateComment ---
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index = state.comments.findIndex(c => c._id === updatedComment._id);
        if (index !== -1) {
          state.comments[index] = updatedComment;
        }
      })

      // --- deleteComment ---
      .addCase(deleteComment.fulfilled, (state, action) => {
        const deletedCommentId = action.payload;
        state.comments = state.comments.filter(c => c._id !== deletedCommentId);
      });
  }
});

export const { setFilters, clearFilters } = postSlice.actions;
export default postSlice.reducer;
