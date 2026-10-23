import { Navbar, Block } from 'framework7-react';

export function HomeHeader() {
  return (
    <div>
      <Navbar title="Inicio" transparent />

      <Block className="text-align-center margin-top-large">
        <h1 className="margin-bottom-half">
          Biblioteca de Contactos
        </h1>
        <p className="text-color-gray margin-horizontal-auto">
          Bienvenido al sistema de gestión de contactos y expedientes.
        </p>
      </Block>
    </div>
  );
}

export default HomeHeader;
