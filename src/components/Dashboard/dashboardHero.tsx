import { Card, CardContent, Icon } from 'framework7-react';

interface DashboardHeroProps {
  todayHearingsCount: number;
  paymentsToReviewCount: number;
}

export function DashboardHero({ todayHearingsCount, paymentsToReviewCount }: DashboardHeroProps) {
  return (
    <Card
      className="elevation-2 margin-horizontal-none"
      style={{
        margin: '0 0 12px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: '18px',
        background: 'rgba(255, 255, 255, 0.45)',
        boxShadow: '0 8px 24px rgba(35, 45, 65, 0.045)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        flexShrink: 0,
      }}
    >
      <CardContent style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '14px',
            background: '#e9f2ff',
            color: '#2878d0',
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