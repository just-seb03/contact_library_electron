import { Button, Icon } from 'framework7-react';

interface RegisterPaymentButtonProps {
  onClick: () => void;
}

export const RegisterPaymentButton = ({ onClick }: RegisterPaymentButtonProps) => {
  return (
    <div className="display-flex justify-content-center margin-top">
      <Button fill round color="blue" onClick={onClick} className="padding-horizontal elevation-3">
        <Icon f7="plus_circle_fill" size="16px" className="margin-right-half" />
        Registrar Cobro
      </Button>
    </div>
  );
};