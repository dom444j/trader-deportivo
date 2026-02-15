import PageFrame from '@/components/shared/layout/PageFrame';

export default function UserDashboardPage() {
  return (
    <PageFrame 
      title="Dashboard de Usuario" 
      subtitle="Bienvenido a tu panel de control personalizado"
      actions={
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ 
            padding: '0.5rem 1rem', 
            background: '#0066FF', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}>
            Nueva Señal
          </button>
          <button style={{ 
            padding: '0.5rem 1rem', 
            background: '#00FF94', 
            color: '#0A0A1A', 
            border: 'none', 
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            Recargar
          </button>
        </div>
      }
    >
      <div style={{ padding: '2rem' }}>
        <h2 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>Panel de Control</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: '#141428',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #2A2A4A'
          }}>
            <h3 style={{ color: '#00F5FF', marginBottom: '0.5rem' }}>Señales Activas</h3>
            <p style={{ color: '#FFFFFF', fontSize: '2rem', fontWeight: 'bold' }}>12</p>
          </div>
          <div style={{
            background: '#141428',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #2A2A4A'
          }}>
            <h3 style={{ color: '#00FF94', marginBottom: '0.5rem' }}>ROI Mensual</h3>
            <p style={{ color: '#FFFFFF', fontSize: '2rem', fontWeight: 'bold' }}>+15.2%</p>
          </div>
          <div style={{
            background: '#141428',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #2A2A4A'
          }}>
            <h3 style={{ color: '#B026FF', marginBottom: '0.5rem' }}>Créditos</h3>
            <p style={{ color: '#FFFFFF', fontSize: '2rem', fontWeight: 'bold' }}>1,250</p>
          </div>
        </div>
        
        <div style={{
          background: '#141428',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid #2A2A4A'
        }}>
          <h3 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>Últimas Señales</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              background: '#1E1E38',
              borderRadius: '0.375rem'
            }}>
              <span style={{ color: '#FFFFFF' }}>Real Madrid vs Barcelona</span>
              <span style={{ color: '#00FF94', fontWeight: '600' }}>Ganada</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              background: '#1E1E38',
              borderRadius: '0.375rem'
            }}>
              <span style={{ color: '#FFFFFF' }}>Manchester United vs Liverpool</span>
              <span style={{ color: '#FFD700', fontWeight: '600' }}>Pendiente</span>
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}