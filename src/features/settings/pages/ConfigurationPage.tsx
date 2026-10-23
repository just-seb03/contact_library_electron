import { useState, type CSSProperties } from 'react';
import { Page } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import { SettingsGroup } from '../components/SettingsGroup';
import { SettingsRow } from '../components/SettingsRow';
import { IosSwitch } from '../components/IosSwitch';
import {
  DEFAULT_SETTINGS,
  SOFTWARE_INFO,
  type AppSettings,
} from '../data/settingsData';

export default function Configuration() {
  const { darkMode, toggleDarkMode } = useApp();

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('contact_library_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  const updateSetting = (key: keyof AppSettings, value: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem('contact_library_settings', JSON.stringify(next));
      } catch {
        // fallback
      }
      return next;
    });
  };

  // Objetos de estilo en línea tipados con React.CSSProperties
  const pageContainerStyle: CSSProperties = {
    maxWidth: 680,
    margin: '0',
    padding: '48px 20px 48px 20px',
    boxSizing: 'border-box',
  };

  const titleStyle: CSSProperties = {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: darkMode ? '#FFFFFF' : '#1C1C1E',
    margin: 0,
    lineHeight: 1.2,
  };

  const descriptionStyle: CSSProperties = {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 6,
    marginBottom: 28,
    lineHeight: 1.4,
  };

  const versionBadgeStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: '#8E8E93',
    backgroundColor: darkMode ? '#2C2C2E' : '#F2F2F7',
    padding: '4px 8px',
    borderRadius: 6,
    fontFamily: 'monospace',
  };

  const environmentBadgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: '#34C759',
  };

  const statusDotStyle: CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#34C759',
    flexShrink: 0,
  };

  return (
    <Page noNavbar noToolbar>
      <div style={pageContainerStyle}>
        <h1 style={titleStyle}>Configuraciones</h1>
        <p style={descriptionStyle}>
          Personaliza la apariencia del sistema y gestiona las preferencias de alertas.
        </p>

        {/* Grupo 1: Apariencia y Tonalidad */}
        <SettingsGroup title="Apariencia y tonalidad" darkMode={darkMode}>
          <SettingsRow
            icon={darkMode ? 'moon_stars_fill' : 'sun_max_fill'}
            iconBgColor={darkMode ? '#5E5CE6' : '#FF9500'}
            title="Modo oscuro"
            subtitle={
              darkMode
                ? 'Tema visual oscuro activo para reducir fatiga visual'
                : 'Tema visual claro activo optimizado para entornos iluminados'
            }
            control={
              <IosSwitch
                checked={darkMode}
                onChange={toggleDarkMode}
                darkMode={darkMode}
                ariaLabel="Activar o desactivar modo oscuro"
              />
            }
            isLast={true}
            darkMode={darkMode}
          />
        </SettingsGroup>

        {/* Grupo 2: Notificaciones y Alertas */}
        <SettingsGroup title="Notificaciones y alertas" darkMode={darkMode}>
          <SettingsRow
            icon="calendar"
            iconBgColor="#007AFF"
            title="Alertas de audiencias judiciales"
            subtitle="Recibe avisos automáticos 24 horas antes de cada comparecencia"
            control={
              <IosSwitch
                checked={settings.hearingAlerts}
                onChange={(val) => updateSetting('hearingAlerts', val)}
                darkMode={darkMode}
                ariaLabel="Alertas de audiencias judiciales"
              />
            }
            isLast={false}
            darkMode={darkMode}
          />
          <SettingsRow
            icon="creditcard_fill"
            iconBgColor="#FF9500"
            title="Recordatorios de cobros"
            subtitle="Destaca en naranja los pagos pendientes o vencidos"
            control={
              <IosSwitch
                checked={settings.paymentReminders}
                onChange={(val) => updateSetting('paymentReminders', val)}
                darkMode={darkMode}
                ariaLabel="Recordatorios de cobros"
              />
            }
            isLast={true}
            darkMode={darkMode}
          />
        </SettingsGroup>

        {/* Grupo 3: Información del Software y Sistema */}
        <SettingsGroup title="Información del software y sistema" darkMode={darkMode}>
          <SettingsRow
            icon="desktopcomputer"
            iconBgColor="#007AFF"
            title={SOFTWARE_INFO.name}
            subtitle={SOFTWARE_INFO.stack}
            control={<span style={versionBadgeStyle}>{SOFTWARE_INFO.version}</span>}
            isLast={false}
            darkMode={darkMode}
          />
          <SettingsRow
            icon="lock_shield_fill"
            iconBgColor="#5856D6"
            title="Entorno de ejecución"
            subtitle={SOFTWARE_INFO.environment}
            control={
              <span style={environmentBadgeStyle}>
                <span style={statusDotStyle} />
                Activo
              </span>
            }
            isLast={true}
            darkMode={darkMode}
          />
        </SettingsGroup>
      </div>
    </Page>
  );
}
