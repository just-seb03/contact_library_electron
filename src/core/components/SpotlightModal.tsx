import { useState, useEffect, useRef, useMemo, useCallback, type FC } from 'react';
import { createPortal } from 'react-dom';
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
  activeIcon?: string;
  action: () => void;
}

const CLOSE_ANIMATION_MS = 180;

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
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setIsClosing(false);
      setIsVisible(true);
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
      return;
    }

    setIsVisible((prevVisible) => {
      if (!prevVisible) return false;
      setIsClosing(true);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
        closeTimerRef.current = null;
      }, CLOSE_ANIMATION_MS);
      return true;
    });
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const animateAndClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      closeTimerRef.current = null;
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [isClosing, onClose]);

  const filteredResults: SearchResultItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const results: SearchResultItem[] = [];

    const handleNavigate = (tab: AppTab) => {
      setActiveTab(tab);
      navigateToTab(tab);
    };

    if (!q) {
      results.push(
        {
          id: 'action-home',
          type: 'action',
          title: 'Ir a Inicio',
          subtitle: 'Panel principal y resumen de actividades',
          icon: 'house',
          activeIcon: 'house_fill',
          action: () => handleNavigate('inicio'),
        },
        {
          id: 'action-calendar',
          type: 'action',
          title: 'Ir a Agenda',
          subtitle: 'Ver calendario y próximas audiencias',
          badge: `${hearings.length} citas`,
          icon: 'calendar',
          activeIcon: 'calendar_today',
          action: () => handleNavigate('calendar'),
        },
        {
          id: 'action-clients',
          type: 'action',
          title: 'Ver Clientes',
          subtitle: 'Directorio de expedientes y causas',
          badge: `${clients.length} clientes`,
          icon: 'person_2',
          activeIcon: 'person_2_fill',
          action: () => handleNavigate('cliente'),
        },
        {
          id: 'action-payments',
          type: 'action',
          title: 'Gestionar Pagos',
          subtitle: 'Honorarios, cobranzas e historial',
          icon: 'creditcard',
          activeIcon: 'creditcard_fill',
          action: () => handleNavigate('pagos'),
        },
        {
          id: 'action-theme',
          type: 'action',
          title: darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro',
          subtitle: 'Ajuste visual del sistema',
          icon: darkMode ? 'sun_max' : 'moon',
          activeIcon: darkMode ? 'sun_max_fill' : 'moon_fill',
          action: () => toggleDarkMode(),
        }
      );
      return results;
    }

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
          icon: 'person_2',
          activeIcon: 'person_2_fill',
          action: () => {
            setSelectedClientId(client.id);
            handleNavigate('cliente');
          },
        });
      }
    });

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
          icon: 'calendar',
          activeIcon: 'calendar_today',
          action: () => {
            setSelectedClientId(hearing.clientId);
            handleNavigate('calendar');
          },
        });
      }
    });

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
          activeIcon: 'calendar_today',
          action: () => handleNavigate('calendar'),
        });
      }
    });

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
          icon: 'creditcard',
          activeIcon: 'creditcard_fill',
          action: () => handleNavigate('pagos'),
        });
      }
    });

    return results;
  }, [query, clients, hearings, calendarEvents, payments, darkMode, setActiveTab, setSelectedClientId, toggleDarkMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || isClosing) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        animateAndClose();
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
          animateAndClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isClosing, filteredResults, selectedIndex, animateAndClose]);

  useEffect(() => {
    const activeEl = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isVisible) return null;

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buscador rápido"
      className={isClosing ? 'spot-backdrop-out' : 'spot-backdrop-in'}
      onClick={(e) => {
        if (e.target === e.currentTarget) animateAndClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.44)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '13vh',
      }}
    >
      <style>{`
        @keyframes spotBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spotBackdropOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes spotCardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spotCardOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(8px) scale(0.975); }
        }
        .spot-backdrop-in {
          animation: spotBackdropIn 0.2s ease forwards;
        }
        .spot-backdrop-out {
          animation: spotBackdropOut ${CLOSE_ANIMATION_MS}ms ease forwards;
        }
        .spot-card-in {
          animation: spotCardIn 0.26s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .spot-card-out {
          animation: spotCardOut ${CLOSE_ANIMATION_MS}ms cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .spot-backdrop-in,
          .spot-backdrop-out,
          .spot-card-in,
          .spot-card-out {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div
        className={isClosing ? 'spot-card-out' : 'spot-card-in'}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 580,
          maxWidth: '92vw',
          backgroundColor: 'var(--macos-modal-bg, #242428)',
          borderRadius: 18,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
          border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(28px) saturate(160%)',
          WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        }}
      >
        {/* Cabecera del buscador */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderBottom: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.14))',
          }}
        >
          <Icon
            f7="search"
            size="18px"
            style={{ color: 'var(--macos-text-secondary, #8e8e93)', flexShrink: 0 }}
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
              fontSize: 16,
              fontWeight: 450,
              color: 'var(--macos-text, #ececef)',
              fontFamily: 'inherit',
            }}
          />
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 999,
              backgroundColor: 'var(--macos-subtle-bg, rgba(128, 128, 136, 0.1))',
              border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.18))',
              color: 'var(--macos-text-secondary, #8e8e93)',
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
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {filteredResults.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: 'var(--macos-text-secondary, #8e8e93)',
                fontSize: 13.5,
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
                    animateAndClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    backgroundColor: isSelected
                      ? 'var(--macos-active-bg, rgba(128, 128, 136, 0.18))'
                      : 'transparent',
                    border: isSelected
                      ? '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))'
                      : '1px solid transparent',
                    transition: 'background-color 0.12s ease, border-color 0.12s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                    <Icon
                      f7={isSelected && item.activeIcon ? item.activeIcon : item.icon}
                      size="18px"
                      style={{
                        color: isSelected
                          ? 'var(--macos-text, #ececef)'
                          : 'var(--macos-text-secondary, #8e8e93)',
                        flexShrink: 0,
                        transition: 'color 0.12s ease',
                      }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: isSelected ? 600 : 500,
                          color: 'var(--macos-text, #ececef)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: 'var(--macos-text-secondary, #8e8e93)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: 2,
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        padding: '2px 9px',
                        borderRadius: 999,
                        backgroundColor: 'var(--macos-subtle-bg, rgba(128, 128, 136, 0.12))',
                        border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.18))',
                        color: isSelected
                          ? 'var(--macos-text, #ececef)'
                          : 'var(--macos-text-secondary, #8e8e93)',
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

        {/* Pie de atajos */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 16px',
            borderTop: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.14))',
            fontSize: 11,
            color: 'var(--macos-text-secondary, #8e8e93)',
            backgroundColor: 'var(--macos-subtle-bg, rgba(128, 128, 136, 0.04))',
          }}
        >
          <div style={{ display: 'flex', gap: 14 }}>
            <span><kbd style={{ fontWeight: 600 }}>↑↓</kbd> Navegar</span>
            <span><kbd style={{ fontWeight: 600 }}>↵</kbd> Seleccionar</span>
            <span><kbd style={{ fontWeight: 600 }}>ESC</kbd> Cerrar</span>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};

export default SpotlightModal;
