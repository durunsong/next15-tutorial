'use client';

import { useEffect, useRef } from 'react';

// 动态导入ECharts以减少初始包大小
// 移除unused的EChartsCore，直接在useEffect中动态导入

interface EChartsProps {
  option: any; // 暂时使用any，避免导入echarts类型
  style?: React.CSSProperties;
  className?: string;
}

export default function EChartsComponent({ option, style, className }: EChartsProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any | null>(null);

  useEffect(() => {
    // 动态导入echarts
    const initChart = async () => {
      try {
        const [
          { init },
          { CanvasRenderer },
          { BarChart, LineChart, PieChart },
          { GridComponent, TooltipComponent, TitleComponent, LegendComponent },
        ] = await Promise.all([
          import('echarts/core'),
          import('echarts/renderers'),
          import('echarts/charts'),
          import('echarts/components'),
        ]);

        // 注册必要的组件
        const echarts = await import('echarts/core');
        echarts.use([
          CanvasRenderer,
          BarChart,
          LineChart,
          PieChart,
          GridComponent,
          TooltipComponent,
          TitleComponent,
          LegendComponent,
        ]);

        // 延迟初始化，避免在主进程中调用
        const timer = setTimeout(() => {
          if (chartRef.current && !chartInstance.current) {
            try {
              chartInstance.current = init(chartRef.current);
              // 设置图表配置
              chartInstance.current.setOption(option, true);
            } catch (error) {
              console.error('ECharts 初始化错误:', error);
            }
          } else if (chartInstance.current) {
            // 更新已存在的图表
            chartInstance.current.setOption(option, true);
          }
        }, 100);

        // 响应窗口大小变化
        const handleResize = () => {
          chartInstance.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        // 清理函数
        return () => {
          clearTimeout(timer);
          window.removeEventListener('resize', handleResize);
          if (chartInstance.current) {
            chartInstance.current.dispose();
            chartInstance.current = null;
          }
        };
      } catch (error) {
        console.error('ECharts 动态导入失败:', error);
      }
    };

    initChart();
  }, [option]);

  return (
    <div className="w-full h-full">
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '400px',
          ...style,
        }}
        className={className}
      />
    </div>
  );
}

/**
 * 使用说明：
 *
 * 这个组件通过动态导入优化了ECharts的加载：
 * 1. 只导入需要的图表类型和组件，减少包大小
 * 2. 运行时按需加载，提升首屏性能
 * 3. 支持服务端渲染时跳过图表初始化
 * 4. 自动处理窗口大小变化
 *
 * 使用示例：
 * <EChartsComponent
 *   option={yourChartOption}
 *   style={{ height: '300px' }}
 * />
 */
