import React from 'react';
import { Card, CardHeader, CardContent, Icon, Button, Badge } from 'framework7-react';
import type { HearingEvent } from '../../../core/context/types';
import { GLASS_CARD_STYLE } from '../../../core/theme/style';

interface UpcomingMeetingCardProps {
  lawyerName?: string;
  greeting?: string;
  todayLabel: string;
  nextMeeting: HearingEvent | null;
  onOpenClient?: (clientId: number) => void;
  onViewSchedule?: () => void;
}

export const UpcomingMeetingCard: React.FC<UpcomingMeetingCardProps> = ({
  lawyerName = 'Abogado Titular',
  todayLabel,
  nextMeeting,
  onOpenClient,
}) => {
  return (
    <Card
      outline
      className="no-margin"
      style={{
        ...GLASS_CARD_STYLE,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardHeader style={{ padding: '14px 16px' }}>
        <div className="display-flex align-items-center justify-content-space-between" style={{ width: '100%' }}>
          <h3 className="no-margin" style={{ fontSize: '15px', fontWeight: 600, color: '#1c1c1e' }}>
            Próxima reunión
          </h3>
          {nextMeeting && (
            <Badge color="blue" style={{ fontSize: '11px', padding: '0 6px' }}>
              {nextMeeting.timeStr}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent style={{ padding: '0 16px 14px 16px' }}>

        {nextMeeting ? (
          <div
            style={{
              backgroundColor: 'rgba(0, 122, 255, 0.05)',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid rgba(0, 122, 255, 0.12)',
            }}
          >
            <div className="display-flex align-items-center margin-bottom-half">
              <Icon f7="person_fill" size="18px" className="text-color-blue margin-right-half" />
              <span style={{ fontSize: '15px' }}>
                <strong>Cliente:</strong> {nextMeeting.clientName}
              </span>
            </div>

            <div className="display-flex align-items-center">
              <Icon f7="briefcase_fill" size="18px" className="text-color-gray margin-right-half" />
              <span style={{ fontSize: '15px' }}>
                <strong>Materia:</strong> {nextMeeting.materia}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-align-center text-color-gray" style={{ padding: '16px 0', fontSize: '15px' }}>
            <p className="no-margin">Sin reuniones programadas</p>
          </div>
        )}

        {nextMeeting && onOpenClient && (
          <div className="display-flex justify-content-flex-end margin-top-half">
            <Button
              small
              round
              fill
              onClick={() => onOpenClient(nextMeeting.clientId)}
              style={{ fontSize: '12px' }}
            >
              Ver expediente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingMeetingCard;
