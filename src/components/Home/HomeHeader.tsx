import { Navbar, Block } from 'framework7-react';

export function HomeHeader() {
    return (
        <div className="home-header-container width-100">
            <Navbar title="Inicio" transparent />
            
            <Block className="text-align-center margin-top-large">
                <h1 className="margin-bottom-half text-color-black" style={{ fontSize: '2.75rem', fontWeight: 800 }}>
                    Biblioteca de Contactos
                </h1>
                <p className="text-color-gray margin-horizontal-auto" style={{ fontSize: '1.15rem', maxWidth: '520px' }}>
                    Bienvenido al sistema de gestión de contactos y expedientes.
                </p>
            </Block>
        </div>
    );
}

export default HomeHeader;
