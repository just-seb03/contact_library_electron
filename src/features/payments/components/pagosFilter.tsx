import { useState, type FormEvent } from 'react';
import { Button, Icon, Input } from 'framework7-react';
import { PAYMENT_SURFACE_STYLE } from '../styles';

export interface PaymentFilters {
  invoiceId: string;
  startDate: string;
  endDate: string;
}

interface PaymentsFilterProps {
  onApplyFilters: (filters: PaymentFilters) => void;
}

export const PaymentsFilterBar = ({ onApplyFilters }: PaymentsFilterProps) => {
  const [invoiceId, setInvoiceId] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApplyFilters(getCurrentFilters());
  };

  const getCurrentFilters = (): PaymentFilters => ({
    invoiceId,
    startDate: selectedDates[0] ? toDateInputValue(selectedDates[0]) : '',
    endDate: selectedDates[1] ? toDateInputValue(selectedDates[1]) : '',
  });

  const handleResetDates = () => {
    setSelectedDates([]);
    onApplyFilters({ ...getCurrentFilters(), startDate: '', endDate: '' });
  };

  return (
    <section
      aria-label="Filtros de pagos"
      style={{
        ...PAYMENT_SURFACE_STYLE,
        padding: 16,
      }}
    >
      <h2 style={{ color: '#1c1c1e', fontSize: '16px', fontWeight: 650, margin: '0 0 12px' }}>
        Filtrar pagos
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          gap: '12px',
        }}
      >
        <label style={{ flex: '1 1 180px', minWidth: 0 }}>
          <span style={fieldLabelStyle}>ID de pago</span>
          <input
            type="search"
            value={invoiceId}
            onChange={(event) => setInvoiceId(event.target.value)}
            placeholder="Buscar ID..."
            style={fieldStyle}
          />
        </label>
        <label style={{ flex: '1 1 300px', minWidth: 0 }}>
          <span style={fieldLabelStyle}>Rango de fechas</span>
          <span style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Input
              type="datepicker"
              value={selectedDates}
              placeholder="Seleccionar fechas"
              calendarParams={{
                rangePicker: true,
                dateFormat: 'dd M, yyyy',
                locale: 'es-CL',
                openIn: 'popover',
              }}
              onCalendarChange={(value?: Date[]) => setSelectedDates(value ?? [])}
              style={{
                flex: 1,
                minWidth: 0,
                padding: 0,
                backgroundColor: 'transparent',
                border: 0,
                outline: 'none',
                fontSize: '13px',
              }}
            />
            <Icon f7="calendar" size="16px" style={{ color: '#8e8e93', flexShrink: 0 }} />
            <Button
              type="button"
              small
              outline
              aria-label="Restablecer rango de fechas"
              onClick={handleResetDates}
              style={{
                flexShrink: 0,
                minWidth: 'auto',
                width: '24px',
                height: '24px',
                padding: 0,
                borderRadius: '20%',
              }}
            >
              <Icon f7="arrow_counterclockwise" size="11px" />
            </Button>
          </span>
        </label>
        <Button
          type="submit"
          fill
          aria-label="Buscar pagos"
          style={{
            width: '42px',
            height: '38px',
            minWidth: '42px',
            borderRadius: '8px',
            backgroundColor: '#28a865',
            boxShadow: 'none',
          }}
        >
          <Icon f7="search" size="17px" />
        </Button>
      </form>
    </section>
  );
};

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const fieldLabelStyle = {
  display: 'block',
  marginBottom: '5px',
  color: '#6e6e73',
  fontSize: '12px',
  fontWeight: 500,
};

const fieldStyle = {
  width: '100%',
  height: '38px',
  boxSizing: 'border-box' as const,
  padding: '0 10px',
  color: '#1c1c1e',
  backgroundColor: '#f2f2f7',
  border: '1px solid #e5e5ea',
  borderRadius: '8px',
  outline: 'none',
  fontSize: '13px',
};
