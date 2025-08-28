'use client';

import { useState } from 'react';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('请选择文件');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log('开始上传文件:', {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      const formData = new FormData();
      formData.append('avatar', file);

      // 显示FormData内容
      console.log('FormData entries:');
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
        if (value instanceof File) {
          console.log('文件详情:', {
            name: value.name,
            type: value.type,
            size: value.size,
          });
        }
      }

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      console.log('响应状态:', response.status);
      console.log('响应头:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('响应原始内容:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { error: '响应不是有效的JSON', raw: responseText };
      }

      setResult({
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('上传错误:', error);
      setResult({
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">头像上传测试页面</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">选择图片文件:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {file && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">选中的文件:</h3>
            <ul className="text-sm space-y-1">
              <li><strong>文件名:</strong> {file.name}</li>
              <li><strong>文件类型:</strong> {file.type}</li>
              <li><strong>文件大小:</strong> {file.size} bytes</li>
              <li><strong>最后修改:</strong> {new Date(file.lastModified).toLocaleString()}</li>
            </ul>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? '上传中...' : '开始上传'}
        </button>

        {result && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium mb-3">上传结果:</h3>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
