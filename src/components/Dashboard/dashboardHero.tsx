import { Card, CardContent, Icon } from 'framework7-react';
import { useApp } from '../../context/AppContext';

interface DashboardHeroProps {
  todayHearingsCount: number;
  paymentsToReviewCount: number;
}

export function DashboardHero({ todayHearingsCount, paymentsToReviewCount }: DashboardHeroProps) {
  const { darkMode } = useApp();

  return (
    <Card
      outline={false}
      className="no-border margin-horizontal-none"
      style={{
        margin: '0 0 12px',
        border: darkMode ? 'none' : '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: '18px',
        background: darkMode ? 'rgba(22, 24, 30, 0.65)' : 'rgba(255, 255, 255, 0.45)',
        boxShadow: darkMode ? '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.08)' : '0 8px 24px rgba(35, 45, 65, 0.045)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        flexShrink: 0,
        color: darkMode ? '#f5f5f7' : 'inherit',
      }}
    >
      <CardContent style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px' }}>
        <div
          className="dashboard-icon-box"
          style={{
            width: '42px',
            height: '42px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '14px',
            background: darkMode ? 'rgba(0, 122, 255, 0.2)' : '#e9f2ff',
            color: darkMode ? '#64d2ff' : '#2878d0',
            fontSize: '20px',
          }}
        >
          <Icon f7="sun_max_fill" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: '16px', lineHeight: 1.3, margin: 0, fontWeight: 700, color: 'inherit' }}>
            {todayHearingsCount === 0
              ? 'Hoy no tienes audiencias programadas'
              : `Tienes ${todayHearingsCount} ${todayHearingsCount === 1 ? 'audiencia' : 'audiencias'} hoy`}
          </h2>
          <p className="text-color-gray" style={{ margin: '4px 0 0', fontSize: '12px' }}>
            {paymentsToReviewCount > 0
              ? `${paymentsToReviewCount} ${paymentsToReviewCount === 1 ? 'cobro pendiente necesita' : 'cobros pendientes necesitan'} tu atención.`
              : 'Todo listo para organizar tu jornada.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}