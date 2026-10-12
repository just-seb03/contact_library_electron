import type { CSSProperties } from 'react';
import { f7 } from 'framework7-react';
import { useApp } from '../../context/AppContext';
import type { AppTab } from '../../context/types';
import 'framework7-icons/css/framework7-icons.css';

type LeftBarProps = {
  activeTab?: AppTab;
  defaultTab?: AppTab;
  onSelectTab?: (tab: AppTab) => void;
};

const tabMap: Record<AppTab, string> = {
  inicio: '#view-home',
  calendar: '#view-calendar',
  cliente: '#view-cliente',
  pagos: '#view-pagos',
  sumario: '#view-summary',
  config: '#view-settings',
};

export const LeftBar = ({ activeTab, defaultTab = 'inicio', onSelectTab }: LeftBarProps) => {
  const { activeTab: appActiveTab, setActiveTab } = useApp();
  const selected = activeTab ?? appActiveTab ?? defaultTab;

  const navItems: { id: AppTab; label: string; icon: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: 'house' },
    { id: 'calendar', label: 'Agenda', icon: 'device_laptop' },
    { id: 'cliente', label: 'Cliente', icon: 'person_3' },
    { id: 'pagos', label: 'Pagos', icon: 'creditcard' },
    { id: 'sumario', label: 'Sumario', icon: 'rectangle_3_offgrid' },
    { id: 'config', label: 'Ajustes', icon: 'hammer_fill' },
  ];

  const handleSelect = (id: AppTab) => {
    setActiveTab(id);
    onSelectTab?.(id);

    const tabId = tabMap[id];
    if (tabId && f7) {
      // 💡 Se pasa `true` como segundo parámetro para forzar la animación
      f7.tab.show(tabId, true);
    }
  };

  return (
    <aside style={styles.container}>
      <nav style={styles.navGroup}>
        {navItems.map((item) => {
          const isActive = selected === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              style={{
                ...styles.button,
                ...(isActive ? styles.activeButton : {}),
              }}
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
  activeButton: {
    backgroundColor: '#ffffff',
    color: '#000000',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
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