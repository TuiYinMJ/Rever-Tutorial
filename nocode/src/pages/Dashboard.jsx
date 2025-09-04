import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { CardContent, CardHeader, Card, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Mail, TrendingUp, Globe, DollarSign, Users, FileText, AlertCircle, Clock, TrendingDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Bar, Legend, PieChart, Tooltip, BarChart, CartesianGrid, ResponsiveContainer, Pie, Cell, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [exchangeRates, setExchangeRates] = useState([]);

  // 获取统计卡片数据
  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // 获取当前用户ID
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user.id;

      // 并行获取所有统计数据
      const [
        customersCount,
        inquiriesCount,
        newCustomersCount,
        pendingInquiriesCount,
        quotedAmount
      ] = await Promise.all([
        // 客户总数
        supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // 询盘总数
        supabase
          .from('inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // 本月新增客户
        supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        
        // 待处理询盘
        supabase
          .from('inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', '待处理'),
        
        // 本月报价金额 (从报价单表中获取实际数据)
        supabase
          .from('quotations')
          .select('total_amount')
          .eq('user_id', userId)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);

      // 计算本月报价总金额
      const totalQuotedAmount = quotedAmount.data?.reduce((sum, quotation) => sum + (quotation.total_amount || 0), 0) || 0;

      return {
        customers: customersCount.count || 0,
        inquiries: inquiriesCount.count || 0,
        newCustomers: newCustomersCount.count || 0,
        pendingInquiries: pendingInquiriesCount.count || 0,
        quotedAmount: totalQuotedAmount
      };
    }
  });

  // 获取最近7天询盘趋势数据
  const { data: inquiryTrendData } = useQuery({
    queryKey: ['inquiry-trend'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user.id;

      // 计算7天前的日期
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 包含今天，所以是6天前

      // 获取最近7天的询盘数据
      const { data, error } = await supabase
        .from('inquiries')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at');

      if (error) throw error;

      // 处理数据，按日期分组统计
      const dateCountMap = {};
      
      // 初始化最近7天的日期
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dateCountMap[dateStr] = 0;
      }

      // 统计每天的询盘数量
      data.forEach(item => {
        const dateStr = item.created_at.split('T')[0];
        if (dateCountMap[dateStr] !== undefined) {
          dateCountMap[dateStr]++;
        }
      });

      // 转换为图表需要的格式
      return Object.entries(dateCountMap)
        .map(([date, count]) => ({
          date,
          count
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  });

  // 获取业务阶段分布数据
  const { data: businessStageData } = useQuery({
    queryKey: ['business-stage-distribution'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user.id;

      // 获取客户状态分布
      const { data, error } = await supabase
        .from('customers')
        .select('status')
        .eq('user_id', userId);

      if (error) throw error;

      // 统计各状态的客户数量
      const statusCount = {};
      data.forEach(customer => {
        statusCount[customer.status] = (statusCount[customer.status] || 0) + 1;
      });

      // 转换为图表需要的格式
      return Object.entries(statusCount).map(([name, value]) => ({
        name,
        value
      }));
    }
  });

  // 获取待办事项数据
  const { data: overdueTasks } = useQuery({
    queryKey: ['overdue-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user.id;

      // 获取超过7天未跟进的客户
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('customers')
        .select('id, company_name, last_contact, status')
        .eq('user_id', userId)
        .lte('last_contact', sevenDaysAgo.toISOString().split('T')[0])
        .order('last_contact', { ascending: true })
        .limit(5); // 限制显示5条

      if (error) throw error;

      // 计算未跟进天数
      return data.map(customer => {
        const lastContactDate = new Date(customer.last_contact);
        const days = Math.floor((new Date() - lastContactDate) / (1000 * 60 * 60 * 24));
        return {
          id: customer.id,
          customer: customer.company_name,
          days: days,
          type: '客户跟进'
        };
      });
    }
  });

  // 获取最近活动数据
  const { data: recentActivities } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user.id;

      // 获取最近的客户和询盘活动
      const [customers, inquiries] = await Promise.all([
        supabase
          .from('customers')
          .select('id, company_name, created_at, status')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('inquiries')
          .select('id, created_at, status, customers(company_name)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      // 合并并排序活动
      const activities = [
        ...customers.data.map(customer => ({
          id: customer.id,
          customer: customer.company_name,
          action: `客户状态: ${customer.status}`,
          time: customer.created_at,
          type: 'customer'
        })),
        ...inquiries.data.map(inquiry => ({
          id: inquiry.id,
          customer: inquiry.customers?.company_name || '未知客户',
          action: `询盘状态: ${inquiry.status}`,
          time: inquiry.created_at,
          type: 'inquiry'
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5); // 限制显示5条

      // 格式化时间显示
      return activities.map(activity => {
        const activityDate = new Date(activity.time);
        const now = new Date();
        const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        let timeDisplay;
        if (diffInHours < 1) {
          timeDisplay = '刚刚';
        } else if (diffInHours < 24) {
          timeDisplay = `${diffInHours}小时前`;
        } else {
          timeDisplay = `${diffInDays}天前`;
        }

        return {
          ...activity,
          time: timeDisplay
        };
      });
    }
  });

  // 模拟汇率数据
  useEffect(() => {
    // 模拟获取实时汇率数据
    const mockExchangeRates = [
      { currency: 'USD/CNY', rate: '7.25', change: '+0.15%' },
      { currency: 'EUR/CNY', rate: '7.89', change: '-0.23%' },
      { currency: 'GBP/CNY', rate: '9.12', change: '+0.08%' },
      { currency: 'JPY/CNY', rate: '0.051', change: '-0.05%' }
    ];
    setExchangeRates(mockExchangeRates);

    // 更新时间
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">仪表盘</h1>
        <p className="text-gray-500">查看您的业务概览和关键指标</p>
      </div>

      {/* 统计卡片 - 响应式网格布局 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Link to="/customers" className="block">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">客户总数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData ? statsData.customers : '-'}
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/inquiries" className="block">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">询盘总数</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData ? statsData.inquiries : '-'}
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本月新增客户</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData ? statsData.newCustomers : '-'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本月报价金额</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData ? `$${statsData.quotedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 - 响应式网格布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* 最近7天询盘趋势 */}
        <Card>
          <CardHeader>
            <CardTitle>最近7天询盘趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={inquiryTrendData || []}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, '询盘数']}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                  }}
                />
                <Legend />
                <Bar dataKey="count" name="询盘数量" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 业务阶段分布 */}
        <Card>
          <CardHeader>
            <CardTitle>业务阶段分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={businessStageData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {businessStageData && businessStageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 待办事项和最近活动 - 响应式网格布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* 待办事项提醒 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
              待办事项提醒
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overdueTasks && overdueTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{task.customer}</p>
                    <p className="text-sm text-gray-500">{task.type}</p>
                  </div>
                  <Badge variant="destructive">{task.days}天未跟进</Badge>
                </div>
              ))}
              {overdueTasks && overdueTasks.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  暂无待办事项
                </div>
              )}
              <Button className="w-full" variant="outline" asChild>
                <Link to="/customers">
                  查看所有客户
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
              最近活动
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities && recentActivities.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.customer}</p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
              {recentActivities && recentActivities.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  暂无最近活动
                </div>
              )}
              <Button className="w-full" variant="outline" asChild>
                <Link to="/customers">
                  查看所有活动
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
