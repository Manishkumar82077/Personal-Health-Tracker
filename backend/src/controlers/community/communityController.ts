import { Request, Response, NextFunction } from 'express';
import * as community from '../../services/community.service';

export const listPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Math.min(Number(req.query.limit) || 20, 50) : 20;
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
    res.json(await community.listPosts(req.uid, limit, cursor));
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const { text } = req.body ?? {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'text is required' } });
    return;
  }
  try {
    res.status(201).json(await community.createPost(req.uid, req.userEmail, text));
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await community.deletePost(req.uid, req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const listComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await community.listComments(req.params.id as string));
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  const { text } = req.body ?? {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'text is required' } });
    return;
  }
  try {
    res.status(201).json(await community.addComment(req.uid, req.userEmail, req.params.id as string, text));
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await community.toggleLike(req.uid, req.params.id as string));
  } catch (err) {
    next(err);
  }
};

export const getPublicProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await community.getPublicProfile(req.params.uid as string));
  } catch (err) {
    next(err);
  }
};
