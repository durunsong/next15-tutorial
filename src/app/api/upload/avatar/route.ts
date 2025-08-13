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
    // 验证认证
    let token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      const cookies = request.headers.get('cookie');
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
        }
      }
    }

    if (!token) {
      return NextResponse.json({ error: '未找到认证令牌' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get('avatar') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: '没有找到文件' }, { status: 400 });
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型。请上传 JPEG、PNG、GIF 或 WebP 格式的图片' },
        { status: 400 }
      );
    }

    // 检查文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: '文件大小不能超过 5MB' }, { status: 400 });
    }

    // 转换文件为Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成唯一文件名
    const fileExtension = file.name.split('.').pop();
    const fileName = `avatars/${decoded.userId}_${Date.now()}.${fileExtension}`;

    // 初始化OSS客户端
    const client = createOSSClient();

    // 上传到OSS
    const result = await client.put(fileName, buffer, {
      headers: {
        'Content-Type': file.type,
        'Cache-Control': 'public, max-age=31536000', // 1年缓存
      },
    });

    // 构造完整的文件URL
    const baseUrl = process.env.BASE_OSS_URL;
    const fileUrl = `${baseUrl}/${fileName}`;

    return NextResponse.json({
      message: '头像上传成功',
      avatarUrl: fileUrl,
      ossResult: {
        name: result.name,
        url: result.url,
      },
    });
  } catch (error) {
    console.error('头像上传失败:', error);
    return NextResponse.json({ error: '上传失败，请重试' }, { status: 500 });
  }
}
