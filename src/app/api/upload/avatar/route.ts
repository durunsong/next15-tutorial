import OSS from 'ali-oss';
import jwt from 'jsonwebtoken';

import { NextRequest, NextResponse } from 'next/server';

// 验证JWT Token
function verifyToken(token: string): { userId: string } | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, secret) as { userId: string };
    return {
      userId: decoded.userId,
    };
  } catch {
    return null;
  }
}

// 初始化OSS客户端
function createOSSClient() {
  const region = process.env.ALIBABA_CLOUD_OSS_REGION;
  const accessKeyId = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
  const accessKeySecret = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
  const bucket = process.env.ALIBABA_CLOUD_OSS_BUCKET;

  if (!region || !accessKeyId || !accessKeySecret || !bucket) {
    throw new Error('OSS配置不完整，请检查环境变量');
  }

  return new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
  });
}

export async function POST(request: NextRequest) {
  try {
    // 添加详细的调试日志
    console.log('=== 头像上传开始 ===');
    console.log('请求头:', Object.fromEntries(request.headers.entries()));

    // 验证认证
    let token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('Authorization token:', token ? 'Found' : 'Not found');

    if (!token) {
      const cookies = request.headers.get('cookie');
      if (cookies) {
        console.log('Cookies found, checking for token...');
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
          console.log('Token found in cookies');
        }
      }
    }

    if (!token) {
      console.log('错误: 未找到认证令牌');
      return NextResponse.json({ error: '未找到认证令牌' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('错误: 无效的认证令牌');
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 });
    }
    console.log('用户验证成功:', decoded.userId);

    const data = await request.formData();
    console.log('FormData keys:', Array.from(data.keys()));

    const file: File | null = data.get('avatar') as unknown as File;
    console.log(
      '文件信息:',
      file ? { name: file.name, type: file.type, size: file.size } : 'No file'
    );

    if (!file) {
      console.log('错误: 没有找到文件');
      return NextResponse.json({ error: '没有找到文件' }, { status: 400 });
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    console.log('文件类型检查:', file.type, 'allowed:', allowedTypes.includes(file.type));
    if (!allowedTypes.includes(file.type)) {
      console.log('错误: 不支持的文件类型');
      return NextResponse.json(
        { error: '不支持的文件类型。请上传 JPEG、PNG、GIF 或 WebP 格式的图片' },
        { status: 400 }
      );
    }

    // 检查文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    console.log('文件大小检查:', file.size, 'max:', maxSize);
    if (file.size > maxSize) {
      console.log('错误: 文件大小超过限制');
      return NextResponse.json({ error: '文件大小不能超过 5MB' }, { status: 400 });
    }

    // 转换文件为Buffer
    console.log('开始转换文件为Buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('Buffer转换完成，大小:', buffer.length);

    // 生成唯一文件名
    const fileExtension = file.name.split('.').pop();
    const fileName = `avatars/${decoded.userId}_${Date.now()}.${fileExtension}`;
    console.log('生成文件名:', fileName);

    // 检查环境变量
    const envVars = {
      region: process.env.ALIBABA_CLOUD_OSS_REGION,
      accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
      accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET ? '***' : undefined,
      bucket: process.env.ALIBABA_CLOUD_OSS_BUCKET,
      baseUrl: process.env.BASE_OSS_URL,
    };
    console.log('环境变量检查:', envVars);

    // 检查是否有OSS配置，如果没有则使用本地存储
    const hasOSSConfig =
      envVars.region && envVars.accessKeyId && envVars.accessKeySecret && envVars.bucket;

    let fileUrl: string;

    if (hasOSSConfig) {
      console.log('使用OSS存储...');
      // 初始化OSS客户端
      console.log('初始化OSS客户端...');
      const client = createOSSClient();

      // 上传到OSS
      console.log('开始上传到OSS...');
      const result = await client.put(fileName, buffer, {
        headers: {
          'Content-Type': file.type,
          'Cache-Control': 'public, max-age=31536000', // 1年缓存
        },
      });
      console.log('OSS上传结果:', { name: result.name, url: result.url });

      // 构造完整的文件URL
      const baseUrl = process.env.BASE_OSS_URL;
      fileUrl = `${baseUrl}/${fileName}`;
      console.log('构造OSS文件URL:', fileUrl);
    } else {
      console.log('OSS配置不完整，检查环境...');
      
      // 检查是否在Vercel等serverless环境中
      const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY;
      
      if (isServerless) {
        console.log('检测到serverless环境，使用base64存储...');
        // Serverless环境：将图片转换为base64存储
        const base64Data = buffer.toString('base64');
        const mimeType = file.type;
        const dataUrl = `data:${mimeType};base64,${base64Data}`;
        
        console.log('Base64转换完成，大小:', base64Data.length);
        
        // 返回data URL，前端可以直接使用
        fileUrl = dataUrl;
        console.log('构造base64 URL完成');
        
      } else {
        console.log('本地环境，使用文件存储...');
        // 本地开发环境：文件存储
        const fs = await import('fs/promises');
        const path = await import('path');
        
        // 确保uploads目录存在
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const avatarsDir = path.join(uploadsDir, 'avatars');
        
        try {
          await fs.mkdir(avatarsDir, { recursive: true });
        } catch (error) {
          console.log('目录创建警告:', error);
        }
        
        // 保存文件到本地
        const localFileName = `${decoded.userId}_${Date.now()}.${fileExtension}`;
        const localFilePath = path.join(avatarsDir, localFileName);
        
        await fs.writeFile(localFilePath, buffer);
        console.log('本地文件保存成功:', localFilePath);
        
        // 构造本地文件URL
        fileUrl = `/uploads/avatars/${localFileName}`;
        console.log('构造本地文件URL:', fileUrl);
      }
    }

    const response = {
      message: '头像上传成功',
      avatarUrl: fileUrl,
    };
    console.log('成功响应:', response);
    console.log('=== 头像上传成功 ===');

    return NextResponse.json(response);
  } catch (error) {
    console.error('=== 头像上传失败 ===');
    console.error('错误详情:', error);
    console.error('错误类型:', typeof error);
    console.error('错误消息:', error instanceof Error ? error.message : String(error));
    console.error('错误堆栈:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json(
      {
        error: '上传失败，请重试',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
