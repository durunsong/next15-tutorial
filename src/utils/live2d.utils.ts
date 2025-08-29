// Live2D 工具函数
export class Live2DUtils {
  /**
   * 显示自定义消息
   * @param message 要显示的消息
   * @param duration 显示时长（毫秒）
   */
  static showMessage(message: string, duration: number = 3000) {
    if (window.OML2D) {
      window.OML2D.tipsMessage(message, duration);
    }
  }

  /**
   * 切换到下一个模型
   */
  static switchToNextModel() {
    if (window.OML2D) {
      window.OML2D.loadNextModel();
    }
  }

  /**
   * 切换到指定索引的模型
   * @param index 模型索引
   */
  static switchToModel(index: number) {
    if (window.OML2D) {
      window.OML2D.loadModel(index);
    }
  }

  /**
   * 隐藏Live2D
   */
  static hide() {
    if (window.OML2D) {
      window.OML2D.stageSlideDown();
    }
  }

  /**
   * 显示Live2D
   */
  static show() {
    if (window.OML2D) {
      window.OML2D.stageSlideUp();
    }
  }

  /**
   * 销毁Live2D实例
   */
  static destroy() {
    if (window.OML2D) {
      window.OML2D.destroy();
      window.OML2D = undefined;
    }
  }

  /**
   * 清除当前显示的提示
   */
  static clearTips() {
    if (window.OML2D) {
      window.OML2D.clearTips();
    }
  }

  /**
   * 检查Live2D是否已初始化
   */
  static isInitialized(): boolean {
    return !!window.OML2D;
  }

  /**
   * 根据时间显示不同的问候语
   */
  static showTimeBasedGreeting() {
    const hour = new Date().getHours();
    let greeting = '';

    if (hour >= 5 && hour < 12) {
      greeting = '早上好！新的一天开始了，要加油哦！🌅';
    } else if (hour >= 12 && hour < 14) {
      greeting = '中午好！记得要好好吃午饭哦！🍽️';
    } else if (hour >= 14 && hour < 18) {
      greeting = '下午好！下午的时光也要充满活力！☀️';
    } else if (hour >= 18 && hour < 22) {
      greeting = '晚上好！今天过得怎么样呢？🌙';
    } else {
      greeting = '夜深了，记得早点休息哦！💤';
    }

    this.showMessage(greeting, 4000);
  }

  /**
   * 显示鼓励消息
   */
  static showEncouragement() {
    const encouragements = [
      '你今天做得很棒！继续保持！💪',
      '相信自己，你一定可以的！✨',
      '每一步都是进步，加油！🎯',
      '困难只是成长的阶梯！🌟',
      '你比想象中更强大！💖',
      '今天的努力会成就明天的你！🚀',
    ];

    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    this.showMessage(randomEncouragement, 4000);
  }

  /**
   * 显示学习提示
   */
  static showStudyTip() {
    const studyTips = [
      '记得要劳逸结合，适当休息很重要！😊',
      '学习时保持专注，效率会更高哦！📚',
      '遇到问题不要怕，多思考多练习！🤔',
      '知识需要反复巩固，复习很重要！📖',
      '保持好奇心，学习会更有趣！🔍',
      '记得记笔记，好记性不如烂笔头！✏️',
    ];

    const randomTip = studyTips[Math.floor(Math.random() * studyTips.length)];
    this.showMessage(randomTip, 5000);
  }

  /**
   * 显示天气相关提示（可以结合API）
   */
  static showWeatherTip() {
    const weatherTips = [
      '记得根据天气情况调整穿着哦！👕',
      '今天适合出门走走，呼吸新鲜空气！🌿',
      '天气变化记得保护好自己！🛡️',
      '下雨天在家学习也很棒！☔',
      '阳光明媚的日子，心情也会变好！☀️',
    ];

    const randomWeatherTip = weatherTips[Math.floor(Math.random() * weatherTips.length)];
    this.showMessage(randomWeatherTip, 4000);
  }

  /**
   * 创建互动游戏
   */
  static startMiniGame() {
    if (!this.isInitialized()) return;

    const games = [
      () => {
        this.showMessage('我们来玩猜数字游戏！我想的数字是1-10之间的...', 3000);
        setTimeout(() => {
          const number = Math.floor(Math.random() * 10) + 1;
          this.showMessage(`答案是 ${number}！你猜对了吗？😄`, 4000);
        }, 3500);
      },
      () => {
        this.showMessage('让我来表演一个魔术！✨', 2000);
        setTimeout(() => {
          this.hide();
          setTimeout(() => {
            this.show();
            this.showMessage('哒哒！我又回来了！厉害吧？🎩', 3000);
          }, 2000);
        }, 2500);
      },
      () => {
        this.showMessage('我们来玩成语接龙！我先来：学而时习之...', 3000);
        setTimeout(() => {
          this.showMessage('你想到了什么成语呢？😊', 3000);
        }, 3500);
      },
    ];

    const randomGame = games[Math.floor(Math.random() * games.length)];
    randomGame();
  }
}

// 导出一些常用的快捷函数
export const {
  showMessage,
  switchToNextModel,
  hide: hideLive2D,
  show: showLive2D,
  showTimeBasedGreeting,
  showEncouragement,
  showStudyTip,
  startMiniGame,
} = Live2DUtils;
