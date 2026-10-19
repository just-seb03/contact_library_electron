import { useState, type CSSProperties } from 'react';
import { useApp } from '../../context/AppContext';
import type { AppTab } from '../../context/types';
import { navigateToTab } from '../../utils/navigation';
import 'framework7-icons/css/framework7-icons.css';

export const LeftBar = () => {
  const { activeTab, setActiveTab, darkMode } = useApp();
  const [hoveredTab, setHoveredTab] = useState<AppTab | null>(null);

  const navItems: { id: AppTab; label: string; icon: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: 'house' },
    { id: 'calendar', label: 'Agenda', icon: 'device_laptop' },
    { id: 'cliente', label: 'Cliente', icon: 'person_3' },
    { id: 'pagos', label: 'Pagos', icon: 'creditcard' },
    { id: 'config', label: 'Ajustes', icon: 'gear_alt_fill' },
  ];

  const handleSelect = (id: AppTab) => {
    navigateToTab(id);
    setActiveTab(id);
  };

  return (
    <aside style={{ ...styles.container, ...(darkMode ? styles.containerDark : {}) }}>
      <nav style={styles.navGroup}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isHovered = hoveredTab === item.id;
          const activeStyle = darkMode ? styles.activeButtonDark : styles.activeButtonLight;
          
          let itemBtnStyle: CSSProperties = {
            ...styles.button,
            color: darkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
          };

          if (isActive) {
            itemBtnStyle = {
              ...itemBtnStyle,
              ...activeStyle,
              ...(isHovered && darkMode ? { backgroundColor: 'rgba(255, 255, 255, 0.22)' } : {}),
            };
          } else if (isHovered) {
            itemBtnStyle = {
              ...itemBtnStyle,
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.45)',
              color: darkMode ? '#ffffff' : '#000000',
            };
          }

          return (
            <button
              key={item.id}
              className={`leftbar-button ${isActive ? 'active' : ''}`}
              onClick={() => handleSelect(item.id)}
              onMouseEnter={() => setHoveredTab(item.id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={itemBtnStyle}
              title={item.label}
            >
              <i className="f7-icons" style={styles.icon}>
                {item.icon}
              </i>
              <span style={styles.label}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export const Sidebar = LeftBar;

const styles: Record<string, CSSProperties> = {
  container: {
    width: '76px',
    height: 'calc(100% - 124px)',
    margin: '70px 0 16px 16px',
    padding: '20px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    userSelect: 'none',
    zIndex: 100,
    background: 'rgba(121, 119, 119, 0.25)',
    backdropFilter: 'blur(30px) saturate(200%)',
    WebkitBackdropFilter: 'blur(30px) saturate(200%)',
    borderRadius: '24px',
    border: '1px solid rgb(223, 221, 221)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  },
  containerDark: {
    background: 'rgba(22, 23, 29, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '4px',
    WebkitAppearance: 'none',
    margin: 0,
  },
  activeButtonLight: {
    backgroundColor: '#ffffff',
    color: '#000000',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1.04)',
  },
  activeButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.04)',
  },
  icon: {
    fontSize: '22px',
    lineHeight: '1',
    marginBottom: '3px',
  },
  label: {
    fontSize: '9px',
    fontWeight: '600',
    letterSpacing: '-0.1px',
  },
};