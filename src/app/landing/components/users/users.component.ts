import { Component } from '@angular/core';

interface UserRole {
  roleName: string;
  badge: string;
  description: string;
  responsibilities: string[];
  icon: 'admin' | 'operator' | 'auditor';
}

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  roles: UserRole[] = [
    {
      roleName: 'Administradores',
      badge: 'Gobernanza del Sistema',
      description: 'Configuración integral de la plataforma, gestión de accesos de usuarios, definición de reglamentos maestros y parámetros de seguridad.',
      responsibilities: [
        'Creación de deportes y reglamentos maestros',
        'Asignación de permisos y roles de usuario',
        'Gestión del catálogo de sedes e instalaciones'
      ],
      icon: 'admin'
    },
    {
      roleName: 'Operadores y Directores de Campo',
      badge: 'Operaciones Diarias',
      description: 'Gestión de la ejecución de torneos, aprobación de nóminas de equipos, programación de partidos, registro de resultados y asignación de sedes.',
      responsibilities: [
        'Validación de inscripciones y revisión de equipos',
        'Programación de partidos y actas arbitrales',
        'Registro en tiempo real de marcadores y clasificaciones'
      ],
      icon: 'operator'
    },
    {
      roleName: 'Auditores y Oficiales de Cumplimiento',
      badge: 'Verificación y Trazabilidad',
      description: 'Revisión de registros históricos, elegibilidad de participantes, autenticidad de documentos legales y sanciones.',
      responsibilities: [
        'Verificación de autenticidad documental',
        'Inspección de pistas de auditoría del sistema',
        'Certificación oficial de cumplimiento'
      ],
      icon: 'auditor'
    }
  ];

  targetInstitutions = [
    'Entidades gubernamentales y secretarías de deportes',
    'Municipios y consejos locales',
    'Instituciones educativas y universidades',
    'Clubes deportivos y asociaciones atléticas',
    'Federaciones deportivas y ligas regionales',
    'Organizadores independientes de torneos',
    'Empresas y entidades privadas'
  ];
}
