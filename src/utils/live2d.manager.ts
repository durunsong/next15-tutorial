/*
  Lightweight Live2D manager built on top of the CDN live2d-widget script.
  It provides: init, show/hide, switch model, showMessage, idle and route tips, and a basic context menu.
*/

export type Live2DManagerOptions = {
  modelPaths: string[];
  width?: number;
  height?: number;
  position?: 'left' | 'right';
  hOffset?: number;
  vOffset?: number;
  idleTips?: string[];
  routeTips?: string[];
  // container?: HTMLElement; // not used: always attach to document.body to avoid React lifecycle conflicts
};

declare global {
  interface Window {
    L2Dwidget?: any;
    __L2D_WIDGET_INITED?: boolean;
  }
}

const DEFAULT_MODEL = 'https://unpkg.com/live2d-widget-model-shizuku/assets/shizuku.model.json';

export class Live2DManager {
  private static singleton: Live2DManager | null = null;

  static get instance(): Live2DManager {
    if (!this.singleton) this.singleton = new Live2DManager();
    return this.singleton;
  }

  private options: Live2DManagerOptions | null = null;
  private currentModelIndex = 0;
  private idleTimer: any = null;
  private messageBoxEl: HTMLDivElement | null = null;
  private menuEl: HTMLDivElement | null = null;
  private containerEl: HTMLElement | null = null;

  init(options: Live2DManagerOptions) {
    if (this.options) return; // idempotent
    this.options = options;
    this.currentModelIndex = 0;

    // Always attach to document.body so React doesn't try to own/remove these nodes
    this.containerEl = document.body;
    this.createMessageBox();
    this.createContextMenu();
    this.bindVisibilityAndRouteTips();

    this.loadModel(this.getCurrentModelPath());
    this.startIdleTips();
  }

  private getCurrentModelPath(): string {
    const list = this.options?.modelPaths ?? [];
    return list[this.currentModelIndex] || DEFAULT_MODEL;
  }

  private getCanvas(): HTMLCanvasElement | null {
    return (
      (document.querySelector('#live2dcanvas') as HTMLCanvasElement | null) ||
      (document.querySelector('canvas#live2d-widget') as HTMLCanvasElement | null) ||
      (document.querySelector('canvas[id*="live2d"]') as HTMLCanvasElement | null)
    );
  }

  private removeExistingCanvas() {
    // Avoid manual DOM removals; widget will manage lifecycle.
  }

  loadModel(modelPath: string) {
    if (typeof window === 'undefined') return;
    if (!window.L2Dwidget || typeof window.L2Dwidget.init !== 'function') return;
    this.removeExistingCanvas();
    window.L2Dwidget.init({
      model: {
        jsonPath: modelPath,
      },
      display: {
        position: (this.options?.position ?? 'right') as any,
        width: this.options?.width ?? 180,
        height: this.options?.height ?? 260,
        hOffset: this.options?.hOffset ?? 10,
        vOffset: this.options?.vOffset ?? -20,
      },
      mobile: { show: true },
      react: { opacityDefault: 1, opacityOnHover: 1 },
    });
  }

  switchToNextModel() {
    const list = this.options?.modelPaths ?? [];
    if (list.length === 0) return;
    this.currentModelIndex = (this.currentModelIndex + 1) % list.length;
    this.loadModel(this.getCurrentModelPath());
    this.showMessage('已切换角色', 2000);
  }

  show() {
    const canvas = this.getCanvas();
    if (canvas) canvas.style.display = 'block';
  }

  hide() {
    const canvas = this.getCanvas();
    if (canvas) canvas.style.display = 'none';
  }

  showMessage(text: string, durationMs = 3000) {
    if (!this.messageBoxEl) return;
    this.messageBoxEl.textContent = text;
    this.messageBoxEl.style.opacity = '1';
    this.messageBoxEl.style.transform = 'translateY(0)';
    const d = durationMs;
    window.setTimeout(() => {
      if (!this.messageBoxEl) return;
      this.messageBoxEl.style.opacity = '0';
      this.messageBoxEl.style.transform = 'translateY(8px)';
    }, d);
  }

  private startIdleTips() {
    const tips = this.options?.idleTips ?? [];
    if (this.idleTimer) window.clearInterval(this.idleTimer);
    if (tips.length === 0) return;
    this.idleTimer = window.setInterval(() => {
      const tip = tips[Math.floor(Math.random() * tips.length)];
      this.showMessage(tip, 3500);
    }, 20000);
  }

  private bindVisibilityAndRouteTips() {
    const routeTips = this.options?.routeTips ?? [];
    const handler = () => {
      if (routeTips.length === 0) return;
      const tip = routeTips[Math.floor(Math.random() * routeTips.length)];
      this.showMessage(tip, 2500);
    };
    window.addEventListener('popstate', handler);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) handler();
    });
  }

  private createMessageBox() {
    const el = document.createElement('div');
    el.id = 'l2d-message-box';
    Object.assign(el.style, {
      position: 'fixed',
      right: '12px',
      bottom: '300px',
      maxWidth: '260px',
      background: 'rgba(0,0,0,0.7)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '10px',
      fontSize: '12px',
      lineHeight: '1.5',
      zIndex: '10000',
      opacity: '0',
      transition: 'opacity .25s, transform .25s',
      transform: 'translateY(8px)',
      pointerEvents: 'none',
    } as CSSStyleDeclaration);
    (this.containerEl ?? document.body).appendChild(el);
    this.messageBoxEl = el;
  }

  private createContextMenu() {
    const menu = document.createElement('div');
    menu.id = 'l2d-context-menu';
    Object.assign(menu.style, {
      position: 'fixed',
      right: '12px',
      bottom: '260px',
      background: 'rgba(255,255,255,0.95)',
      border: '1px solid rgba(0,0,0,0.1)',
      borderRadius: '8px',
      padding: '6px',
      fontSize: '12px',
      zIndex: '10000',
      display: 'none',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    } as CSSStyleDeclaration);

    const addItem = (label: string, onClick: () => void) => {
      const item = document.createElement('div');
      item.textContent = label;
      Object.assign(item.style, {
        padding: '6px 10px',
        cursor: 'pointer',
        borderRadius: '6px',
      } as CSSStyleDeclaration);
      item.onmouseenter = () => (item.style.background = 'rgba(0,0,0,0.06)');
      item.onmouseleave = () => (item.style.background = 'transparent');
      item.onclick = () => {
        onClick();
        menu.style.display = 'none';
      };
      menu.appendChild(item);
    };

    addItem('切换角色', () => this.switchToNextModel());
    addItem('隐藏', () => this.hide());
    addItem('显示', () => this.show());
    addItem('打个招呼', () => this.showMessage('你好呀～'));

    (this.containerEl ?? document.body).appendChild(menu);
    this.menuEl = menu;

    document.addEventListener('contextmenu', e => {
      const target = e.target as HTMLElement;
      if (this.getCanvas() && (target === this.getCanvas() || target.closest('canvas'))) {
        e.preventDefault();
        menu.style.display = 'block';
      }
    });
    document.addEventListener('click', () => {
      if (menu.style.display === 'block') menu.style.display = 'none';
    });
  }
}

export const live2dManager = Live2DManager.instance;
