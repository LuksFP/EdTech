# 🎓 EdTech - Plataforma de Cursos Online

Uma aplicação fullstack completa de gerenciamento de cursos online, desenvolvida para demonstrar habilidades técnicas em desenvolvimento web moderno.

![EdTech Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-blue)

## ✨ Funcionalidades

### 👨‍🎓 Portal do Aluno
- **Dashboard personalizado** com cursos matriculados e progresso
- **Catálogo de cursos** com filtros por categoria e busca
- **Página de detalhes** com módulos, descrição e matrícula
- **Sistema de avaliações** para feedback dos cursos
- **Certificados PDF** gerados automaticamente ao concluir cursos
- **Upload de avatar** com qualquer tipo de imagem
- **Acompanhamento de progresso** em tempo real
- **Tema claro/escuro** com transições suaves

### 👨‍💼 Painel Administrativo
- **CRUD completo de cursos** (criar, editar, deletar)
- **Dashboard analítico** com gráficos Recharts
- **Visualização de métricas** (matrículas, receita, categorias)
- **Gestão de alunos** com listagem e métricas
- **Relatórios e insights** sobre a plataforma

### 🔐 Segurança
- **Row Level Security (RLS)** em todas as tabelas
- **Autenticação robusta** com Lovable Cloud
- **Sistema de roles** (admin/student) com controle de acesso
- **Validação de inputs** com Zod em todos os formulários
- **Políticas de segurança** para proteção de dados
- **Storage seguro** para avatares com políticas por usuário

## 🛠️ Tech Stack

| Frontend | Backend | Infraestrutura |
|----------|---------|----------------|
| React 18 | PostgreSQL | Lovable Cloud |
| TypeScript | Supabase | Vite |
| Tailwind CSS | Edge Functions | ESLint |
| Shadcn/UI | RLS Policies | |
| React Query | Triggers | |
| React Router | Functions | |
| Recharts | Storage Buckets | |
| next-themes | | |
| jsPDF | | |

## 🏗️ Arquitetura

```
src/
├── components/       # Componentes reutilizáveis
│   ├── ui/          # Componentes Shadcn/UI
│   ├── DashboardCharts.tsx  # Gráficos do admin
│   ├── ThemeToggle.tsx      # Toggle de tema
│   └── ...          # Componentes específicos
├── pages/           # Páginas da aplicação
│   ├── admin/       # Rotas administrativas
│   ├── student/     # Rotas do aluno
│   └── CourseDetails.tsx  # Detalhes do curso
├── store/           # Contextos (Auth, Course)
├── routes/          # Proteção de rotas
├── hooks/           # Custom hooks
├── types/           # Definições TypeScript
└── integrations/    # Integrações (Supabase)
```

## 🚀 Como Executar

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

## 🔑 Credenciais de Teste

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | admin@edtech.com | 123456 |
| Aluno | aluno@edtech.com | 123456 |

## 📊 Banco de Dados

### Tabelas Principais
- **profiles** - Dados do usuário
- **user_roles** - Roles de acesso (admin/student)
- **courses** - Catálogo de cursos
- **enrollments** - Matrículas dos alunos
- **reviews** - Avaliações dos cursos

### Triggers Automáticos
- `handle_new_user` - Cria perfil e role ao cadastrar
- `update_course_rating` - Atualiza média de avaliações
- `update_course_students_count` - Atualiza contador de alunos

## 🎯 Diferenciais

- ✅ Certificados PDF personalizados para cursos concluídos
- ✅ Upload de avatar com storage seguro
- ✅ Tema claro/escuro com transições suaves
- ✅ Gráficos interativos com Recharts
- ✅ Página de detalhes com módulos do curso
- ✅ Código limpo e bem organizado
- ✅ TypeScript com tipagem completa
- ✅ Design responsivo mobile-first
- ✅ Validação de formulários robusta
- ✅ Segurança em nível de banco de dados
- ✅ UX com feedback visual (toasts, loading states)
- ✅ Arquitetura escalável e manutenível

## 📄 Licença

Este projeto está sob a licença MIT.
