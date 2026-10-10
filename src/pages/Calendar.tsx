import { Page, Navbar, Block, BlockTitle } from 'framework7-react';

export default function Calendar() {
  return (
    <Page className="liquid-page">
      <Navbar title="Calendario" transparent />
      <BlockTitle>Fechas y Audiencias</BlockTitle>
      <Block>
        <p>Aquí irá el calendario del abogado (En blanco por ahora).</p>
      </Block>
    </Page>
  );
}
