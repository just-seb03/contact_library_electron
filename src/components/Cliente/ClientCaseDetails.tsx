import type { FC } from 'react';
import { Badge, BlockTitle, Button, Card, Icon, List, ListItem } from 'framework7-react';
import type { Client } from './types';
import { formatCLP } from '../../utils/format';

interface ClientCaseDetailsProps {
  client: Client;
}

export const ClientCaseDetails: FC<ClientCaseDetailsProps> = ({ client }) => {
  const { caso, pago } = client;

  return (
    <Card>
      <BlockTitle>Expediente y seguimiento jurídico</BlockTitle>
      {caso ? (
        <>
          <List>
            <ListItem title="Estado" after={caso.estado} />
            <ListItem title="Juzgado" after={caso.juzgado} />
            <ListItem title="N° de expediente" after={caso.expediente} />
            <ListItem title="Materia principal" after={caso.materia} />
          </List>

          {pago && (
            <>
              <BlockTitle>Gestión de pagos</BlockTitle>
              <List>
                <ListItem title="Concepto" after={pago.concepto} />
                <ListItem title="Monto" after={formatCLP(pago.monto)} />
                <ListItem title="Fecha de registro" after={pago.fecha} />
                <ListItem
                  title="Estado"
                >
                  <Badge slot="after" color={pago.estado === 'completed' ? 'green' : pago.estado === 'pending' ? 'orange' : 'red'}>
                    {pago.estado === 'completed' ? 'Cobrado' : pago.estado === 'pending' ? 'Pendiente' : 'Vencido'}
                  </Badge>
                </ListItem>
              </List>
            </>
          )}

          {caso.proximaAudiencia && (
            <>
              <BlockTitle>Próxima audiencia</BlockTitle>
              <List>
                <ListItem title={caso.proximaAudiencia}>
                  <Icon slot="media" f7="calendar_badge_plus" />
                </ListItem>
              </List>
            </>
          )}

          <div className="block">
            <Button fill color="blue" className="margin-bottom">
              <Icon f7="arrow_up_doc_fill" className="margin-right-half" />
              Subir archivo
            </Button>
            <Button outline color="blue">
              <Icon f7="folder_fill" className="margin-right-half" />
              Ver archivos
            </Button>
          </div>
        </>
      ) : (
        <div className="block text-align-center">
          <Icon f7="folder_badge_plus" size="38px" />
          <h3>Sin expediente activo</h3>
          <p>Aún no se ha registrado un expediente judicial para {client.name}.</p>
          <Button fill color="blue">
            <Icon f7="plus" className="margin-right-half" />
            Crear nuevo expediente
          </Button>
        </div>
      )}
    </Card>
  );
};
