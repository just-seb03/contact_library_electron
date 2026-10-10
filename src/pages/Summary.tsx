import { Page, Navbar, Block, BlockTitle } from 'framework7-react';

export default function Summary() {
  return (
    <Page className="liquid-page">
      <Navbar title="Sumario" transparent />
      <BlockTitle>Dashboard</BlockTitle>
      <Block>
        <p>Aquí irá el sumario y los expedientes (En blanco por ahora).</p>
      </Block>
    </Page>
  );
}
