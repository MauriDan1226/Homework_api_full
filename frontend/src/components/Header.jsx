import BrandMark from './BrandMark';
import { useAuth } from '../contexts/AuthContext';
import '../styles/header.css';

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] || '')
    .join('')
    .toUpperCase();
}

function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <BrandMark size={28} />
          <span className="header__brand-name">Tareas</span>
        </div>

        <div className="header__user">
          <span className="header__avatar" aria-hidden="true">
            {getInitials(user?.name)}
          </span>
          <span className="header__user-info">
            <span className="header__user-name">{user?.name}</span>
            <span className="header__user-email">{user?.email}</span>
          </span>
          <button type="button" className="button button_ghost" onClick={signOut}>
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
