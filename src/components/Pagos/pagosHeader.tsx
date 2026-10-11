export const PaymentsHeader = () => {
  return (
    <header className="display-flex justify-content-space-between align-items-center margin-bottom">
      <div>
        <h1 className="font-weight-bold margin-bottom-half" style={{ fontSize: '26px' }}>
          Gestión de Pagos
        </h1>
        <p className="text-color-gray margin-top-none" style={{ fontSize: '13px' }}>
          Control de honorarios, cobranzas y facturación
        </p>
      </div>
    </header>
  );
};