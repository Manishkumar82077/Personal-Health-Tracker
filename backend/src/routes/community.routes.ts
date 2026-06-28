import { Router } from 'express';
import {
  listPosts, createPost, deletePost,
  listComments, addComment, toggleLike, getPublicProfile,
} from '../controlers/community/communityController';

const router = Router();

router.get('/posts', listPosts);
router.post('/posts', createPost);
router.delete('/posts/:id', deletePost);
router.get('/posts/:id/comments', listComments);
router.post('/posts/:id/comments', addComment);
router.post('/posts/:id/like', toggleLike);
router.get('/profile/:uid', getPublicProfile);

export default router;
