import { Page, Navbar, Block, BlockTitle } from 'framework7-react';

export default function Settings() {
  return (
    <Page className="liquid-page">
      <Navbar title="Configuraciones" transparent />
      <BlockTitle>Ajustes del Sistema</BlockTitle>
      <Block>
        <p>Aquí irán las opciones y preferencias (En blanco por ahora).</p>
      </Block>
    </Page>
  );
}
