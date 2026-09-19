/**
 * Sports Event domain models conforming strictly to backend specifications.
 * Reference: docs/01_functionality_docs/protected/events_management.md
 */

export interface EventItem {
  id: number;
  title: string;
  description: string;
  sportType: string;
  location: string;
  startDate: string; // ISO local representation e.g. '2026-10-15T09:00:00'
  endDate: string;   // ISO local representation e.g. '2026-10-20T18:00:00'
  status: string;    // 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
  maxParticipants: number;
  currentParticipants: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  sportType: string;
  location: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
}

export interface CreatedEventData {
  id: number;
  title: string;
  sportType: string;
  status: string;
  createdAt: string;
}

export interface UpdateEventRequest {
  title: string;
  description: string;
  sportType: string;
  location: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
}

export interface UpdatedEventData {
  id: number;
  title: string;
  status: string;
  updatedAt: string;
}

export interface EventPageData {
  items: EventItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Spanish presentation mappings for sport types.
 * Technical identifiers remain untouched during API communication.
 */
export const SPORT_TYPE_LABELS: Record<string, string> = {
  FOOTBALL: 'Fútbol',
  BASKETBALL: 'Baloncesto',
  VOLLEYBALL: 'Voleibol',
  BASEBALL: 'Béisbol',
  FUTSAL: 'Futsal',
  TENNIS: 'Tenis',
  SWIMMING: 'Natación',
  ATHLETICS: 'Atletismo'
};

/**
 * Spanish presentation mappings for event statuses.
 */
export const EVENT_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  CANCELLED: 'Cancelado',
  COMPLETED: 'Finalizado'
};
