// 测试头像上传的脚本
const fs = require('fs');
const path = require('path');

async function testAvatarUpload() {
  try {
    // 创建一个测试图片的FormData
    const FormData = require('form-data');
    const form = new FormData();
    
    // 创建一个简单的测试图片 (1x1 PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG 文件头
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 尺寸
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
      0x54, 0x78, 0x9C, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x5D, 0xB4, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
      0x42, 0x60, 0x82
    ]);
    
    form.append('avatar', testImageBuffer, {
      filename: 'test-avatar.png',
      contentType: 'image/png'
    });

    console.log('准备测试头像上传...');
    console.log('测试图片大小:', testImageBuffer.length, 'bytes');
    
    const response = await fetch('http://localhost:3000/api/upload/avatar', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token', // 使用测试token
        ...form.getHeaders()
      },
      body: form
    });

    const result = await response.text();
    console.log('响应状态:', response.status);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));
    console.log('响应内容:', result);

  } catch (error) {
    console.error('测试失败:', error);
  }
}

testAvatarUpload();
