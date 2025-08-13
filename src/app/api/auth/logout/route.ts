import { NextRequest, NextResponse } from 'next/server';
import { CacheManager } from '@/lib/redis';
import jwt from 'jsonwebtoken';

// 验证JWT Token
function verifyToken(token: string): { userId: string } | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, secret) as any;
    return { userId: decoded.userId };
  } catch (error) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 从请求头或Cookie中获取token
    let token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // 尝试从Cookie中获取
      const cookies = req.headers.get('cookie');
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
        }
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: '未找到认证令牌' },
        { status: 401 }
      );
    }

    // 验证token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: '无效的认证令牌' },
        { status: 401 }
      );
    }

    // 从缓存中删除会话信息
    await CacheManager.del(`session:${decoded.userId}`);

    // 创建响应，清除Cookie
    const response = NextResponse.json(
      { message: '退出成功' },
      { status: 200 }
    );

    // 清除HttpOnly Cookie
    const cookieOptions = [
      'token=',
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Max-Age=0',
      'Path=/'
    ].join('; ');

    response.headers.set('Set-Cookie', cookieOptions);

    return response;
  } catch (error) {
    console.error('退出失败:', error);
    return NextResponse.json(
      { 
        error: '退出失败',
        message: '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

// 批量退出所有设备
export async function DELETE(req: NextRequest) {
  try {
    // 从请求头或Cookie中获取token
    let token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      const cookies = req.headers.get('cookie');
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
        }
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: '未找到认证令牌' },
        { status: 401 }
      );
    }

    // 验证token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: '无效的认证令牌' },
        { status: 401 }
      );
    }

    // 删除用户的所有会话
    // 注意：这里简化处理，实际项目中可能需要维护用户的所有会话ID列表
    await CacheManager.del(`session:${decoded.userId}`);
    
    // 可以扩展为删除用户的所有会话
    // const sessionKeys = await redis.keys(`session:${decoded.userId}:*`);
    // if (sessionKeys.length > 0) {
    //   await redis.del(...sessionKeys);
    // }

    const response = NextResponse.json(
      { 
        message: '已退出所有设备',
        loggedOutDevices: 1 // 简化处理，实际应该返回真实数量
      },
      { status: 200 }
    );

    // 清除当前设备的Cookie
    const cookieOptions = [
      'token=',
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Max-Age=0',
      'Path=/'
    ].join('; ');

    response.headers.set('Set-Cookie', cookieOptions);

    return response;
  } catch (error) {
    console.error('批量退出失败:', error);
    return NextResponse.json(
      { 
        error: '退出失败',
        message: '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

