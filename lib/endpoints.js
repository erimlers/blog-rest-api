// Tüm backend endpoint yolları tek noktada tanımlı.
// Endpoint değiştiğinde sadece burayı güncellemeniz yeterli.

const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    VERIFY: "/auth/verify",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  POSTS: {
    LIST: "/posts",
    DETAIL: (postId) => `/posts/${postId}`,
    CREATE: "/posts",
    UPDATE: (postId) => `/posts/${postId}`,
    DELETE: (postId) => `/posts/${postId}`,
    LIKE: (postId) => `/posts/${postId}/like`,
  },
  COMMENTS: {
    LIST: (postId) => `/posts/${postId}/comments`,
    CREATE: (postId) => `/posts/${postId}/comments`,
    UPDATE: (postId, commentId) => `/posts/${postId}/comments/${commentId}`,
    DELETE: (postId, commentId) => `/posts/${postId}/comments/${commentId}`,
  },
  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
  },
  USERS: {
    GET_PUBLIC: (username) => `/u/${username}`,
    FOLLOW: (username) => `/u/${username}/follow`,
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    DELETE: (id) => `/notifications/${id}`,
    DELETE_ALL: "/notifications/delete-all"
  }
};

export default ENDPOINTS;
