import React from 'react';
import { Card, CardHeader, CardContent, Icon, Button, Badge } from 'framework7-react';
import type { HearingEvent } from '../../../core/context/types';
import { DASHBOARD_INNER_SURFACE_STYLE, DASHBOARD_WIDGET_STYLE } from '../styles';

interface UpcomingMeetingCardProps {
  nextMeeting: HearingEvent | null;
  onOpenClient?: (clientId: number) => void;
}

export const UpcomingMeetingCard: React.FC<UpcomingMeetingCardProps> = ({
  nextMeeting,
  onOpenClient,
}) => {
  const meetingDateParts = nextMeeting
    ? new Intl.DateTimeFormat('es-CL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).formatToParts(new Date(nextMeeting.year, nextMeeting.monthIndex, nextMeeting.day))
    : [];
  const nextMeetingDate = meetingDateParts
    .map((part) => {
      if (part.type !== 'weekday' && part.type !== 'month') return part.value;
      return `${part.value.charAt(0).toLocaleUpperCase('es-CL')}${part.value.slice(1)}`;
    })
    .join('');

  return (
    <Card
      outline
      className="no-margin"
      style={{
        ...DASHBOARD_WIDGET_STYLE,
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
        </div>
      </CardHeader>

      <CardContent style={{ padding: '0 16px 14px 16px' }}>

        {nextMeeting ? (
          <div
            style={{
              ...DASHBOARD_INNER_SURFACE_STYLE,
              backgroundColor: 'rgba(0, 122, 255, 0.055)',
              padding: '12px',
            }}
          >
            <div
              className="display-flex align-items-center margin-bottom-half"
              style={{ flexWrap: 'wrap', gap: '8px' }}
            >
              <Icon f7="calendar" size="18px" className="text-color-blue margin-right-half" />
              <span style={{ fontSize: '15px' }}>
                {nextMeetingDate}
              </span>
              <Badge color="blue" style={{ fontSize: '11px', padding: '0 6px' }}>
                {nextMeeting.timeStr}
              </Badge>
            </div>

            <div className="display-flex align-items-center margin-bottom-half">
              <Icon f7="person_fill" size="18px" className="text-color-blue margin-right-half" />
              <span style={{ fontSize: '15px' }}>
                {nextMeeting.clientName}
              </span>
            </div>

            <div className="display-flex align-items-center">
              <Icon f7="briefcase_fill" size="18px" className="text-color-gray margin-right-half" />
              <span style={{ fontSize: '15px' }}>
                {nextMeeting.materia}
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
              style={{ fontSize: '14px' }}
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
