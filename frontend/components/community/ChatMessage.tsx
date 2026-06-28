'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LuSmilePlus, LuReply, LuTrash2 } from 'react-icons/lu';
import type { Post } from '@/lib/types';
import { REACTIONS } from '@/lib/types';
import { reactToPost, deletePost } from '@/lib/api';
import { timeAgo } from '@/lib/date';

interface Props {
  post: Post;
  currentUid?: string;
  onReply: (post: Post) => void;
  onChanged: () => void;
}

export function ChatMessage({ post, currentUid, onReply, onChanged }: Props) {
  const own = currentUid === post.authorUid;
  const [reactions, setReactions] = useState(post.reactions ?? {});
  const [mine, setMine] = useState<string | null>(post.myReaction ?? null);
  const [picker, setPicker] = useState(false);

  const react = async (emoji: string) => {
    setPicker(false);
    // optimistic
    const prev = { reactions, mine };
    const next = { ...reactions };
    const dec = (e: string) => { next[e] = Math.max(0, (next[e] ?? 0) - 1); if (!next[e]) delete next[e]; };
    if (mine === emoji) { dec(emoji); setMine(null); }
    else { if (mine) dec(mine); next[emoji] = (next[emoji] ?? 0) + 1; setMine(emoji); }
    setReactions(next);
    try {
      const res = await reactToPost(post.id, emoji);
      setReactions(res.reactions);
      setMine(res.myReaction);
    } catch {
      setReactions(prev.reactions);
      setMine(prev.mine);
    }
  };

  const remove = async () => { await deletePost(post.id); onChanged(); };

  const chips = Object.entries(reactions).filter(([, n]) => n > 0);

  return (
    <div className={`flex gap-2 ${own ? 'flex-row-reverse' : ''}`}>
      {!own && (
        <Link href={`/community/profile/${post.authorUid}`}
          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0 self-end">
          {post.authorName.charAt(0).toUpperCase()}
        </Link>
      )}

      <div className={`group relative max-w-[78%] ${own ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-3 py-2 ${
          own
            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-br-md'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-md'
        }`}>
          {!own && (
            <Link href={`/community/profile/${post.authorUid}`}
              className="block text-xs font-semibold text-gray-500 dark:text-gray-400 hover:underline mb-0.5">
              {post.authorName}
            </Link>
          )}

          {post.replyTo && (
            <div className={`text-xs rounded-lg px-2 py-1 mb-1 border-l-2 ${
              own ? 'bg-white/15 border-white/40' : 'bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600'
            }`}>
              <span className="font-semibold">{post.replyTo.authorName}</span>
              <p className="opacity-80 line-clamp-2">{post.replyTo.text}</p>
            </div>
          )}

          <p className="text-sm whitespace-pre-wrap break-words">{post.text}</p>
          <span className={`block text-[10px] mt-0.5 ${own ? 'text-white/60 dark:text-gray-900/60' : 'text-gray-400'} text-right`}>
            {timeAgo(post.createdAt)}
          </span>
        </div>

        {/* Reaction chips */}
        {chips.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${own ? 'justify-end' : ''}`}>
            {chips.map(([emoji, n]) => (
              <button key={emoji} onClick={() => react(emoji)}
                className={`flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border transition-colors ${
                  mine === emoji
                    ? 'bg-rose-50 dark:bg-rose-950 border-rose-300 dark:border-rose-800'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}>
                <span>{emoji}</span>
                <span className="tabular-nums text-gray-500 dark:text-gray-400">{n}</span>
              </button>
            ))}
          </div>
        )}

        {/* Hover actions */}
        <div className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${own ? 'justify-end' : ''}`}>
          <div className="relative">
            <button onClick={() => setPicker(p => !p)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-0.5">
              <LuSmilePlus className="w-4 h-4" />
            </button>
            {picker && (
              <div className={`absolute z-10 bottom-7 ${own ? 'right-0' : 'left-0'} flex gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg px-2 py-1`}>
                {REACTIONS.map(e => (
                  <button key={e} onClick={() => react(e)} className="text-lg hover:scale-125 transition-transform">{e}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => onReply(post)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-0.5">
            <LuReply className="w-4 h-4" />
          </button>
          {own && (
            <button onClick={remove} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-0.5">
              <LuTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
