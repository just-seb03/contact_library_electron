import { Page, Navbar, Block, BlockTitle } from 'framework7-react';

export default function Dashboard() {
  return (
    <Page className="liquid-page">
      <Navbar title="Inicio" transparent />
      <BlockTitle>Bienvenido</BlockTitle>
      <Block>
        <p>Aquí irá el dashboard (En blanco por ahora).</p>
      </Block>
    </Page>
  );
}
