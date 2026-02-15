import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Usuarios · Trader Deportivo',
  description: 'Panel de administración - Gestión de usuarios de la plataforma.',
};

export default function AdminUsers() {
  return (
    <div className="app-role--admin">
      <main className="main-content">
        <header className="dashboard-header">
          <h1 className="app-page-title">Gestión de Usuarios</h1>
          <p className="dashboard-subtitle">Administra los usuarios de la plataforma</p>
        </header>

        <section className="dashboard-content">
          <div className="content-card">
            <div className="card-header">
              <h2>Lista de Usuarios</h2>
              <button className="btn btn-primary">Nuevo Usuario</button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Última Actividad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#001</td>
                      <td>Juan García</td>
                      <td>juan@example.com</td>
                      <td><span className="badge badge-user">Usuario</span></td>
                      <td><span className="badge badge-active">Activo</span></td>
                      <td>Hace 2 horas</td>
                      <td>
                        <button className="btn btn-sm btn-outline">Editar</button>
                        <button className="btn btn-sm btn-outline">Ver</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#002</td>
                      <td>Carlos Trading</td>
                      <td>carlos@example.com</td>
                      <td><span className="badge badge-tipster">Tipster</span></td>
                      <td><span className="badge badge-active">Activo</span></td>
                      <td>Hace 1 día</td>
                      <td>
                        <button className="btn btn-sm btn-outline">Editar</button>
                        <button className="btn btn-sm btn-outline">Ver</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#003</td>
                      <td>Ana Martínez</td>
                      <td>ana@example.com</td>
                      <td><span className="badge badge-user">Usuario</span></td>
                      <td><span className="badge badge-inactive">Inactivo</span></td>
                      <td>Hace 1 semana</td>
                      <td>
                        <button className="btn btn-sm btn-outline">Editar</button>
                        <button className="btn btn-sm btn-outline">Ver</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}