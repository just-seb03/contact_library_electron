import { Block, BlockTitle, Card, Icon, List, ListItem, Page, Toggle } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';

export default function Configuration() {
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <Page noNavbar noToolbar>
      <Block className="no-margin-top padding-top-half">
        <h1 className="no-margin-top">Configuraciones</h1>
        <p className="text-color-gray margin-bottom-half">
          Personaliza la apariencia del sistema, gestiona las preferencias y revisa el estado de sincronización.
        </p>

        <BlockTitle>Apariencia y tonalidad</BlockTitle>
        <Card>
          <List>
            <ListItem
              title="Modo oscuro"
              subtitle={darkMode ? 'Activado para todas las vistas' : 'Desactivado'}
            >
              <Icon slot="media" f7={darkMode ? 'moon_stars_fill' : 'sun_max_fill'} />
              <Toggle slot="after" checked={darkMode} onChange={toggleDarkMode} />
            </ListItem>
          </List>
        </Card>

        <BlockTitle>Notificaciones y alertas</BlockTitle>
        <Card>
          <List>
            <ListItem
              title="Alertas de audiencias judiciales"
              subtitle="Recordatorios automáticos de comparecencias fijadas en los expedientes"
            >
              <Icon slot="media" f7="calendar" />
              <Toggle slot="after" defaultChecked />
            </ListItem>
            <ListItem
              title="Recordatorios de cobros"
              subtitle="Avisos sobre honorarios pendientes y facturas próximas a vencer"
            >
              <Icon slot="media" f7="creditcard_fill" />
              <Toggle slot="after" defaultChecked />
            </ListItem>
          </List>
        </Card>

        <BlockTitle>Información del software</BlockTitle>
        <Card>
          <List>
            <ListItem
              title="Contact Library Desktop"
              subtitle="Framework7 v9.2 · React 18 · Electron 30 · Vite"
              after="v1.0.0"
            >
              <Icon slot="media" f7="desktopcomputer" />
            </ListItem>
          </List>
        </Card>
      </Block>
    </Page>
  );
}
