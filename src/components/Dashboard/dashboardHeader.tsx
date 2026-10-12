import { Block } from 'framework7-react';

interface DashboardHeaderProps {
  todayLabel: string;
}

export function DashboardHeader({ todayLabel }: DashboardHeaderProps) {
  return (
    <Block
      style={{
        margin: '0 0 12px',
        padding: '20px 24px',
        flexShrink: 0,
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.92) 0%, rgba(0, 90, 220, 0.98) 100%)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.45)',
        boxShadow: '0 6px 18px rgba(0, 122, 255, 0.32), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(25px) saturate(190%)',
        WebkitBackdropFilter: 'blur(25px) saturate(190%)',
      }}
    >
      <div
        className="text-uppercase font-weight-600"
        style={{ fontSize: '12px', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.88)' }}
      >
        {todayLabel}
      </div>
      <h1 className="font-weight-bold" style={{ fontSize: '26px', margin: 0, lineHeight: 1.2, color: '#ffffff' }}>
        Hola, bienvenido/a
      </h1>
    </Block>
  );
}