import { useState, type CSSProperties } from 'react';
import { Page } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import { SettingsGroup } from '../components/SettingsGroup';
import { SettingsRow } from '../components/SettingsRow';
import { IosSwitch } from '../components/IosSwitch';
import { SettingsProfileCard } from '../components/SettingsProfileCard';
import { SettingsAppearanceSelector } from '../components/SettingsAppearanceSelector';
import { EditProfileModal, type ProfileFormData } from '../components/EditProfileModal';
import type { AppleAccentColor } from '../data/settingsData';
import { APP_THEMES } from '../../../core/theme/themes';

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

  const scrollWrapperStyle: CSSProperties = {
    height: 'calc(100vh - 58px)',
    width: '100%',
    overflowY: 'auto',
    boxSizing: 'border-box',
    maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 88px), transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 88px), transparent 100%)',
  };

  const pageContainerStyle: CSSProperties = {
    maxWidth: 720,
    margin: '0 auto',
    padding: '16px 24px 96px 24px',
    boxSizing: 'border-box',
  };

  return (
    <Page noNavbar noToolbar>
      <style>{`
        @keyframes cfgEnter {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .cfg-anim {
          opacity: 0;
          animation: cfgEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .cfg-anim {
            opacity: 1;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div style={scrollWrapperStyle}>
        <div style={pageContainerStyle}>
          <div className="cfg-anim" style={{ animationDelay: '30ms' }}>
            <SettingsProfileCard
              name={settings.lawyerName}
              firm={settings.lawyerFirm}
              email={settings.lawyerEmail}
              darkMode={darkMode}
              onEdit={() => setIsEditingProfile(true)}
            />
          </div>

          <div className="cfg-anim" style={{ animationDelay: '80ms' }}>
            <SettingsGroup title="Apariencia" darkMode={darkMode}>
              <SettingsAppearanceSelector
                darkMode={darkMode}
                onToggleDarkMode={toggleDarkMode}
                themeId={settings.themeId ?? 'default'}
                onChangeTheme={(themeId) => {
                  const recommendedAccent = APP_THEMES[themeId]?.recommendedAccent;
                  updateSettings(
                    recommendedAccent
                      ? { themeId, accentColor: recommendedAccent }
                      : { themeId }
                  );
                }}
                accentColor={settings.accentColor}
                onChangeAccentColor={handleAccentColorChange}
              />
              <SettingsRow
                icon="speaker_wave_2"
                title="Sonidos de interfaz"
                subtitle="Tonos sutiles en notificaciones y acciones"
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
          </div>

          <div className="cfg-anim" style={{ animationDelay: '130ms' }}>
            <SettingsGroup title="Notificaciones" darkMode={darkMode}>
              <SettingsRow
                icon="bell"
                title="Eventos del calendario"
                subtitle="Notificar según el aviso previo de cada evento"
                control={
                  <IosSwitch
                    checked={settings.calendarAlerts}
                    onChange={(val) => updateSetting('calendarAlerts', val)}
                    darkMode={darkMode}
                    ariaLabel="Avisos de eventos del calendario"
                  />
                }
                isLast={false}
                darkMode={darkMode}
              />
              <SettingsRow
                icon="calendar"
                title="Audiencias judiciales"
                subtitle="Aviso 24 horas antes de cada comparecencia"
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
                icon="creditcard"
                title="Cobros y vencimientos"
                subtitle="Resumen diario a las 9:00 de pagos pendientes"
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
          </div>

          <div className="cfg-anim" style={{ animationDelay: '180ms' }}>
            <SettingsGroup title="Ventana" darkMode={darkMode}>
              <SettingsRow
                icon="tray"
                title="Mantener en segundo plano al cerrar"
                subtitle="Permite recibir alertas desde la bandeja del sistema"
                control={
                  <IosSwitch
                    checked={settings.minimizeToTray}
                    onChange={(val) => updateSetting('minimizeToTray', val)}
                    darkMode={darkMode}
                    ariaLabel="Mantener en segundo plano al cerrar"
                  />
                }
                isLast={true}
                darkMode={darkMode}
              />
            </SettingsGroup>
          </div>
        </div>
      </div>

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
