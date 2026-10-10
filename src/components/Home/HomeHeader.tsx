import { Navbar, NavLeft, Link, Icon, Block } from 'framework7-react';

export function HomeHeader() {
    return (
        <div className="home-header-container" style={{ width: '100%' }}>
            <Navbar title="Inicio" transparent>

            </Navbar>
            <Block className="text-align-center" style={{ margin: '40px 0 0 0' }}>
                <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 12px 0', color: '#1c1c1e' }}>
                    Biblioteca de Contactos
                </h1>
                <p style={{ fontSize: '1.15rem', color: '#6e6e73', margin: '0 auto', maxWidth: '520px' }}>
                    Bienvenido al sistema de gestión de contactos y expedientes.
                </p>
            </Block>
        </div>
    );
}

export default HomeHeader;
