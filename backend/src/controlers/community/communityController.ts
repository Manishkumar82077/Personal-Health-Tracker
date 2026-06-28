import { Request, Response, NextFunction } from 'express';
import * as community from '../../services/community.service';
import { ALLOWED_REACTIONS } from '../../interface/post.model';

export const listPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Math.min(Number(req.query.limit) || 50, 100) : 50;
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
    res.json(await community.listPosts(req.uid, limit, cursor));
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const { text, replyToId } = req.body ?? {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'text is required' } });
    return;
  }
  try {
    res.status(201).json(await community.createPost(
      req.uid, req.userEmail, text,
      typeof replyToId === 'string' ? replyToId : undefined,
    ));
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

export const react = async (req: Request, res: Response, next: NextFunction) => {
  const { emoji } = req.body ?? {};
  if (!emoji || !ALLOWED_REACTIONS.includes(emoji)) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'valid emoji is required' } });
    return;
  }
  try {
    res.json(await community.react(req.uid, req.params.id as string, emoji));
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
