import { Page, Navbar, Block, BlockTitle } from 'framework7-react';

export default function Pagos() {
  return (
    <Page className="liquid-page">
      <Navbar title="Pagos" transparent />
      <BlockTitle>Gestión de Pagos</BlockTitle>
      <Block>
        <p>Aquí irá la interfaz de pagos y facturación.</p>
      </Block>
    </Page>
  );
}
