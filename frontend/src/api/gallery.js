import api from './axios';

export const getComments = (postId) => api.get(`/gallery/${postId}/comments`);

export const addComment = (postId, body) => api.post(`/gallery/${postId}/comments`, { body });

export const replyToComment = (commentId, body) => api.post(`/gallery/comments/${commentId}/reply`, { body });

export const togglePostLike = (postId) => api.post(`/gallery/${postId}/like`);

export const toggleCommentLike = (commentId) => api.post(`/gallery/comments/${commentId}/like`);

export const getPostLikes = (postId) => api.get(`/gallery/${postId}/likes`);
