
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, TrendingUp, Eye, Download, Share2 } from 'lucide-react';

interface Report {
  name: string;
  description: string;
  type: string;
  icon: React.ElementType;
  trend: string;
  lastUpdate: string;
  priority: string;
}

interface ReportCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  gradient: string;
  bgPattern: string;
  iconBg: string;
  reports: Report[];
}

interface ReportCategorySectionProps {
  category: ReportCategory;
}

const ReportCategorySection: React.FC<ReportCategorySectionProps> = ({ category }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className={cn("relative overflow-hidden rounded-3xl p-8", category.bgPattern)}>
        <div className="absolute inset-0 bg-gradient-to-r opacity-10" style={{
          background: `linear-gradient(135deg, ${category.gradient.split(' ')[1]}, ${category.gradient.split(' ')[3]})`
        }} />
        
        <div className="relative flex items-center gap-6">
          <div className={cn("p-4 rounded-2xl shadow-2xl", category.iconBg)}>
            <category.icon className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-foreground mb-2">{category.title}</h2>
            <p className="text-lg text-muted-foreground font-medium">
              {category.reports.length} relatórios premium disponíveis
            </p>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {category.reports.map((report, index) => (
          <Card key={index} className="group relative overflow-hidden bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer">
            {/* Priority Indicator */}
            <div className={cn(
              "absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse",
              getPriorityColor(report.priority)
            )} />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                  <report.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {report.lastUpdate}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-lg text-foreground group-hover:text-blue-600 transition-colors duration-300">
                    {report.name}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    {report.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs font-semibold bg-white/50 backdrop-blur-sm">
                      {report.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      {report.trend}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-xs bg-white/50 hover:bg-white/70 backdrop-blur-sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-xs bg-white/50 hover:bg-white/70 backdrop-blur-sm">
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-xs bg-white/50 hover:bg-white/70 backdrop-blur-sm">
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportCategorySection;
