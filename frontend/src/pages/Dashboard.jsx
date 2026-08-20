import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import '../styles/dashboard.css';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <Header />

      <main className="dashboard__main">
        <section className="dashboard__intro">
          <h1 className="dashboard__title">Hola, {user?.name}</h1>
          <p className="dashboard__subtitle">Aqui apareceran tus tareas.</p>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
