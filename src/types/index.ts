export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  slug: string;
  published: boolean;
  featured: boolean;
  viewCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: User;
  categoryId?: string;
  category?: Category;
  tags?: Tag[];
  comments?: Comment[];
  likes?: Like[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  color: string;
  posts?: Post[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  posts?: Post[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: User;
  postId: string;
  post?: Post;
  parentId?: string;
  parent?: Comment;
  replies?: Comment[];
}

export interface Like {
  id: string;
  createdAt: Date;
  userId: string;
  user?: User;
  postId: string;
  post?: Post;
}

export interface Session {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  userId: string;
  user?: User;
}

export interface Upload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  bucket: string;
  folder?: string;
  createdAt: Date;
}

export interface SiteStats {
  id: string;
  date: Date;
  pageViews: number;
  uniqueUsers: number;
  posts: number;
  comments: number;
  likes: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TutorialSection {
  id: string;
  title: string;
  content: string;
  order: number;
  codeExamples?: CodeExample[];
}

export interface CodeExample {
  id: string;
  title?: string;
  code: string;
  language: string;
  filename?: string;
  description?: string;
  runnable?: boolean;
}

export interface TechStackItem {
  name: string;
  description: string;
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'tools';
  features: string[];
  tutorialLink?: string;
  officialLink: string;
  version: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  color: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read?: boolean;
}

export interface CacheConfig {
  key: string;
  ttl?: number;
  tags?: string[];
}

export interface FileUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  folder?: string;
  generateThumbnail?: boolean;
}

export interface FileUploadResult {
  filename: string;
  url: string;
  originalName: string;
  size: number;
  type: string;
}

export interface ImageProcessOptions {
  resize?: {
    width?: number;
    height?: number;
    mode?: 'lfit' | 'mfit' | 'fill' | 'pad' | 'fixed';
  };
  crop?: {
    width: number;
    height: number;
    x?: number;
    y?: number;
    gravity?: 'nw' | 'north' | 'ne' | 'west' | 'center' | 'east' | 'sw' | 'south' | 'se';
  };
  rotate?: number;
  quality?: number;
  format?: 'jpg' | 'png' | 'webp' | 'gif' | 'bmp';
  watermark?: {
    text?: string;
    image?: string;
    position?: 'tl' | 't' | 'tr' | 'l' | 'c' | 'r' | 'bl' | 'b' | 'br';
    opacity?: number;
  };
  blur?: number;
  brightness?: number;
  contrast?: number;
}
