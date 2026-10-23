import { Page, Card, CardContent } from 'framework7-react';
import { useHomeData } from '../hooks/useHomeData';
import { UpcomingMeetingCard } from '../components/UpcomingMeetingCard';
import { GLASS_CARD_STYLE } from '../../../core/theme/style';

export default function HomePage() {
  const {
    lawyerName,
    greeting,
    todayLabel,
    nextMeeting,
    openClient,
    showTab,
  } = useHomeData();

  return (
    <Page noNavbar noToolbar>
      <div
        style={{
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '1200px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Título de bienvenida */}
        <div>
          <h1 className="no-margin font-weight-bold" style={{ fontSize: '28px', color: '#1c1c1e' }}>
            Bienvenido
          </h1>
        </div>

        {/* Fila superior: Carta de bienvenida compacta (izq) y carta vacía (der) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '16px',
            alignItems: 'stretch',
          }}
        >
          <UpcomingMeetingCard
            lawyerName={lawyerName}
            todayLabel={todayLabel}
            nextMeeting={nextMeeting}
            onOpenClient={openClient}
            onViewSchedule={() => showTab('calendar')}
          />

          {/* Carta vacía derecha */}
          <Card
            outline
            className="no-margin"
            style={{
              ...GLASS_CARD_STYLE,
              height: '100%',
              minHeight: '170px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CardContent className="text-align-center text-color-gray">
              {/* Espacio reservado con efecto translúcido */}
            </CardContent>
          </Card>
        </div>

        {/* Fila inferior: Carta vacía horizontal */}
        <Card
          outline
          className="no-margin"
          style={{
            ...GLASS_CARD_STYLE,
            width: '100%',
            minHeight: '260px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardContent className="text-align-center text-color-gray">
            {/* Espacio reservado horizontal con efecto translúcido */}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}


