import { Router } from 'express';
import {
  listPosts, createPost, deletePost, react, getPublicProfile,
} from '../controlers/community/communityController';

const router = Router();

router.get('/posts', listPosts);
router.post('/posts', createPost);
router.delete('/posts/:id', deletePost);
router.post('/posts/:id/react', react);
router.get('/profile/:uid', getPublicProfile);

export default router;
