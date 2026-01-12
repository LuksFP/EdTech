import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { 
  Users, DollarSign, TrendingUp, BookOpen, Star,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { mockAnalyticsData, mockCategoryStats, mockCourses, mockStudents, mockReviews } from '@/services/mockData';

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const AdminReports: React.FC = () => {
  // Calculate totals and trends
  const currentMonth = mockAnalyticsData[mockAnalyticsData.length - 1];
  const previousMonth = mockAnalyticsData[mockAnalyticsData.length - 2];
  
  const studentGrowth = Math.round(((currentMonth.students - previousMonth.students) / previousMonth.students) * 100);
  const revenueGrowth = Math.round(((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100);
  const enrollmentGrowth = Math.round(((currentMonth.enrollments - previousMonth.enrollments) / previousMonth.enrollments) * 100);

  const totalRevenue = mockAnalyticsData.reduce((acc, d) => acc + d.revenue, 0);
  const totalEnrollments = mockAnalyticsData.reduce((acc, d) => acc + d.enrollments, 0);
  const avgRating = mockCourses.filter(c => c.rating > 0).reduce((acc, c) => acc + c.rating, 0) / 
    mockCourses.filter(c => c.rating > 0).length;

  // Prepare pie chart data
  const pieData = mockCategoryStats.map((cat, index) => ({
    name: cat.category,
    value: cat.students,
    color: COLORS[index % COLORS.length]
  }));

  // Prepare monthly data with formatted dates
  const monthlyData = mockAnalyticsData.map(d => ({
    ...d,
    month: new Date(d.date + '-01').toLocaleDateString('pt-BR', { month: 'short' })
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Relatórios e Analytics
        </h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho da sua plataforma em tempo real
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Alunos Ativos"
          value={currentMonth.students}
          icon={Users}
          variant="primary"
          trend={{ value: studentGrowth, isPositive: studentGrowth > 0 }}
          description="Total de alunos cadastrados"
        />
        <StatsCard
          title="Receita Mensal"
          value={`R$ ${(currentMonth.revenue / 1000).toFixed(1)}k`}
          icon={DollarSign}
          variant="success"
          trend={{ value: revenueGrowth, isPositive: revenueGrowth > 0 }}
          description="Faturamento este mês"
        />
        <StatsCard
          title="Matrículas"
          value={currentMonth.enrollments}
          icon={TrendingUp}
          variant="warning"
          trend={{ value: enrollmentGrowth, isPositive: enrollmentGrowth > 0 }}
          description="Novas matrículas"
        />
        <StatsCard
          title="Avaliação Média"
          value={avgRating.toFixed(1)}
          icon={Star}
          variant="primary"
          description={`${mockReviews.length} avaliações`}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Crescimento de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="students" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorStudents)" 
                  name="Alunos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-success" />
              Receita Mensal (R$)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollments Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-warning" />
              Tendência de Matrículas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="enrollments" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  name="Matrículas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Alunos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Alunos']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Desempenho por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Categoria</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Cursos</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Alunos</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Receita</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Ticket Médio</th>
                </tr>
              </thead>
              <tbody>
                {mockCategoryStats.map((cat, index) => (
                  <tr key={cat.category} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{cat.category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">{cat.courses}</td>
                    <td className="py-4 px-4 text-center">{cat.students.toLocaleString('pt-BR')}</td>
                    <td className="py-4 px-4 text-right font-medium text-success">
                      R$ {cat.revenue.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-4 px-4 text-right text-muted-foreground">
                      R$ {(cat.revenue / cat.students).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/30">
                  <td className="py-4 px-4 font-semibold">Total</td>
                  <td className="py-4 px-4 text-center font-semibold">
                    {mockCategoryStats.reduce((acc, c) => acc + c.courses, 0)}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold">
                    {mockCategoryStats.reduce((acc, c) => acc + c.students, 0).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-success">
                    R$ {mockCategoryStats.reduce((acc, c) => acc + c.revenue, 0).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-4 px-4 text-right text-muted-foreground">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
