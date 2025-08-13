/**
 * 文件上传 Hook
 * 封装文件上传逻辑，提供进度跟踪、错误处理等功能
 */
import { message } from 'antd';

import { useCallback, useState } from 'react';

import { type UploadResponse, uploadService } from '@/services';

// 上传状态接口
export interface UploadState {
  loading: boolean;
  progress: number;
  error: string | null;
  result: UploadResponse | null;
}

// 批量上传状态
export interface BatchUploadState {
  loading: boolean;
  completed: number;
  total: number;
  successful: { file: File; result: UploadResponse }[];
  failed: { file: File; error: string }[];
}

/**
 * 单文件上传 Hook
 */
export function useUpload(uploadType: 'avatar' | 'image' | 'document' = 'image') {
  const [state, setState] = useState<UploadState>({
    loading: false,
    progress: 0,
    error: null,
    result: null,
  });

  /**
   * 上传文件
   */
  const upload = useCallback(
    async (file: File) => {
      setState({
        loading: true,
        progress: 0,
        error: null,
        result: null,
      });

      try {
        let result;

        switch (uploadType) {
          case 'avatar':
            result = await uploadService.uploadAvatar(file);
            break;
          case 'image':
            result = await uploadService.uploadImage(file);
            break;
          case 'document':
            result = await uploadService.uploadDocument(file);
            break;
          default:
            throw new Error('不支持的上传类型');
        }

        if (result.success && result.data) {
          setState({
            loading: false,
            progress: 100,
            error: null,
            result: result.data,
          });

          message.success('文件上传成功！');
          return { success: true, data: result.data };
        } else {
          setState({
            loading: false,
            progress: 0,
            error: result.error || '上传失败',
            result: null,
          });

          message.error(result.error || '上传失败');
          return { success: false, error: result.error };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '上传失败';

        setState({
          loading: false,
          progress: 0,
          error: errorMsg,
          result: null,
        });

        message.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [uploadType]
  );

  /**
   * 上传前预处理（如图片压缩）
   */
  const uploadWithPreprocess = useCallback(
    async (
      file: File,
      options?: {
        compress?: boolean;
        maxWidth?: number;
        maxHeight?: number;
        quality?: number;
      }
    ) => {
      let processedFile = file;

      // 如果是图片类型且需要压缩
      if (options?.compress && uploadType !== 'document' && file.type.startsWith('image/')) {
        try {
          setState(prev => ({ ...prev, loading: true, progress: 10 }));

          processedFile = await uploadService.compressImage(
            file,
            options.maxWidth,
            options.maxHeight,
            options.quality
          );

          setState(prev => ({ ...prev, progress: 30 }));
          message.info('图片压缩完成，开始上传...');
        } catch (error) {
          console.warn('图片压缩失败，使用原文件上传:', error);
        }
      }

      return upload(processedFile);
    },
    [upload, uploadType]
  );

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setState({
      loading: false,
      progress: 0,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    upload,
    uploadWithPreprocess,
    reset,
  };
}

/**
 * 批量上传 Hook
 */
export function useBatchUpload(uploadType: 'avatar' | 'image' | 'document' = 'image') {
  const [state, setState] = useState<BatchUploadState>({
    loading: false,
    completed: 0,
    total: 0,
    successful: [],
    failed: [],
  });

  /**
   * 批量上传文件
   */
  const uploadMultiple = useCallback(
    async (files: File[]) => {
      setState({
        loading: true,
        completed: 0,
        total: files.length,
        successful: [],
        failed: [],
      });

      try {
        const result = await uploadService.uploadMultiple(files, uploadType);

        setState({
          loading: false,
          completed: files.length,
          total: files.length,
          successful: result.successful,
          failed: result.failed,
        });

        // 显示结果消息
        if (result.successful.length > 0) {
          message.success(`成功上传 ${result.successful.length} 个文件`);
        }

        if (result.failed.length > 0) {
          message.error(`${result.failed.length} 个文件上传失败`);
        }

        return result;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '批量上传失败';

        setState({
          loading: false,
          completed: 0,
          total: files.length,
          successful: [],
          failed: files.map(file => ({ file, error: errorMsg })),
        });

        message.error(errorMsg);
        return { successful: [], failed: files.map(file => ({ file, error: errorMsg })) };
      }
    },
    [uploadType]
  );

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setState({
      loading: false,
      completed: 0,
      total: 0,
      successful: [],
      failed: [],
    });
  }, []);

  return {
    ...state,
    uploadMultiple,
    reset,
  };
}

/**
 * 文件预览 Hook
 */
export function useFilePreview() {
  const [previewUrls, setPreviewUrls] = useState<Map<File, string>>(new Map());

  /**
   * 生成预览 URL
   */
  const generatePreview = useCallback(
    (file: File) => {
      if (previewUrls.has(file)) {
        return previewUrls.get(file)!;
      }

      const url = uploadService.generatePreviewUrl(file);
      setPreviewUrls(prev => new Map(prev).set(file, url));
      return url;
    },
    [previewUrls]
  );

  /**
   * 清理预览 URL
   */
  const clearPreview = useCallback(
    (file: File) => {
      const url = previewUrls.get(file);
      if (url) {
        uploadService.revokePreviewUrl(url);
        setPreviewUrls(prev => {
          const newMap = new Map(prev);
          newMap.delete(file);
          return newMap;
        });
      }
    },
    [previewUrls]
  );

  /**
   * 清理所有预览 URL
   */
  const clearAllPreviews = useCallback(() => {
    previewUrls.forEach(url => uploadService.revokePreviewUrl(url));
    setPreviewUrls(new Map());
  }, [previewUrls]);

  return {
    generatePreview,
    clearPreview,
    clearAllPreviews,
  };
}
