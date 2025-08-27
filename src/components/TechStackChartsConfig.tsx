// ECharts 配置文件 - 优化为按需导入配置
// 注意：这里只导出配置对象，不导入 echarts 以减少包大小

// 技术栈使用统计（柱状图）
export const techUsageOption = {
  title: {
    text: '🚀 技术栈使用频率',
    textStyle: {
      color: '#06b6d4',
      fontSize: 18,
      fontWeight: 'bold',
    },
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#06b6d4',
    borderWidth: 2,
    textStyle: {
      color: '#333',
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['React', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Tailwind'],
    axisLabel: {
      color: '#64748b',
    },
    axisLine: {
      lineStyle: {
        color: '#e2e8f0',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#64748b',
    },
    axisLine: {
      lineStyle: {
        color: '#e2e8f0',
      },
    },
    splitLine: {
      lineStyle: {
        color: '#f1f5f9',
      },
    },
  },
  series: [
    {
      data: [
        { value: 95, itemStyle: { color: '#3b82f6' } },
        { value: 90, itemStyle: { color: '#06b6d4' } },
        { value: 88, itemStyle: { color: '#8b5cf6' } },
        { value: 85, itemStyle: { color: '#10b981' } },
        { value: 82, itemStyle: { color: '#f59e0b' } },
        { value: 78, itemStyle: { color: '#ef4444' } },
        { value: 92, itemStyle: { color: '#84cc16' } },
      ],
      type: 'bar',
      barWidth: '60%',
      label: {
        show: true,
        position: 'top',
        color: '#64748b',
      },
    },
  ],
  animation: true,
  animationDuration: 1000,
};

// 学习路径进度（环形图）
export const learningProgressOption = {
  title: {
    text: '📚 学习路径进度',
    textStyle: {
      color: '#8b5cf6',
      fontSize: 18,
      fontWeight: 'bold',
    },
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#8b5cf6',
    borderWidth: 2,
    formatter: '{a} <br/>{b}: {c}% ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: {
      color: '#64748b',
    },
  },
  series: [
    {
      name: '学习进度',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 100, name: 'React 基础', itemStyle: { color: '#3b82f6' } },
        { value: 90, name: 'TypeScript', itemStyle: { color: '#06b6d4' } },
        { value: 85, name: 'Next.js', itemStyle: { color: '#8b5cf6' } },
        { value: 75, name: 'Node.js', itemStyle: { color: '#10b981' } },
        { value: 60, name: '数据库', itemStyle: { color: '#f59e0b' } },
        { value: 45, name: '部署运维', itemStyle: { color: '#ef4444' } },
      ],
    },
  ],
  animation: true,
  animationDuration: 1500,
};

// 技能雷达图
export const skillRadarOption = {
  title: {
    text: '🎯 技能雷达图',
    textStyle: {
      color: '#10b981',
      fontSize: 18,
      fontWeight: 'bold',
    },
    left: 'center',
  },
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#10b981',
    borderWidth: 2,
  },
  radar: {
    indicator: [
      { name: '前端开发', max: 100 },
      { name: '后端开发', max: 100 },
      { name: '数据库', max: 100 },
      { name: 'DevOps', max: 100 },
      { name: 'UI/UX', max: 100 },
      { name: '性能优化', max: 100 },
    ],
    shape: 'polygon',
    splitNumber: 4,
    axisName: {
      color: '#64748b',
    },
    splitLine: {
      lineStyle: {
        color: '#e2e8f0',
      },
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)'],
      },
    },
  },
  series: [
    {
      name: '技能水平',
      type: 'radar',
      data: [
        {
          value: [90, 75, 80, 60, 85, 88],
          name: '当前水平',
          itemStyle: {
            color: '#10b981',
          },
          areaStyle: {
            color: 'rgba(16, 185, 129, 0.3)',
          },
        },
        {
          value: [95, 85, 90, 80, 90, 95],
          name: '目标水平',
          itemStyle: {
            color: '#3b82f6',
          },
          areaStyle: {
            color: 'rgba(59, 130, 246, 0.2)',
          },
        },
      ],
    },
  ],
  animation: true,
  animationDuration: 2000,
};

// 月度活跃度（折线图）
export const monthlyActivityOption = {
  title: {
    text: '📈 月度学习活跃度',
    textStyle: {
      color: '#f59e0b',
      fontSize: 18,
      fontWeight: 'bold',
    },
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#f59e0b',
    borderWidth: 2,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLabel: {
      color: '#64748b',
    },
    axisLine: {
      lineStyle: {
        color: '#e2e8f0',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#64748b',
    },
    axisLine: {
      lineStyle: {
        color: '#e2e8f0',
      },
    },
    splitLine: {
      lineStyle: {
        color: '#f1f5f9',
      },
    },
  },
  series: [
    {
      name: '学习时长(小时)',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        color: '#f59e0b',
        width: 3,
      },
      itemStyle: {
        color: '#f59e0b',
      },
      areaStyle: {
        color: 'rgba(245, 158, 11, 0.2)',
      },
      data: [45, 52, 38, 65, 72, 48, 55, 62, 58, 68, 75, 82],
    },
    {
      name: '项目数量',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        color: '#06b6d4',
        width: 3,
      },
      itemStyle: {
        color: '#06b6d4',
      },
      areaStyle: {
        color: 'rgba(6, 182, 212, 0.2)',
      },
      data: [8, 12, 6, 15, 18, 10, 13, 16, 14, 17, 20, 22],
    },
  ],
  animation: true,
  animationDuration: 1200,
};

/**
 * 使用说明：
 *
 * 这些配置对象不直接导入 echarts，避免增加包大小。
 * 在使用时通过 EChartsComponent 组件动态加载图表库。
 *
 * 使用示例：
 * import { techUsageOption } from './TechStackChartsConfig';
 * <EChartsComponent option={techUsageOption} />
 */
