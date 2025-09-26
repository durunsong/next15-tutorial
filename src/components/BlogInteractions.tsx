'use client';

// 声明为 Client Component
import { useEffect, useState } from 'react';

interface BlogInteractionsProps {
  postId: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

// 模拟评论数据
const mockComments: Record<string, Comment[]> = {
  '1': [
    {
      id: '1',
      author: '张小明',
      content: '这篇文章写得非常详细，对 Server Components 的解释很到位！',
      timestamp: '2024-01-16 10:30',
    },
    {
      id: '2',
      author: '李小红',
      content: '学到了很多，期待更多关于 Next.js 15 的内容。',
      timestamp: '2024-01-16 14:20',
    },
  ],
  '2': [
    {
      id: '3',
      author: '王大力',
      content: 'Client Components 的最佳实践总结得很好，收藏了！',
      timestamp: '2024-01-21 09:15',
    },
  ],
  '3': [
    {
      id: '4',
      author: '赵小花',
      content: '全栈开发确实是未来的趋势，Next.js 15 太强大了。',
      timestamp: '2024-01-26 16:45',
    },
  ],
};

// 模拟点赞数据
const mockLikes: Record<string, number> = {
  '1': 42,
  '2': 28,
  '3': 35,
};

export default function BlogInteractions({ postId }: BlogInteractionsProps) {
  // 状态管理 - 只能在 Client Component 中使用
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  // 组件挂载时获取数据 - useEffect 只能在 Client Component 中使用
  useEffect(() => {
    // 模拟从 API 获取数据
    const loadData = async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 获取点赞数据
      setLikes(mockLikes[postId] || 0);

      // 获取评论数据
      setComments(mockComments[postId] || []);

      // 检查用户是否已点赞 (实际应用中从 localStorage 或服务器获取)
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      setIsLiked(likedPosts.includes(postId));
    };

    loadData();
  }, [postId]);

  // 点赞处理函数 - 交互逻辑只能在 Client Component 中实现
  const handleLike = async () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(prev => (newIsLiked ? prev + 1 : prev - 1));

    // 保存到 localStorage (实际应用中应该调用 API)
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    if (newIsLiked) {
      likedPosts.push(postId);
    } else {
      const index = likedPosts.indexOf(postId);
      if (index > -1) likedPosts.splice(index, 1);
    }
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

    // 模拟 API 调用
    try {
      const response = await fetch(`/api/blog/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: newIsLiked ? 'like' : 'unlike' }),
      });

      if (!response.ok) {
        // console.log('API not implemented yet, using mock data');
      }
    } catch (_error) {
      // console.log('API call failed, using local state');
    }
  };

  // 提交评论 - 表单处理只能在 Client Component 中实现
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !authorName.trim()) return;

    setIsSubmitting(true);

    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 创建新评论
      const comment: Comment = {
        id: Date.now().toString(),
        author: authorName.trim(),
        content: newComment.trim(),
        timestamp: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // 更新评论列表
      setComments(prev => [comment, ...prev]);

      // 清空表单
      setNewComment('');
      setAuthorName('');
      setShowCommentForm(false);

      // 模拟 API 调用
      try {
        const response = await fetch(`/api/blog/${postId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(comment),
        });

        if (!response.ok) {
          // console.log('API not implemented yet, using mock data');
        }
      } catch (_error) {
        // console.log('API call failed, using local state');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 文章互动统计 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">文章互动</h3>

        <div className="flex items-center gap-6">
          {/* 点赞按钮 */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isLiked
                ? 'bg-red-500 text-white shadow-md hover:bg-red-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isLiked ? 'scale-110' : ''}`}
              fill={isLiked ? 'white' : 'currentColor'}
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            {likes} {isLiked ? '已点赞' : '点赞'}
          </button>

          {/* 评论统计 */}
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            {comments.length} 条评论
          </div>
        </div>
      </div>

      {/* 评论区域 */}
      <div className="px-6 py-4">
        {/* 写评论按钮 */}
        {!showCommentForm && (
          <button
            onClick={() => setShowCommentForm(true)}
            className="w-full mb-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + 写下你的评论...
          </button>
        )}

        {/* 评论表单 */}
        {showCommentForm && (
          <form onSubmit={handleSubmitComment} className="mb-6 bg-gray-50 rounded-lg p-4">
            <div className="mb-4">
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">
                昵称
              </label>
              <input
                type="text"
                id="authorName"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入您的昵称"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                评论内容
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="分享你的想法..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim() || !authorName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? '发布中...' : '发布评论'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCommentForm(false);
                  setNewComment('');
                  setAuthorName('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        )}

        {/* 评论列表 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              <p>还没有评论，快来抢沙发吧！</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{comment.author}</h4>
                  <span className="text-sm text-gray-500">{comment.timestamp}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
