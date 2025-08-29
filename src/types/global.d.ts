// 全局类型定义文件

declare global {
  interface Window {
    OML2D?: any;
  }
}

// CSS 模块类型声明
declare module '*.css' {
  const content: any;
  export default content;
}

declare module '*.scss' {
  const content: any;
  export default content;
}

declare module '*.sass' {
  const content: any;
  export default content;
}

export {};
