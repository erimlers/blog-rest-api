// Tüm backend endpoint yolları tek noktada tanımlı.
// Endpoint değiştiğinde sadece burayı güncellemeniz yeterli.

const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    VERIFY: "/auth/verify",
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
};

export default ENDPOINTS;
