import { useAuthStore } from '@/store/authStore';
import { Login } from '@/components/Login';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';

const Index = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
