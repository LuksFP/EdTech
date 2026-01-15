import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { useCourses } from '@/store/CourseContext';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, DollarSign, TrendingUp, BookOpen, Star
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['hsl(221, 83%, 53%)', 'hsl(187, 92%, 42%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(280, 83%, 53%)'];

const CATEGORY_LABELS: Record<string, string> = {
  programming: 'Programação',
  design: 'Design',
  business: 'Negócios',
  marketing: 'Marketing',
  'data-science': 'Data Science',
};

const AdminReports: React.FC = () => {
  const { courses, enrollments, reviews, isLoading } = useCourses();

  const stats = useMemo(() => {
    const publishedCourses = courses.filter(c => c.status === 'published');
    const totalStudents = new Set(enrollments.map(e => e.userId)).size;
    const totalRevenue = courses.reduce((acc, c) => acc + (c.price * c.studentsCount), 0);
    const avgRating = publishedCourses.length > 0
      ? publishedCourses.reduce((acc, c) => acc + c.rating, 0) / publishedCourses.length
      : 0;

    // Simulated trends (would come from historical data in production)
    const studentGrowth = 12;
    const revenueGrowth = 8;
    const enrollmentGrowth = 15;

    return {
      totalStudents,
      totalRevenue,
      avgRating,
      totalEnrollments: enrollments.length,
      studentGrowth,
      revenueGrowth,
      enrollmentGrowth,
    };
  }, [courses, enrollments]);

  const chartData = useMemo(() => {
    // Monthly data (simulated for demo, would come from aggregated DB data)
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      return {
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        students: Math.floor(Math.random() * 100) + 50 + (i * 15),
        revenue: Math.floor(Math.random() * 10000) + 5000 + (i * 2000),
        enrollments: Math.floor(Math.random() * 30) + 10 + (i * 5),
      };
    });

    // Category distribution from real data
    const categoryData = Object.entries(
      courses.reduce((acc, course) => {
        const label = CATEGORY_LABELS[course.category] || course.category;
        acc[label] = (acc[label] || 0) + course.studentsCount;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    }));

    // Category stats for table
    const categoryStats = Object.entries(
      courses.reduce((acc, course) => {
        const label = CATEGORY_LABELS[course.category] || course.category;
        if (!acc[label]) {
          acc[label] = { courses: 0, students: 0, revenue: 0 };
        }
        acc[label].courses += 1;
        acc[label].students += course.studentsCount;
        acc[label].revenue += course.price * course.studentsCount;
        return acc;
      }, {} as Record<string, { courses: number; students: number; revenue: number }>)
    ).map(([category, data]) => ({ category, ...data }));

    return { monthlyData, categoryData, categoryStats };
  }, [courses]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Relatórios</h1>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

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
          value={stats.totalStudents}
          icon={Users}
          variant="primary"
          trend={{ value: stats.studentGrowth, isPositive: true }}
          description="Total de alunos cadastrados"
        />
        <StatsCard
          title="Receita Total"
          value={`R$ ${(stats.totalRevenue / 1000).toFixed(1)}k`}
          icon={DollarSign}
          variant="success"
          trend={{ value: stats.revenueGrowth, isPositive: true }}
          description="Faturamento acumulado"
        />
        <StatsCard
          title="Matrículas"
          value={stats.totalEnrollments}
          icon={TrendingUp}
          variant="warning"
          trend={{ value: stats.enrollmentGrowth, isPositive: true }}
          description="Total de matrículas"
        />
        <StatsCard
          title="Avaliação Média"
          value={stats.avgRating.toFixed(1)}
          icon={Star}
          variant="primary"
          description={`${reviews.length} avaliações`}
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
              <AreaChart data={chartData.monthlyData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="fill-muted-foreground text-xs" tickLine={false} axisLine={false} />
                <YAxis className="fill-muted-foreground text-xs" tickLine={false} axisLine={false} />
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
                  stroke="hsl(var(--primary))" 
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
              <BarChart data={chartData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="fill-muted-foreground text-xs" tickLine={false} axisLine={false} />
                <YAxis className="fill-muted-foreground text-xs" tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                />
                <Bar dataKey="revenue" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Receita" />
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
              <LineChart data={chartData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="fill-muted-foreground text-xs" tickLine={false} axisLine={false} />
                <YAxis className="fill-muted-foreground text-xs" tickLine={false} axisLine={false} />
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
                  stroke="hsl(var(--warning))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2 }}
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
                  data={chartData.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.categoryData.map((entry, index) => (
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
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
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
                {chartData.categoryStats.map((cat, index) => (
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
                      {cat.students > 0 ? `R$ ${(cat.revenue / cat.students).toFixed(2)}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              {chartData.categoryStats.length > 0 && (
                <tfoot>
                  <tr className="bg-muted/30">
                    <td className="py-4 px-4 font-semibold">Total</td>
                    <td className="py-4 px-4 text-center font-semibold">
                      {chartData.categoryStats.reduce((acc, c) => acc + c.courses, 0)}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold">
                      {chartData.categoryStats.reduce((acc, c) => acc + c.students, 0).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-success">
                      R$ {chartData.categoryStats.reduce((acc, c) => acc + c.revenue, 0).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-4 px-4 text-right text-muted-foreground">-</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
