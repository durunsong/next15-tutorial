'use client';

import {
  ArrowRight,
  Copy,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Trash2,
  Upload,
} from 'lucide-react';

import { useCallback, useState } from 'react';

import NextImage from 'next/image';
import Link from 'next/link';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeEditor } from '@/components/CodeEditor';
import { DemoSection } from '@/components/DemoSection';
import { TutorialLayout } from '@/components/TutorialLayout';

// 文件上传演示组件
function FileUploadDemo() {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'profile-photo.jpg',
      size: 245760,
      type: 'image/jpeg',
      url: 'https://next-static-oss.oss-rg-china-mainland.aliyuncs.com/profile-photo.jpg',
      uploadedAt: '2024-01-15 10:30:00',
    },
    {
      id: 2,
      name: 'document.pdf',
      size: 1048576,
      type: 'application/pdf',
      url: 'https://next-static-oss.oss-rg-china-mainland.aliyuncs.com/document.pdf',
      uploadedAt: '2024-01-15 11:15:00',
    },
    {
      id: 3,
      name: 'presentation.pptx',
      size: 2097152,
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      url: 'https://next-static-oss.oss-rg-china-mainland.aliyuncs.com/presentation.pptx',
      uploadedAt: '2024-01-15 14:20:00',
    },
  ]);

  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-blue-600" />;
    if (type === 'application/pdf') return <FileText className="h-5 w-5 text-red-600" />;
    return <FileText className="h-5 w-5 text-gray-600" />;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    simulateUpload(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    simulateUpload(selectedFiles);
  };

  const simulateUpload = async (filesToUpload: File[]) => {
    setUploading(true);

    // 模拟上传过程
    for (const file of filesToUpload) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: `https://next-static-oss.oss-rg-china-mainland.aliyuncs.com/${file.name}`,
        uploadedAt: new Date().toLocaleString('zh-CN'),
      };

      setFiles(prev => [...prev, newFile]);
    }

    setUploading(false);
  };

  const deleteFile = (id: number) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL 已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 文件上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">上传文件到 OSS</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">拖拽文件到此处，或点击选择文件</p>
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
          <Upload className="h-4 w-4 mr-2" />
          选择文件
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          />
        </label>
        {uploading && (
          <div className="mt-4">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-600">上传中...</span>
            </div>
          </div>
        )}
      </div>

      {/* 文件列表 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white">已上传文件 ({files.length})</h4>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {files.map(file => (
            <div
              key={file.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)} • {file.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    title="预览"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => copyUrl(file.url)}
                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                    title="复制链接"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <a
                    href={file.url}
                    download={file.name}
                    className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                    title="下载"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="删除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {files.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">暂无文件</div>
          )}
        </div>
      </div>
    </div>
  );
}

// 图片处理演示组件
function ImageProcessingDemo() {
  const [processing, setProcessing] = useState({
    resize: { width: 400, height: 300 },
    quality: 80,
    format: 'jpg',
    watermark: false,
  });

  const baseImageUrl =
    'https://next-static-oss.oss-rg-china-mainland.aliyuncs.com/sample-image.jpg';

  const generateProcessedUrl = () => {
    const processParams = [];

    // 调整尺寸
    if (processing.resize.width || processing.resize.height) {
      processParams.push(
        `resize,w_${processing.resize.width || ''},h_${processing.resize.height || ''}`
      );
    }

    // 质量压缩
    if (processing.quality < 100) {
      processParams.push(`quality,q_${processing.quality}`);
    }

    // 格式转换
    if (processing.format !== 'jpg') {
      processParams.push(`format,${processing.format}`);
    }

    // 水印
    if (processing.watermark) {
      processParams.push('watermark,text_Sample,color_FFFFFF,size_20');
    }

    return processParams.length > 0
      ? `${baseImageUrl}?x-oss-process=image/${processParams.join('/')}`
      : baseImageUrl;
  };

  const processedUrl = generateProcessedUrl();

  const presets = [
    {
      name: '原图',
      params: { resize: { width: 0, height: 0 }, quality: 100, format: 'jpg', watermark: false },
    },
    {
      name: '缩略图',
      params: { resize: { width: 200, height: 150 }, quality: 80, format: 'jpg', watermark: false },
    },
    {
      name: '高压缩',
      params: {
        resize: { width: 400, height: 300 },
        quality: 50,
        format: 'webp',
        watermark: false,
      },
    },
    {
      name: '带水印',
      params: { resize: { width: 400, height: 300 }, quality: 80, format: 'jpg', watermark: true },
    },
  ];

  return (
    <div className="space-y-6">
      {/* 处理参数控制 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">图片处理参数</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 尺寸调整 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              尺寸调整
            </label>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="宽度"
                value={processing.resize.width || ''}
                onChange={e =>
                  setProcessing(prev => ({
                    ...prev,
                    resize: { ...prev.resize, width: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="高度"
                value={processing.resize.height || ''}
                onChange={e =>
                  setProcessing(prev => ({
                    ...prev,
                    resize: { ...prev.resize, height: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* 质量压缩 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              质量 ({processing.quality}%)
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={processing.quality}
              onChange={e =>
                setProcessing(prev => ({ ...prev, quality: parseInt(e.target.value) }))
              }
              className="w-full"
            />
          </div>

          {/* 格式转换 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              格式转换
            </label>
            <select
              value={processing.format}
              onChange={e => setProcessing(prev => ({ ...prev, format: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
              <option value="gif">GIF</option>
            </select>
          </div>

          {/* 水印 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              其他处理
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={processing.watermark}
                onChange={e => setProcessing(prev => ({ ...prev, watermark: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">添加水印</span>
            </label>
          </div>
        </div>

        {/* 预设选项 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            快速预设
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map(preset => (
              <button
                key={preset.name}
                onClick={() => setProcessing(preset.params)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 图片对比 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">原始图片</h4>
          <div className="aspect-w-16 aspect-h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <NextImage
              src={baseImageUrl}
              alt="原始图片"
              className="w-full h-48 object-cover"
              width={400}
              height={300}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">原始尺寸，未处理</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">处理后图片</h4>
          <div className="aspect-w-16 aspect-h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <NextImage
              src={processedUrl}
              alt="处理后图片"
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {processing.resize.width}×{processing.resize.height} • {processing.quality}% •{' '}
              {processing.format.toUpperCase()}
            </p>
            <div className="mt-2">
              <label className="text-xs text-gray-400">处理后 URL:</label>
              <input
                type="text"
                value={processedUrl}
                readOnly
                className="w-full mt-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OSSTutorial() {
  const setupCode = `// lib/oss.ts
import OSS from 'ali-oss';

// OSS 客户端配置
export const ossClient = new OSS({
  region: process.env.OSS_REGION!, // 例如：'oss-rg-china-mainland'
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.OSS_BUCKET!, // 例如：'next-static-oss'
});

// 获取文件 URL
export function getOSSUrl(filename: string): string {
  return \`\${process.env.BASE_OSS_URL}/\${filename}\`;
}

// 生成唯一文件名
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const extension = originalName.split('.').pop();
  return \`\${timestamp}-\${random}.\${extension}\`;
}

// 文件上传工具类
export class OSSManager {
  // 上传文件
  static async uploadFile(
    file: File | Buffer,
    filename: string,
    options?: {
      folder?: string;
      metadata?: Record<string, string>;
    }
  ): Promise<{ url: string; filename: string }> {
    try {
      const { folder = '', metadata = {} } = options || {};
      const fullPath = folder ? \`\${folder}/\${filename}\` : filename;

      const result = await ossClient.put(fullPath, file, {
        meta: {
          ...metadata,
          uploadTime: new Date().toISOString(),
        }
      });

      return {
        url: result.url,
        filename: fullPath
      };
    } catch (error) {
      console.error('OSS upload error:', error);
      throw new Error('文件上传失败');
    }
  }

  // 删除文件
  static async deleteFile(filename: string): Promise<boolean> {
    try {
      await ossClient.delete(filename);
      return true;
    } catch (error) {
      console.error('OSS delete error:', error);
      return false;
    }
  }

  // 批量删除文件
  static async deleteFiles(filenames: string[]): Promise<void> {
    try {
      await ossClient.deleteMulti(filenames);
    } catch (error) {
      console.error('OSS batch delete error:', error);
      throw new Error('批量删除失败');
    }
  }

  // 检查文件是否存在
  static async fileExists(filename: string): Promise<boolean> {
    try {
      await ossClient.head(filename);
      return true;
    } catch (error) {
      return false;
    }
  }

  // 获取文件信息
  static async getFileInfo(filename: string) {
    try {
      const result = await ossClient.head(filename);
      return {
        size: parseInt(result.res.headers['content-length'] || '0'),
        contentType: result.res.headers['content-type'],
        lastModified: result.res.headers['last-modified'],
        etag: result.res.headers.etag,
      };
    } catch (error) {
      throw new Error('获取文件信息失败');
    }
  }
}`;

  const uploadApiCode = `// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OSSManager, generateUniqueFilename } from '@/lib/oss';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: '未选择文件' },
        { status: 400 }
      );
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型' },
        { status: 400 }
      );
    }

    // 检查文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小超过限制' },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const filename = generateUniqueFilename(file.name);

    // 转换 File 为 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 上传到 OSS
    const result = await OSSManager.uploadFile(buffer, filename, {
      folder,
      metadata: {
        originalName: file.name,
        size: file.size.toString(),
        type: file.type,
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        filename: result.filename,
        url: result.url,
        originalName: file.name,
        size: file.size,
        type: file.type,
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '上传失败' },
      { status: 500 }
    );
  }
}`;

  const clientUploadCode = `// components/FileUpload.tsx
'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Check } from 'lucide-react';

interface UploadedFile {
  filename: string;
  url: string;
  originalName: string;
  size: number;
  type: string;
}

export function FileUpload({ onUploadComplete }: {
  onUploadComplete?: (files: UploadedFile[]) => void
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'user-uploads');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(\`上传失败: \${file.name}\`);
      }

      const result = await response.json();
      return result.data;
    });

    try {
      const results = await Promise.all(uploadPromises);
      setUploadedFiles(prev => [...prev, ...results]);
      onUploadComplete?.(results);
    } catch (error) {
      console.error('Upload error:', error);
      alert('部分文件上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFiles(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  };

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      <div
        className={\`border-2 border-dashed rounded-lg p-8 text-center transition-colors \${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }\`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          上传文件
        </h3>
        <p className="text-gray-600 mb-4">
          拖拽文件到此处，或点击选择文件
        </p>
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
          选择文件
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,application/pdf"
          />
        </label>
        {uploading && (
          <div className="mt-4">
            <div className="text-blue-600">上传中...</div>
          </div>
        )}
      </div>

      {/* 文件列表 */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">已上传文件</h4>
          {uploadedFiles.map((file) => (
            <div key={file.filename} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">{file.originalName}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                查看
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`;

  return (
    <TutorialLayout
      title="阿里云 OSS 教程"
      description="学习使用阿里云对象存储服务 (OSS) 实现文件上传、存储和图片处理功能"
      prevTutorial={{
        title: 'Redis 缓存',
        href: '/tutorials/redis',
      }}
      nextTutorial={{
        title: 'Zustand 状态管理',
        href: '/tutorials/zustand',
      }}
    >
      <div className="space-y-12">
        {/* 简介 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            什么是阿里云 OSS？
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p>
              阿里云对象存储服务 (OSS) 是一款海量、安全、低成本、高可靠的云存储服务。
              它提供了丰富的文件存储和处理功能，特别适合 Web 应用的静态资源存储。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Upload className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">文件上传</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  支持多种文件格式的上传和存储
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <ImageIcon className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">图片处理</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  实时图片缩放、裁剪、水印等处理
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <FileText className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">CDN 加速</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  全球内容分发网络，快速访问
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 设置和配置 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">OSS 设置和配置</h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              首先需要在阿里云控制台创建 OSS Bucket，获取访问密钥， 然后在 Next.js 项目中配置 OSS
              客户端。
            </p>
          </div>

          <CodeBlock code={setupCode} language="typescript" filename="lib/oss.ts" />

          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">环境变量配置</h4>
            <CodeBlock
              code={`# .env.local
OSS_ACCESS_KEY_ID="your_access_key_id_here"
OSS_ACCESS_KEY_SECRET="your_access_key_secret_here"
OSS_REGION="oss-rg-china-mainland"
OSS_BUCKET="your-bucket-name"
BASE_OSS_URL="https://your-bucket-name.oss-rg-china-mainland.aliyuncs.com"`}
              language="bash"
              filename=".env.local"
            />
          </div>
        </section>

        {/* API 路由实现 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            文件上传 API 实现
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>创建 API 路由来处理文件上传和删除操作，包含文件类型验证、 大小限制和错误处理。</p>
          </div>

          <CodeBlock code={uploadApiCode} language="typescript" filename="API 路由实现" />
        </section>

        {/* 文件上传演示 */}
        <DemoSection
          title="文件上传演示"
          description="体验完整的文件上传流程，包括拖拽上传、进度显示和文件管理"
          demoComponent={<FileUploadDemo />}
          codeComponent={
            <CodeBlock code={clientUploadCode} language="tsx" filename="客户端上传组件" />
          }
        />

        {/* 图片处理 */}
        <DemoSection
          title="图片处理功能"
          description="利用 OSS 的图片处理服务实现实时的图片缩放、压缩、格式转换等"
          demoComponent={<ImageProcessingDemo />}
          codeComponent={
            <CodeBlock code="// 图片处理功能演示" language="typescript" filename="图片处理" />
          }
        />

        {/* 安全性和最佳实践 */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            安全性和最佳实践
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">安全配置</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  使用 RAM 用户和最小权限原则
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  配置 Bucket 访问策略和防盗链
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  启用服务端加密 (SSE)
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  使用 HTTPS 传输数据
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">性能优化</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  启用 CDN 加速服务
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  合理规划文件存储结构
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  使用图片处理服务优化加载
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  配置生命周期管理规则
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 互动编辑器 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">OSS 操作练习</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            尝试编写 OSS 相关代码，掌握文件存储和处理技巧：
          </p>

          <CodeEditor
            title="OSS 操作练习场"
            defaultCode={`// OSS 文件操作练习
import { OSSManager } from '@/lib/oss';

// 练习 1: 文件上传
async function uploadFile(file: File) {
  try {
    const filename = \`upload-\${Date.now()}-\${file.name}\`;
    const result = await OSSManager.uploadFile(file, filename, {
      folder: 'user-uploads',
      metadata: {
        originalName: file.name,
        uploadedBy: 'user-123'
      }
    });

    console.log('上传成功:', result.url);
    return result;
  } catch (error) {
    console.error('上传失败:', error);
    return null;
  }
}

// 练习 2: 生成图片处理 URL
function generateThumbnail(originalUrl: string) {
  const processParams = [
    'resize,w_200,h_200',
    'quality,q_80',
    'format,webp'
  ].join('/');

  const thumbnailUrl = \`\${originalUrl}?x-oss-process=image/\${processParams}\`;
  console.log('缩略图 URL:', thumbnailUrl);
  return thumbnailUrl;
}

// 运行示例
console.log('OSS 操作练习开始');
const imageUrl = 'https://example.com/sample-image.jpg';
generateThumbnail(imageUrl);`}
            language="typescript"
            height="400px"
            onRun={code => console.log('执行 OSS 代码:', code)}
            showConsole
          />
        </section>

        {/* 下一步 */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">准备好了吗？</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            现在你已经掌握了阿里云 OSS 的核心功能，让我们继续学习 Zustand 状态管理。
          </p>
          <Link
            href="/tutorials/zustand"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            学习 Zustand 状态管理
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </section>
      </div>
    </TutorialLayout>
  );
}
