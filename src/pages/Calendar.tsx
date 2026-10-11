import { useState } from 'react';
import { Page, Block, Card, CardContent, List, ListItem, Icon, BlockTitle } from 'framework7-react';
import { DayScheduleOverlay } from '../components/Calendar/DayScheduleOverlay';

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const currentDate = new Date();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();

  // Calculamos los días dinámicamente para el mes actual
  const firstDay = new Date(currentYear, currentDate.getMonth(), 1);
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = firstDay.getDay(); // 0 = Domingo, 1 = Lunes, etc.

  const emptyBefore = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyAfterCount = 42 - firstDayOfWeek - daysInMonth;
  const emptyAfter = Array.from({ length: emptyAfterCount > 0 ? emptyAfterCount : 0 }, (_, i) => i);

  return (
    <Page>
      {/* Header personalizado manteniendo la visual anterior pero con clases flex de F7 */}
      <Block className="display-flex justify-content-space-between align-items-center" style={{ marginTop: '60px', marginBottom: '24px' }}>
        
        {/* Izquierda: Título y Fecha */}
        <div className="display-flex align-items-center">
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: '#000', letterSpacing: '-0.5px' }}>
            {currentMonth} {currentYear}
          </h1>
          <Icon f7="chevron_right" size="18px" color="gray" style={{ marginLeft: '12px', cursor: 'pointer' }} />
        </div>



        {/* Derecha: Barra de Búsqueda */}
        <div className="display-flex align-items-center" style={{ backgroundColor: '#FFF', border: '1px solid #E5E5E5', borderRadius: '10px', padding: '8px 14px', width: '320px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' }}>
          <Icon f7="search" size="16px" color="gray" style={{ marginRight: '8px' }} />
          <input type="text" placeholder="Buscar audiencias, casos, clientes..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '15px', color: '#333' }} />
        </div>
      </Block>

      <Block>
        <div className="row">
          {/* Columna Izquierda: Calendario y Detalles del Día */}
          <div className="col-100 medium-65">
            
            {/* Calendario con Grid CSS embebido en Card Nativa */}
            <Card>
              <CardContent padding={false}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', backgroundColor: '#e0e0e0', gap: '1px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                    <div key={d} style={{ fontWeight: '600', padding: '10px 0', backgroundColor: '#f9f9f9', color: '#555', fontSize: '13px' }}>{d}</div>
                  ))}

                  {emptyBefore.map(i => (
                    <div key={`eb-${i}`} style={{ backgroundColor: '#fafafa', minHeight: '70px' }}></div>
                  ))}

                  {days.map(d => (
                    <div 
                      key={d} 
                      onClick={() => setSelectedDay(d)}
                      style={{
                        minHeight: '70px',
                        backgroundColor: d === currentDay ? 'var(--f7-theme-color)' : '#fff',
                        color: d === currentDay ? '#fff' : '#333',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        padding: '6px 8px',
                        fontWeight: d === currentDay ? 'bold' : 'normal',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                    }}>
                      <span style={{ fontSize: '15px' }}>{d}</span>
                    </div>
                  ))}

                  {emptyAfter.map(i => (
                    <div key={`ea-${i}`} style={{ backgroundColor: '#fafafa', minHeight: '70px' }}></div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tarjeta Nativa para Detalles del Día */}
            <Card>
              <CardContent className="display-flex align-items-center">
                <div style={{ minWidth: '80px', textAlign: 'center' }}>
                  <div style={{ fontSize: '15px', color: 'gray', textTransform: 'uppercase', fontWeight: '500' }}>{currentMonth}</div>
                  <div style={{ fontSize: '40px', fontWeight: 'bold', lineHeight: '1' }}>{currentDay}</div>
                </div>
                <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '20px', marginLeft: '20px' }}>
                  <List mediaList style={{ margin: 0 }}>
                    <ListItem
                      title="Sin eventos programados"
                      subtitle="Espacio reservado para detalles de audiencia / caso"
                      style={{ backgroundColor: '#f7f7f8', borderRadius: '12px', opacity: 0.7 }}
                    >
                      <Icon slot="media" f7="calendar_badge_minus" size="30px" color="gray" />
                    </ListItem>
                  </List>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha: Próximas Audiencias */}
          <div className="col-100 medium-35">
            <BlockTitle style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#000' }}>Próximas Audiencias</BlockTitle>
            <Card>
              <List mediaList>
                {/* Placeholders creados con Listas nativas de Framework7 */}
                {[1, 2, 3, 4].map(i => (
                  <ListItem
                    key={i}
                    title="----------------"
                    subtitle="------------"
                    text="---------------------------------"
                    style={{ opacity: 0.4 }}
                  >
                    <div slot="media" style={{ width: '60px', height: '60px', backgroundColor: '#e5e5e5', borderRadius: '6px' }}></div>
                  </ListItem>
                ))}
              </List>
            </Card>
          </div>
        </div>
      </Block>
      
      {selectedDay !== null && (
        <DayScheduleOverlay 
          date={selectedDay}
          month={currentMonth}
          year={currentYear}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </Page>
  );
}
