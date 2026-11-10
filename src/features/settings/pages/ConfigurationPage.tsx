import { useState, type CSSProperties } from 'react';
import { Page } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import { SettingsGroup } from '../components/SettingsGroup';
import { SettingsRow } from '../components/SettingsRow';
import { IosSwitch } from '../components/IosSwitch';
import { SettingsProfileCard } from '../components/SettingsProfileCard';
import { SettingsAppearanceSelector } from '../components/SettingsAppearanceSelector';
import { EditProfileModal, type ProfileFormData } from '../components/EditProfileModal';
import {
  SOFTWARE_INFO,
  type AppleAccentColor,
} from '../data/settingsData';

export default function Configuration() {
  const { darkMode, toggleDarkMode, settings, updateSetting, updateSettings } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleSaveProfile = (formData: ProfileFormData) => {
    updateSettings({
      lawyerName: formData.name,
      lawyerFirm: formData.firm,
      lawyerEmail: formData.email,
    });
  };

  const handleAccentColorChange = (color: AppleAccentColor) => {
    updateSetting('accentColor', color);
  };

  // Estilos macOS Inset Grouped
  const pageContainerStyle: CSSProperties = {
    maxWidth: 720,
    margin: '0 auto',
    padding: '24px 24px 64px 24px',
    boxSizing: 'border-box',
  };

  const titleStyle: CSSProperties = {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: '-0.025em',
    color: darkMode ? '#FFFFFF' : '#1C1C1E',
    margin: 0,
    lineHeight: 1.2,
  };

  const descriptionStyle: CSSProperties = {
    fontSize: 13.5,
    color: darkMode ? '#a1a1aa' : '#8E8E93',
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 1.45,
  };

  const versionBadgeStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: darkMode ? '#c7c7cc' : '#636366',
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
    padding: '4px 8px',
    borderRadius: 6,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", monospace',
  };

  const environmentBadgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: '#34C759',
    backgroundColor: darkMode ? 'rgba(52, 199, 89, 0.12)' : 'rgba(52, 199, 89, 0.1)',
    padding: '3px 8px',
    borderRadius: 12,
  };

  const statusDotStyle: CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#34C759',
    boxShadow: '0 0 4px #34C759',
    flexShrink: 0,
  };

  return (
    <Page noNavbar noToolbar>
      <div style={pageContainerStyle}>
        {/* Cabecera Principal */}
        <h1 style={titleStyle}>Ajustes del Sistema</h1>
        <p style={descriptionStyle}>
          Personaliza la apariencia, notificaciones, respaldo local y datos de tu despacho jurídico.
        </p>

        {/* 1. Tarjeta Perfil de Usuario / Despacho estilo Apple ID */}
        <SettingsProfileCard
          name={settings.lawyerName}
          firm={settings.lawyerFirm}
          email={settings.lawyerEmail}
          darkMode={darkMode}
          onEdit={() => setIsEditingProfile(true)}
        />

        {/* 2. Grupo: Apariencia y Personalización */}
        <SettingsGroup
          title="Apariencia y personalización"
          footerText="El color de realce seleccionado se aplica armónicamente a los elementos interactivos del sistema."
          darkMode={darkMode}
        >
          <SettingsAppearanceSelector
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            accentColor={settings.accentColor}
            onChangeAccentColor={handleAccentColorChange}
          />
          <SettingsRow
            icon="speaker_wave_2_fill"
            iconBgColor="#af52de"
            title="Efectos de sonido de la interfaz"
            subtitle="Reproduce sutiles tonos al completar cobros, crear clientes o guardar audiencias"
            control={
              <IosSwitch
                checked={settings.soundEffects}
                onChange={(val) => updateSetting('soundEffects', val)}
                darkMode={darkMode}
                ariaLabel="Activar efectos sonoros"
              />
            }
            isLast={true}
            darkMode={darkMode}
          />
        </SettingsGroup>

        {/* 3. Grupo: Notificaciones y Alertas */}
        <SettingsGroup
          title="Notificaciones y agenda"
          footerText="Las alertas se gestionan dentro de la app sin requerir conexión a servicios externos en la nube."
          darkMode={darkMode}
        >
          <SettingsRow
            icon="calendar"
            iconBgColor="#ff3b30"
            title="Alertas de audiencias judiciales"
            subtitle="Recibe avisos automáticos 24 horas antes de cada comparecencia en tribunales"
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
            iconBgColor="#ff9500"
            title="Recordatorios de cobros y vencimientos"
            subtitle="Destaca en color ámbar las cuotas pendientes o con fecha límite próxima"
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


        {/* 5. Grupo: Información del Sistema */}
        <SettingsGroup title="Información del software y sistema" darkMode={darkMode}>
          <SettingsRow
            icon="desktopcomputer"
            iconBgColor="#007aff"
            title={SOFTWARE_INFO.name}
            subtitle={SOFTWARE_INFO.stack}
            control={<span style={versionBadgeStyle}>{SOFTWARE_INFO.version}</span>}
            isLast={false}
            darkMode={darkMode}
          />
          <SettingsRow
            icon="cpu"
            iconBgColor="#5856d6"
            title="Compatibilidad de Procesador"
            subtitle={SOFTWARE_INFO.architecture}
            control={<span style={versionBadgeStyle}>Universal Binary</span>}
            isLast={false}
            darkMode={darkMode}
          />
          <SettingsRow
            icon="lock_shield_fill"
            iconBgColor="#34c759"
            title="Entorno y Privacidad"
            subtitle="Almacenamiento 100% privado en tu disco local. Cero rastreadores."
            control={
              <span style={environmentBadgeStyle}>
                <span style={statusDotStyle} />
                Protegido y Local
              </span>
            }
            isLast={true}
            darkMode={darkMode}
          />
        </SettingsGroup>

        {/* Pie de página sutil estilo macOS */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 11.5,
            color: darkMode ? '#71717a' : '#a1a1aa',
            marginTop: 32,
            userSelect: 'none',
          }}
        >
          {SOFTWARE_INFO.name} • Hecho para macOS • {SOFTWARE_INFO.buildDate}
        </div>
      </div>

      {/* Modal para editar datos del despacho */}
      <EditProfileModal
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        initialData={{
          name: settings.lawyerName,
          firm: settings.lawyerFirm,
          email: settings.lawyerEmail,
        }}
        onSave={handleSaveProfile}
        darkMode={darkMode}
      />
    </Page>
  );
}
