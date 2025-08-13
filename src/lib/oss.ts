import OSS from 'ali-oss';

// 检查必需的环境变量
if (!process.env.OSS_ACCESS_KEY_ID || !process.env.OSS_ACCESS_KEY_SECRET || !process.env.OSS_REGION || !process.env.OSS_BUCKET) {
  console.warn('OSS 配置缺失，某些功能可能无法使用');
}

// OSS 客户端配置
export const ossClient = new OSS({
  region: process.env.OSS_REGION || 'oss-rg-china-mainland',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
  bucket: process.env.OSS_BUCKET || '',
});

// 获取文件 URL
export function getOSSUrl(filename: string): string {
  const baseUrl = process.env.BASE_OSS_URL;
  if (!baseUrl) {
    return `https://${process.env.OSS_BUCKET}.${process.env.OSS_REGION}.aliyuncs.com/${filename}`;
  }
  return `${baseUrl}/${filename}`;
}

// 生成唯一文件名
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
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
      const fullPath = folder ? `${folder}/${filename}` : filename;
      
      const result = await ossClient.put(fullPath, file, {
        meta: {
          ...metadata,
          uploadTime: new Date().toISOString(),
          uid: 1,
          pid: 1
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
      const headers = result.res.headers as any;
      return {
        size: parseInt(headers['content-length'] || '0'),
        contentType: headers['content-type'] || '',
        lastModified: headers['last-modified'] || '',
        etag: headers.etag || '',
      };
    } catch (error) {
      throw new Error('获取文件信息失败');
    }
  }

  // 生成签名 URL
  static async generateSignedUrl(filename: string, expires: number = 3600): Promise<string> {
    try {
      return await ossClient.signatureUrl(filename, { expires });
    } catch (error) {
      console.error('OSS generate signed URL error:', error);
      throw new Error('生成签名 URL 失败');
    }
  }
}

// 图片处理参数构建
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

export function buildImageProcessUrl(
  originalUrl: string, 
  options: ImageProcessOptions
): string {
  const processes: string[] = [];

  // 尺寸调整
  if (options.resize) {
    const { width, height, mode = 'lfit' } = options.resize;
    let resizeParam = `resize,m_${mode}`;
    if (width) resizeParam += `,w_${width}`;
    if (height) resizeParam += `,h_${height}`;
    processes.push(resizeParam);
  }

  // 裁剪
  if (options.crop) {
    const { width, height, x, y, gravity } = options.crop;
    let cropParam = `crop,w_${width},h_${height}`;
    if (gravity) cropParam += `,g_${gravity}`;
    if (x !== undefined) cropParam += `,x_${x}`;
    if (y !== undefined) cropParam += `,y_${y}`;
    processes.push(cropParam);
  }

  // 旋转
  if (options.rotate) {
    processes.push(`rotate,${options.rotate}`);
  }

  // 质量
  if (options.quality !== undefined) {
    processes.push(`quality,q_${options.quality}`);
  }

  // 格式转换
  if (options.format) {
    processes.push(`format,${options.format}`);
  }

  // 水印
  if (options.watermark) {
    const { text, image, position = 'br', opacity = 100 } = options.watermark;
    if (text) {
      processes.push(`watermark,text_${encodeURIComponent(text)},g_${position},t_${opacity}`);
    } else if (image) {
      processes.push(`watermark,image_${encodeURIComponent(image)},g_${position},t_${opacity}`);
    }
  }

  // 模糊
  if (options.blur) {
    processes.push(`blur,r_${options.blur}`);
  }

  // 亮度
  if (options.brightness) {
    processes.push(`bright,${options.brightness}`);
  }

  // 对比度
  if (options.contrast) {
    processes.push(`contrast,${options.contrast}`);
  }

  if (processes.length === 0) {
    return originalUrl;
  }

  const processParam = processes.join('/');
  const separator = originalUrl.includes('?') ? '&' : '?';
  return `${originalUrl}${separator}x-oss-process=image/${processParam}`;
}

// 预设的图片处理配置
export const ImagePresets = {
  thumbnail: (width = 200, height = 200): ImageProcessOptions => ({
    resize: { width, height, mode: 'fill' },
    quality: 80,
    format: 'webp'
  }),

  avatar: (size = 100): ImageProcessOptions => ({
    resize: { width: size, height: size, mode: 'fill' },
    crop: { width: size, height: size, gravity: 'center' },
    quality: 85,
    format: 'webp'
  }),

  banner: (width = 1200, height = 400): ImageProcessOptions => ({
    resize: { width, height, mode: 'fill' },
    quality: 90,
    format: 'webp'
  }),

  watermarked: (text: string): ImageProcessOptions => ({
    quality: 90,
    watermark: {
      text,
      position: 'br',
      opacity: 60
    }
  })
};