import { useState, useEffect, useRef, useMemo } from 'react';
import type { FC } from 'react';
import { Icon } from 'framework7-react';
import { useApp } from '../context/AppContext';
import { navigateToTab } from '../../navigation/navigation';
import type { AppTab } from '../context/types';

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  id: string;
  type: 'client' | 'hearing' | 'event' | 'payment' | 'action';
  title: string;
  subtitle: string;
  badge?: string;
  icon: string;
  iconColor: string;
  action: () => void;
}

export const SpotlightModal: FC<SpotlightModalProps> = ({ isOpen, onClose }) => {
  const {
    clients,
    hearings,
    calendarEvents,
    payments,
    setActiveTab,
    setSelectedClientId,
    toggleDarkMode,
    darkMode,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Manejo de atajos globales (Escape para salir, flechas para navegar, Enter para ejecutar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredResults[selectedIndex];
        if (selected) {
          selected.action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const filteredResults: SearchResultItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const results: SearchResultItem[] = [];

    const handleNavigate = (tab: AppTab) => {
      setActiveTab(tab);
      navigateToTab(tab);
    };

    if (!q) {
      // Acciones rápidas predeterminadas estilo Spotlight
      results.push(
        {
          id: 'action-home',
          type: 'action',
          title: 'Ir a Inicio',
          subtitle: 'Panel principal y resumen de actividades',
          icon: 'house_fill',
          iconColor: '#007aff',
          action: () => handleNavigate('inicio'),
        },
        {
          id: 'action-calendar',
          type: 'action',
          title: 'Ir a Agenda',
          subtitle: 'Ver calendario y próximas audiencias',
          badge: `${hearings.length} citas`,
          icon: 'calendar',
          iconColor: '#ff3b30',
          action: () => handleNavigate('calendar'),
        },
        {
          id: 'action-clients',
          type: 'action',
          title: 'Ver Clientes',
          subtitle: 'Directorio de expedientes y causas',
          badge: `${clients.length} clientes`,
          icon: 'person_2_fill',
          iconColor: '#5856d6',
          action: () => handleNavigate('cliente'),
        },
        {
          id: 'action-payments',
          type: 'action',
          title: 'Gestionar Pagos',
          subtitle: 'Honorarios, cobranzas e historial',
          icon: 'creditcard_fill',
          iconColor: '#34c759',
          action: () => handleNavigate('pagos'),
        },
        {
          id: 'action-theme',
          type: 'action',
          title: darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro',
          subtitle: 'Ajuste visual del sistema',
          icon: darkMode ? 'sun_max_fill' : 'moon_fill',
          iconColor: '#ff9500',
          action: () => toggleDarkMode(),
        }
      );
      return results;
    }

    // Buscar en Clientes
    clients.forEach((client) => {
      const match =
        client.name.toLowerCase().includes(q) ||
        (client.rut && client.rut.toLowerCase().includes(q)) ||
        (client.caso?.materia && client.caso.materia.toLowerCase().includes(q)) ||
        (client.email && client.email.toLowerCase().includes(q));

      if (match) {
        results.push({
          id: `client-${client.id}`,
          type: 'client',
          title: client.name,
          subtitle: `${client.caso?.materia || 'Cliente'} • RUT: ${client.rut || 'N/A'}`,
          badge: 'Cliente',
          icon: 'person_crop_circle_fill',
          iconColor: '#5856d6',
          action: () => {
            setSelectedClientId(client.id);
            handleNavigate('cliente');
          },
        });
      }
    });

    // Buscar en Audiencias
    hearings.forEach((hearing) => {
      const match =
        hearing.clientName.toLowerCase().includes(q) ||
        (hearing.materia && hearing.materia.toLowerCase().includes(q)) ||
        (hearing.expediente && hearing.expediente.toLowerCase().includes(q)) ||
        (hearing.juzgado && hearing.juzgado.toLowerCase().includes(q));

      if (match) {
        results.push({
          id: `hearing-${hearing.id}`,
          type: 'hearing',
          title: hearing.clientName,
          subtitle: `Audiencia: ${hearing.materia} • ${hearing.timeStr} • ${hearing.juzgado || ''}`,
          badge: 'Audiencia',
          icon: 'calendar_badge_clock',
          iconColor: '#ff3b30',
          action: () => {
            setSelectedClientId(hearing.clientId);
            handleNavigate('calendar');
          },
        });
      }
    });

    // Buscar en Eventos de Calendario
    calendarEvents.forEach((event) => {
      const match =
        event.title.toLowerCase().includes(q) ||
        (event.details && event.details.toLowerCase().includes(q));

      if (match) {
        results.push({
          id: `event-${event.id}`,
          type: 'event',
          title: event.title,
          subtitle: `${event.date} • ${event.startTime || ''} ${event.details || ''}`,
          badge: 'Evento',
          icon: 'calendar',
          iconColor: '#007aff',
          action: () => handleNavigate('calendar'),
        });
      }
    });

    // Buscar en Pagos
    payments.forEach((payment) => {
      const match =
        (payment.concept && payment.concept.toLowerCase().includes(q)) ||
        (payment.client && payment.client.toLowerCase().includes(q)) ||
        (payment.id && payment.id.toLowerCase().includes(q));

      if (match) {
        results.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          title: payment.concept || payment.client,
          subtitle: `Monto: $${payment.amount.toLocaleString('es-CL')} • ${payment.date} (${payment.status})`,
          badge: 'Pago',
          icon: 'creditcard_fill',
          iconColor: '#34c759',
          action: () => handleNavigate('pagos'),
        });
      }
    });

    return results;
  }, [query, clients, hearings, calendarEvents, payments, darkMode, setActiveTab, setSelectedClientId, toggleDarkMode]);

  // Autoscroll del elemento seleccionado en la lista
  useEffect(() => {
    const activeEl = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 580,
          maxWidth: '92vw',
          backgroundColor: darkMode ? 'rgba(34, 34, 38, 0.94)' : 'rgba(255, 255, 255, 0.94)',
          borderRadius: 14,
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.12)',
          border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
        }}
      >
        {/* Cabecera del buscador estilo Spotlight */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <Icon
            f7="search"
            size="20px"
            style={{ color: '#007aff', flexShrink: 0 }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Buscar clientes, audiencias, pagos o acciones..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 17,
              fontWeight: 450,
              color: darkMode ? '#ffffff' : '#1c1c1e',
              fontFamily: 'inherit',
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '3px 6px',
              borderRadius: 5,
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
              color: darkMode ? '#a1a1aa' : '#8e8e93',
            }}
          >
            ESC
          </span>
        </div>

        {/* Lista de resultados */}
        <div
          ref={listRef}
          style={{
            maxHeight: 380,
            overflowY: 'auto',
            padding: '6px',
          }}
        >
          {filteredResults.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: darkMode ? '#8e8e93' : '#8e8e93',
                fontSize: 14,
              }}
            >
              No se encontraron resultados para «{query}»
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    backgroundColor: isSelected
                      ? darkMode
                        ? 'rgba(0, 122, 255, 0.25)'
                        : 'rgba(0, 122, 255, 0.12)'
                      : 'transparent',
                    transition: 'background-color 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 7,
                        backgroundColor: isSelected ? item.iconColor : `${item.iconColor}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'background-color 0.1s ease',
                      }}
                    >
                      <Icon
                        f7={item.icon}
                        size="16px"
                        style={{
                          color: isSelected ? '#ffffff' : item.iconColor,
                        }}
                      />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 550,
                          color: isSelected
                            ? '#007aff'
                            : darkMode
                            ? '#ffffff'
                            : '#1c1c1e',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: darkMode ? '#a1a1aa' : '#8e8e93',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: 1,
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: '2px 8px',
                        borderRadius: 10,
                        backgroundColor: isSelected
                          ? 'rgba(0, 122, 255, 0.2)'
                          : darkMode
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
                        color: isSelected ? '#007aff' : darkMode ? '#c7c7cc' : '#636366',
                        flexShrink: 0,
                        marginLeft: 8,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pie de navegación con atajos de teclado estilo macOS */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            fontSize: 11,
            color: darkMode ? '#8e8e93' : '#8e8e93',
            backgroundColor: darkMode ? 'rgba(20, 20, 22, 0.4)' : 'rgba(245, 245, 247, 0.5)',
          }}
        >
          <div style={{ display: 'flex', gap: 14 }}>
            <span><kbd style={{ fontWeight: 600 }}>↑↓</kbd> Navegar</span>
            <span><kbd style={{ fontWeight: 600 }}>↵</kbd> Seleccionar</span>
            <span><kbd style={{ fontWeight: 600 }}>ESC</kbd> Cerrar</span>
          </div>
          <span>Spotlight Contact Library</span>
        </div>
      </div>
    </div>
  );
};

export default SpotlightModal;
