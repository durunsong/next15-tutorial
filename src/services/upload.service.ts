/**
 * 文件上传服务
 * 处理文件上传相关操作
 */
import { type ApiResponse, apiClient } from './api.client';

// 上传响应类型
export interface UploadResponse {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
}

// 支持的文件类型
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
] as const;

// 文件大小限制（字节）
export const FILE_SIZE_LIMITS = {
  avatar: 2 * 1024 * 1024, // 2MB
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * 文件上传服务类
 */
class UploadService {
  /**
   * 验证文件类型
   */
  validateFileType(file: File, allowedTypes: readonly string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  /**
   * 验证文件大小
   */
  validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
  }

  /**
   * 生成文件预览 URL
   */
  generatePreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * 清理预览 URL
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  /**
   * 上传头像
   */
  async uploadAvatar(file: File): Promise<ApiResponse<UploadResponse>> {
    // 验证文件类型
    if (!this.validateFileType(file, SUPPORTED_IMAGE_TYPES)) {
      return {
        success: false,
        error: '不支持的文件类型，请上传 JPEG、PNG、GIF 或 WebP 格式的图片',
      };
    }

    // 验证文件大小
    if (!this.validateFileSize(file, FILE_SIZE_LIMITS.avatar)) {
      return {
        success: false,
        error: `文件大小不能超过 ${FILE_SIZE_LIMITS.avatar / 1024 / 1024}MB`,
      };
    }

    return apiClient.upload<UploadResponse>('/upload/avatar', file, {
      requireAuth: true,
    });
  }

  /**
   * 上传图片
   */
  async uploadImage(file: File): Promise<ApiResponse<UploadResponse>> {
    // 验证文件类型
    if (!this.validateFileType(file, SUPPORTED_IMAGE_TYPES)) {
      return {
        success: false,
        error: '不支持的文件类型，请上传图片文件',
      };
    }

    // 验证文件大小
    if (!this.validateFileSize(file, FILE_SIZE_LIMITS.image)) {
      return {
        success: false,
        error: `文件大小不能超过 ${FILE_SIZE_LIMITS.image / 1024 / 1024}MB`,
      };
    }

    return apiClient.upload<UploadResponse>('/upload/image', file, {
      requireAuth: true,
    });
  }

  /**
   * 上传文档
   */
  async uploadDocument(file: File): Promise<ApiResponse<UploadResponse>> {
    // 验证文件类型
    if (!this.validateFileType(file, SUPPORTED_DOCUMENT_TYPES)) {
      return {
        success: false,
        error: '不支持的文件类型，请上传 PDF、Word 或文本文件',
      };
    }

    // 验证文件大小
    if (!this.validateFileSize(file, FILE_SIZE_LIMITS.document)) {
      return {
        success: false,
        error: `文件大小不能超过 ${FILE_SIZE_LIMITS.document / 1024 / 1024}MB`,
      };
    }

    return apiClient.upload<UploadResponse>('/upload/document', file, {
      requireAuth: true,
    });
  }

  /**
   * 批量上传文件
   */
  async uploadMultiple(
    files: File[],
    uploadType: 'avatar' | 'image' | 'document' = 'image'
  ): Promise<{
    successful: { file: File; result: UploadResponse }[];
    failed: { file: File; error: string }[];
  }> {
    const successful: { file: File; result: UploadResponse }[] = [];
    const failed: { file: File; error: string }[] = [];

    const uploadPromises = files.map(async file => {
      let result: ApiResponse<UploadResponse>;

      switch (uploadType) {
        case 'avatar':
          result = await this.uploadAvatar(file);
          break;
        case 'image':
          result = await this.uploadImage(file);
          break;
        case 'document':
          result = await this.uploadDocument(file);
          break;
        default:
          result = { success: false, error: '未知的上传类型' };
      }

      if (result.success && result.data) {
        successful.push({ file, result: result.data });
      } else {
        failed.push({ file, error: result.error || '上传失败' });
      }
    });

    await Promise.all(uploadPromises);

    return { successful, failed };
  }

  /**
   * 压缩图片（客户端压缩）
   */
  async compressImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 计算压缩后的尺寸
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // 绘制压缩后的图片
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          blob => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('图片压缩失败'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// 创建服务实例
export const uploadService = new UploadService();
