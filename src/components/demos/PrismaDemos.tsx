'use client';

import { useState } from 'react';
import { Database, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

// Prisma Schema 构建演示
export function PrismaSchemaDemo() {
  const [selectedModel, setSelectedModel] = useState('User');
  const [models, setModels] = useState({
    User: {
      fields: [
        { name: 'id', type: 'String', attributes: '@id @default(uuid())' },
        { name: 'email', type: 'String', attributes: '@unique' },
        { name: 'name', type: 'String', attributes: '?' },
        { name: 'posts', type: 'Post[]', attributes: '' },
        { name: 'createdAt', type: 'DateTime', attributes: '@default(now())' }
      ]
    },
    Post: {
      fields: [
        { name: 'id', type: 'String', attributes: '@id @default(uuid())' },
        { name: 'title', type: 'String', attributes: '' },
        { name: 'content', type: 'String', attributes: '?' },
        { name: 'published', type: 'Boolean', attributes: '@default(false)' },
        { name: 'author', type: 'User', attributes: '' },
        { name: 'authorId', type: 'String', attributes: '' }
      ]
    }
  });
  
  const [newField, setNewField] = useState({ name: '', type: '', attributes: '' });
  
  const fieldTypes = ['String', 'Int', 'Float', 'Boolean', 'DateTime', 'Json'];
  
  const addField = () => {
    if (newField.name && newField.type) {
      setModels(prev => ({
        ...prev,
        [selectedModel]: {
          ...prev[selectedModel as keyof typeof prev],
          fields: [
            ...prev[selectedModel as keyof typeof prev].fields,
            { ...newField }
          ]
        }
      }));
      setNewField({ name: '', type: '', attributes: '' });
    }
  };
  
  const removeField = (index: number) => {
    setModels(prev => ({
      ...prev,
      [selectedModel]: {
        ...prev[selectedModel as keyof typeof prev],
        fields: prev[selectedModel as keyof typeof prev].fields.filter((_, i) => i !== index)
      }
    }));
  };
  
  const generateSchema = () => {
    return Object.entries(models).map(([modelName, model]) => {
      const fields = model.fields.map(field => 
        `  ${field.name} ${field.type} ${field.attributes}`
      ).join('\n');
      
      return `model ${modelName} {\n${fields}\n}`;
    }).join('\n\n');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        {Object.keys(models).map(modelName => (
          <button
            key={modelName}
            onClick={() => setSelectedModel(modelName)}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
              selectedModel === modelName
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {modelName}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold">编辑 {selectedModel} 模型</h4>
          
          <div className="space-y-2">
            {models[selectedModel as keyof typeof models].fields.map((field, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex-1 font-mono text-sm">
                  <span className="text-blue-600">{field.name}</span>
                  <span className="text-gray-600 mx-2">{field.type}</span>
                  <span className="text-green-600">{field.attributes}</span>
                </div>
                <button
                  onClick={() => removeField(index)}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium mb-2">添加新字段</h5>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="字段名"
                value={newField.name}
                onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <select
                value={newField.type}
                onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">选择类型</option>
                {fieldTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="属性 (如: @unique, @default(now()))"
                value={newField.attributes}
                onChange={(e) => setNewField(prev => ({ ...prev, attributes: e.target.value }))}
                className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                onClick={addField}
                className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>添加字段</span>
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">生成的 Schema</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
            <pre>{generateSchema()}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// Prisma 查询演示
export function PrismaQueryDemo() {
  const [selectedOperation, setSelectedOperation] = useState('findMany');
  const [queryParams, setQueryParams] = useState({
    where: '',
    select: '',
    include: '',
    orderBy: '',
    take: '',
    skip: ''
  });
  
  const operations = [
    { id: 'findMany', name: '查询多条', description: '获取多条记录' },
    { id: 'findUnique', name: '查询单条', description: '根据唯一字段查询' },
    { id: 'create', name: '创建', description: '创建新记录' },
    { id: 'update', name: '更新', description: '更新现有记录' },
    { id: 'delete', name: '删除', description: '删除记录' },
    { id: 'upsert', name: '创建或更新', description: '存在则更新，不存在则创建' }
  ];
  
  const generateQuery = () => {
    let query = `await prisma.user.${selectedOperation}({\n`;
    
    if (selectedOperation === 'findMany' || selectedOperation === 'findUnique') {
      if (queryParams.where) {
        query += `  where: ${queryParams.where},\n`;
      }
      if (queryParams.select) {
        query += `  select: ${queryParams.select},\n`;
      }
      if (queryParams.include) {
        query += `  include: ${queryParams.include},\n`;
      }
      if (queryParams.orderBy && selectedOperation === 'findMany') {
        query += `  orderBy: ${queryParams.orderBy},\n`;
      }
      if (queryParams.take && selectedOperation === 'findMany') {
        query += `  take: ${queryParams.take},\n`;
      }
      if (queryParams.skip && selectedOperation === 'findMany') {
        query += `  skip: ${queryParams.skip},\n`;
      }
    } else if (selectedOperation === 'create') {
      query += `  data: {\n    email: "user@example.com",\n    name: "新用户"\n  },\n`;
      if (queryParams.select) {
        query += `  select: ${queryParams.select},\n`;
      }
    } else if (selectedOperation === 'update') {
      query += `  where: { id: "user-id" },\n`;
      query += `  data: {\n    name: "更新的用户名"\n  },\n`;
      if (queryParams.select) {
        query += `  select: ${queryParams.select},\n`;
      }
    } else if (selectedOperation === 'delete') {
      query += `  where: { id: "user-id" },\n`;
    } else if (selectedOperation === 'upsert') {
      query += `  where: { email: "user@example.com" },\n`;
      query += `  update: {\n    name: "更新的用户名"\n  },\n`;
      query += `  create: {\n    email: "user@example.com",\n    name: "新用户"\n  },\n`;
    }
    
    query += '});';
    return query;
  };
  
  const exampleQueries = {
    findMany: [
      { label: '基础查询', value: '' },
      { label: '条件查询', value: '{ published: true }' },
      { label: '模糊搜索', value: '{ title: { contains: "Next.js" } }' },
      { label: '日期范围', value: '{ createdAt: { gte: new Date("2024-01-01") } }' }
    ],
    select: [
      { label: '选择字段', value: '{ id: true, name: true, email: true }' },
      { label: '计算字段', value: '{ id: true, _count: { posts: true } }' }
    ],
    include: [
      { label: '包含关联', value: '{ posts: true }' },
      { label: '嵌套包含', value: '{ posts: { include: { comments: true } } }' }
    ]
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {operations.map(op => (
          <button
            key={op.id}
            onClick={() => setSelectedOperation(op.id)}
            className={`p-2 text-sm rounded-lg transition-colors ${
              selectedOperation === op.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {op.name}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold">查询参数</h4>
          
          {(selectedOperation === 'findMany' || selectedOperation === 'findUnique') && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Where 条件</label>
                <div className="space-y-1">
                  <select
                    onChange={(e) => setQueryParams(prev => ({ ...prev, where: e.target.value }))}
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">选择示例或自定义</option>
                    {exampleQueries.findMany.map((example, index) => (
                      <option key={index} value={example.value}>{example.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="自定义 where 条件"
                    value={queryParams.where}
                    onChange={(e) => setQueryParams(prev => ({ ...prev, where: e.target.value }))}
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Select 字段</label>
                <select
                  onChange={(e) => setQueryParams(prev => ({ ...prev, select: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">选择示例</option>
                  {exampleQueries.select.map((example, index) => (
                    <option key={index} value={example.value}>{example.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Include 关联</label>
                <select
                  onChange={(e) => setQueryParams(prev => ({ ...prev, include: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">选择示例</option>
                  {exampleQueries.include.map((example, index) => (
                    <option key={index} value={example.value}>{example.label}</option>
                  ))}
                </select>
              </div>
              
              {selectedOperation === 'findMany' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">排序 (orderBy)</label>
                    <input
                      type="text"
                      placeholder="如: { createdAt: 'desc' }"
                      value={queryParams.orderBy}
                      onChange={(e) => setQueryParams(prev => ({ ...prev, orderBy: e.target.value }))}
                      className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">限制条数 (take)</label>
                      <input
                        type="number"
                        placeholder="10"
                        value={queryParams.take}
                        onChange={(e) => setQueryParams(prev => ({ ...prev, take: e.target.value }))}
                        className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">跳过条数 (skip)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={queryParams.skip}
                        onChange={(e) => setQueryParams(prev => ({ ...prev, skip: e.target.value }))}
                        className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">生成的 Prisma 查询</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
            <pre>{generateQuery()}</pre>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>操作描述:</strong> {operations.find(op => op.id === selectedOperation)?.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
