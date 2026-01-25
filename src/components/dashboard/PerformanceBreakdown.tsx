"use client";

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CHART_COLORS } from '@/lib/design-tokens';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';

export function PerformanceBreakdown() {
  const [selectedBar, setSelectedBar] = useState<string | null>(null);

  // Mock data with performance levels
  const data = [
    { subject: 'النحو', score: 92, target: 90, status: 'excellent' },
    { subject: 'البلاغة', score: 85, target: 90, status: 'good' },
    { subject: 'الأدب', score: 78, target: 90, status: 'average' },
    { subject: 'القراءة', score: 95, target: 90, status: 'excellent' },
    { subject: 'التعبير', score: 68, target: 90, status: 'needs-improvement' },
    { subject: 'الإملاء', score: 88, target: 90, status: 'good' },
  ];

  // Color coding based on performance level
  const getColor = (score: number) => {
    if (score >= 90) return CHART_COLORS.hex.success; // Green - Excellent
    if (score >= 80) return CHART_COLORS.hex.info;    // Blue - Good
    if (score >= 70) return CHART_COLORS.hex.warning; // Orange - Average
    return CHART_COLORS.hex.error;                     // Red - Needs Improvement
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      'excellent': { text: 'ممتاز', color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
      'good': { text: 'جيد', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
      'average': { text: 'متوسط', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
      'needs-improvement': { text: 'يحتاج تحسين', color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
    };
    return labels[status] || labels['average'];
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const statusLabel = getStatusLabel(data.status);
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl">
          <p className="font-bold text-foreground mb-2">{data.subject}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-sm">الدرجة:</span>
              <span className="font-bold text-foreground">{data.score}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-sm">الهدف:</span>
              <span className="font-bold text-muted-foreground">{data.target}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-sm">الفرق:</span>
              <span className={`font-bold ${data.score >= data.target ? 'text-green-600' : 'text-red-600'}`}>
                {data.score >= data.target ? '+' : ''}{data.score - data.target}%
              </span>
            </div>
            <Badge className={statusLabel.color}>
              {statusLabel.text}
            </Badge>
          </div>
        </div>
      );
    }
    return null;
  };

  // Handle bar click for drill-down
  const handleBarClick = (data: any) => {
    if (data && data.subject) {
      setSelectedBar(data.subject);
      // Here you could navigate to detailed view or show modal
      console.log('Clicked on:', data.subject);
    }
  };

  // Calculate overall performance
  const averageScore = Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length);
  const excellentCount = data.filter(d => d.score >= 90).length;
  const needsImprovementCount = data.filter(d => d.score < 70).length;

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              تحليل الأداء حسب المادة
            </CardTitle>
            <CardDescription className="mt-2">
              انقر على أي عمود لمزيد من التفاصيل
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {averageScore}%
            </div>
            <div className="text-sm text-muted-foreground">المتوسط العام</div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">{excellentCount}</div>
            <div className="text-sm text-green-600 dark:text-green-500">مواد ممتازة</div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{data.length - excellentCount - needsImprovementCount}</div>
            <div className="text-sm text-blue-600 dark:text-blue-500">مواد جيدة</div>
          </div>
          <div className="bg-red-100 dark:bg-red-900/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">{needsImprovementCount}</div>
            <div className="text-sm text-red-600 dark:text-red-500">تحتاج تحسين</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  handleBarClick(e.activePayload[0].payload);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="subject" 
                className="text-sm"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-sm"
                tick={{ fill: 'currentColor' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => value === 'score' ? 'الدرجة' : 'الهدف'}
              />
              <Bar 
                dataKey="score" 
                radius={[8, 8, 0, 0]}
                cursor="pointer"
                name="score"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getColor(entry.score)}
                    opacity={selectedBar === null || selectedBar === entry.subject ? 1 : 0.3}
                  />
                ))}
              </Bar>
              <Bar 
                dataKey="target" 
                fill="#94a3b8" 
                radius={[8, 8, 0, 0]}
                opacity={0.3}
                name="target"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Color Legend */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">مستويات الأداء:</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'ممتاز (90%+)', color: CHART_COLORS.hex.success },
              { label: 'جيد (80-89%)', color: CHART_COLORS.hex.info },
              { label: 'متوسط (70-79%)', color: CHART_COLORS.hex.warning },
              { label: 'يحتاج تحسين (<70%)', color: CHART_COLORS.hex.error },
            ].map((level, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: level.color }}
                />
                <span className="text-sm text-muted-foreground">{level.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {needsImprovementCount > 0 && (
          <div className="mt-4 p-4 bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-orange-900 dark:text-orange-100 mb-1">
                  توصيات للتحسين
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-200">
                  ركز على المواد التي تحتاج تحسين: {data.filter(d => d.score < 70).map(d => d.subject).join('، ')}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PerformanceBreakdown;
