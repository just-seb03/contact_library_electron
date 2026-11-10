interface DashboardHeaderProps {
  todayLabel: string;
}

export function DashboardHeader({ todayLabel }: DashboardHeaderProps) {
  return (
    <div className="margin-bottom-half">
      <p className="text-color-gray no-margin-top margin-bottom-half">{todayLabel}</p>
      <h1 className="no-margin">Hola, bienvenido/a</h1>
    </div>
  );
}
