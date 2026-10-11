import { Page, Navbar, Block, BlockTitle } from 'framework7-react';

export default function Cliente() {
  return (
    <Page className="liquid-page">
      <Navbar title="Clientes" transparent />
      <BlockTitle>Gestión de Clientes</BlockTitle>
      <Block>
        <p>Aquí irá la interfaz para la gestión y vista de clientes.</p>
      </Block>
    </Page>
  );
}
