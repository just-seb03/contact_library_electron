import { useState, useEffect, type CSSProperties, type FormEvent } from 'react';
import { Page, Icon } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import { SettingsGroup } from '../components/SettingsGroup';
import { SettingsRow } from '../components/SettingsRow';
import { IosSwitch } from '../components/IosSwitch';
import { SettingsProfileCard } from '../components/SettingsProfileCard';
import { SettingsAppearanceSelector } from '../components/SettingsAppearanceSelector';
import type { ProfileFormData } from '../components/EditProfileModal';
import type { AppleAccentColor } from '../data/settingsData';
import { APP_THEMES } from '../../../core/theme/themes';

type SettingsTab = 'general' | 'tema' | 'perfil';

const SETTINGS_TABS: { id: SettingsTab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'tema', label: 'Tema' },
  { id: 'perfil', label: 'Perfil' },
];

export default function Configuration() {
  const { darkMode, toggleDarkMode, settings, updateSetting, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: settings.lawyerName,
    firm: settings.lawyerFirm,
    email: settings.lawyerEmail,
  });

  useEffect(() => {
    setProfileForm({
      name: settings.lawyerName,
      firm: settings.lawyerFirm,
      email: settings.lawyerEmail,
    });
  }, [settings.lawyerName, settings.lawyerFirm, settings.lawyerEmail]);

  const isProfileDirty =
    profileForm.name !== settings.lawyerName ||
    profileForm.firm !== settings.lawyerFirm ||
    profileForm.email !== settings.lawyerEmail;

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;
    updateSettings({
      lawyerName: profileForm.name.trim(),
      lawyerFirm: profileForm.firm.trim(),
      lawyerEmail: profileForm.email.trim(),
    });
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleResetProfile = () => {
    setProfileForm({
      name: settings.lawyerName,
      firm: settings.lawyerFirm,
      email: settings.lawyerEmail,
    });
    setProfileSaved(false);
  };

  const handleAccentColorChange = (color: AppleAccentColor) => {
    updateSetting('accentColor', color);
  };

  const rootWrapperStyle: CSSProperties = {
    height: 'calc(100vh - 58px)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  };

  const tabHeaderStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '10px 28px 0 28px',
    maxWidth: 980,
    width: '100%',
    boxSizing: 'border-box',
    flexShrink: 0,
  };

  const tabSwitcherStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 24,
    width: '100%',
    borderBottom: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.14))',
    userSelect: 'none',
  };

  const tabButtonStyle = (active: boolean): CSSProperties => ({
    padding: '6px 2px 10px 2px',
    marginBottom: -1,
    border: 'none',
    borderBottom: active
      ? '2px solid var(--macos-text, #ececef)'
      : '2px solid transparent',
    outline: 'none',
    fontSize: 13.5,
    fontWeight: active ? 650 : 500,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: active ? 'var(--macos-text, #ececef)' : 'var(--macos-text-muted, #888890)',
    transition: 'color 0.15s ease, border-color 0.15s ease',
  });

  const scrollWrapperStyle: CSSProperties = {
    flex: 1,
    minHeight: 0,
    width: '100%',
    overflowY: 'auto',
    boxSizing: 'border-box',
    maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 88px), transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 88px), transparent 100%)',
  };

  const pageContainerStyle: CSSProperties = {
    maxWidth: 980,
    width: '100%',
    margin: 0,
    padding: '18px 28px 96px 28px',
    boxSizing: 'border-box',
  };

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--macos-text-secondary, #8e8e93)',
    marginBottom: 6,
  };

  const inputStyle: CSSProperties = {
    height: 36,
    padding: '0 12px',
    borderRadius: 10,
    border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.2))',
    backgroundColor: 'var(--macos-input-bg, rgba(128, 128, 136, 0.08))',
    color: 'var(--macos-text, #ececef)',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
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

      <div style={rootWrapperStyle}>
        <div style={tabHeaderStyle}>
          <div style={tabSwitcherStyle} role="tablist" aria-label="Secciones de configuración">
            {SETTINGS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={tabButtonStyle(activeTab === tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={scrollWrapperStyle}>
          <div key={activeTab} style={pageContainerStyle}>
            {activeTab === 'general' && (
              <>
                <div className="cfg-anim" style={{ animationDelay: '30ms' }}>
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

                <div className="cfg-anim" style={{ animationDelay: '80ms' }}>
                  <SettingsGroup title="Sistema" darkMode={darkMode}>
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
                      isLast={false}
                      darkMode={darkMode}
                    />
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
              </>
            )}

            {activeTab === 'tema' && (
              <div className="cfg-anim" style={{ animationDelay: '30ms' }}>
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
                </SettingsGroup>
              </div>
            )}

            {activeTab === 'perfil' && (
              <>
                <div className="cfg-anim" style={{ animationDelay: '30ms' }}>
                  <SettingsProfileCard
                    name={profileForm.name || settings.lawyerName}
                    firm={profileForm.firm || settings.lawyerFirm}
                    email={profileForm.email || settings.lawyerEmail}
                    darkMode={darkMode}
                  />
                </div>

                <div className="cfg-anim" style={{ animationDelay: '80ms' }}>
                  <SettingsGroup title="Datos del despacho" darkMode={darkMode}>
                    <form onSubmit={handleSaveProfile} style={{ padding: '16px 18px' }}>
                      <div style={{ marginBottom: 14 }}>
                        <label style={labelStyle}>Nombre del Titular o Abogado</label>
                        <input
                          type="text"
                          required
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          style={inputStyle}
                          placeholder="Ej. Sebastián Contreras"
                        />
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <label style={labelStyle}>Firma o Estudio Jurídico</label>
                        <input
                          type="text"
                          required
                          value={profileForm.firm}
                          onChange={(e) => setProfileForm({ ...profileForm, firm: e.target.value })}
                          style={inputStyle}
                          placeholder="Ej. Contreras & Asociados • Litigios"
                        />
                      </div>

                      <div style={{ marginBottom: 18 }}>
                        <label style={labelStyle}>Correo Electrónico de Contacto</label>
                        <input
                          type="email"
                          required
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          style={inputStyle}
                          placeholder="abogado@despacho.cl"
                        />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                          paddingTop: 12,
                          borderTop: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.14))',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: 'var(--macos-text-secondary, #8e8e93)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            opacity: profileSaved ? 1 : 0,
                            transition: 'opacity 0.2s ease',
                          }}
                        >
                          <Icon f7="checkmark_circle_fill" size="13px" />
                          <span>Cambios guardados</span>
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {isProfileDirty && (
                            <button
                              type="button"
                              onClick={handleResetProfile}
                              style={{
                                height: 32,
                                padding: '0 14px',
                                borderRadius: 999,
                                border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))',
                                backgroundColor: 'var(--macos-subtle-bg, rgba(128, 128, 136, 0.08))',
                                color: 'var(--macos-text, #ececef)',
                                fontSize: 12.5,
                                fontWeight: 500,
                                cursor: 'pointer',
                              }}
                            >
                              Restablecer
                            </button>
                          )}

                          <button
                            type="submit"
                            style={{
                              height: 32,
                              padding: '0 16px',
                              borderRadius: 999,
                              border: '1px solid rgba(255, 255, 255, 0.14)',
                              backgroundColor: 'var(--macos-text, #ececef)',
                              color: 'var(--macos-canvas-bg, #18181a)',
                              fontSize: 12.5,
                              fontWeight: 600,
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
                            }}
                          >
                            Guardar cambios
                          </button>
                        </div>
                      </div>
                    </form>
                  </SettingsGroup>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}
