import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FacadeService } from "./facade.service";
import { ErrorsService } from "./tools/errors.service";
import { ValidatorService } from "./tools/validator.service";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class EventosService {
 
  private readonly apiUrl = environment.url_api;
  authHeaders: HttpHeaders | { [header: string]: string | string[]; } | undefined;

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) {}

  private getHeaders(withAuth = false): HttpHeaders {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (withAuth) {
      const token = this.facadeService.getSessionToken();
      return headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  public esquemaEvento() {
    return {
      titulo: '',
      tipo_de_evento: '',
      fecha_de_realizacion: '',
      horaInicio: '',
      horaFin: '',
      lugar: '',
      publico_objetivo: [],
      programa_educativo: '',
      responsable_del_evento: '',
      descripcion_breve: '',
      cupo_max: ''
    };
  }

  public validarEvento(data: any, editar: boolean): any {
    const errors: any = {};

    const required = (field: string) => !this.validatorService.required(data[field]);
    const max = (field: string, limit: number) => !this.validatorService.max(data[field], limit);

    if (required('titulo')) {
      errors.titulo = this.errorService.required;
    } else if (!this.validatorService.wordsAndNumbers(data.titulo)) {
      errors.titulo = 'El título solo puede contener letras, números y espacios.';
    }

    if (required('tipo_de_evento')) errors.tipo_de_evento = this.errorService.required;

    if (required('fecha_de_realizacion')) {
      errors.fecha_de_realizacion = this.errorService.required;
    } else if (!this.validatorService.date(data.fecha_de_realizacion)) {
      errors.fecha_de_realizacion = this.errorService.betweenDate;
    }

    if (required('horaInicio')) {
      errors.hora_inicio = this.errorService.required;
    } else if (!this.validatorService.time(data.horaInicio)) {
      errors.hora_inicio = 'La hora debe estar en formato válido (HH:mm).';
    }

    if (required('horaFin')) {
      errors.hora_fin = this.errorService.required;
    } else if (!this.validatorService.time(data.horaFin)) {
      errors.hora_fin = 'La hora debe estar en formato válido (HH:mm).';
    }

    if (required('lugar')) {
      errors.lugar = this.errorService.required;
    } else if (!this.validatorService.wordsAndNumbers(data.lugar)) {
      errors.lugar = 'El lugar solo puede contener letras, números y espacios.';
    }

    if (required('publico_objetivo')) errors.publico_objetivo = this.errorService.required;
    if (required('programa_educativo')) errors.programa_educativo = this.errorService.required;
    if (required('responsable_del_evento')) errors.responsable_del_evento = this.errorService.required;

    if (required('descripcion_breve')) {
      errors.descripcion_breve = this.errorService.required;
    } else if (max('descripcion_breve', 300)) {
      errors.descripcion_breve = this.errorService.max(300);
    }

    if (required('cupo_max')) {
      errors.cupo_max = this.errorService.required;
    } else if (!this.validatorService.numeric(data.cupo_max)) {
      errors.cupo_max = this.errorService.numeric;
    } else if (!this.validatorService.max(data.cupo_max.toString(), 3)) {
      errors.cupo_max = 'El cupo máximo no puede exceder 3 dígitos.';
    }

    return errors;
  }

  public registrarEvento(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/eventos/`, data, { headers: this.getHeaders() });
  }

  public obtenerEventos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lista-eventos/`, { headers: this.getHeaders(true) });
  }

getEventoByID(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/evento/${id}`, {
    headers: this.authHeaders
  });
}



  public editarEvento(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/eventos/${id}`, data, { headers: this.getHeaders(true) });
  }

  public eliminarEvento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eventos-edit/?id=${id}`, { headers: this.getHeaders(true) });
  }
}
