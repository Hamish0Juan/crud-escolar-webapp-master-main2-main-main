import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';
import { Location } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

// jQuery para validación
declare var $: any;

@Component({
  selector: 'app-registro-eventos',
  templateUrl: './registro-eventos.component.html',
  styleUrls: ['./registro-eventos.component.scss']
})
export class EventosComponent implements OnInit {
checkboxPublicoChange(event: MatCheckboxChange): void {
  const publico = event.source.value;

  if (!this.evento.publico_objetivo) {
    this.evento.publico_objetivo = [];
  }

  if (event.checked) {
    this.evento.publico_objetivo.push(publico);
  } else {
    const index = this.evento.publico_objetivo.indexOf(publico);
    if (index >= 0) {
      this.evento.publico_objetivo.splice(index, 1);
    }
  }
}

  public editar: boolean = false;
  public idEvento: number = 0;
  public token: string = '';
  public evento: any = {};
  public errors: any = {};

  // Opciones para los selects
  public tiposEvento: any[] = ['Conferencia', 'Taller', 'Curso', 'Otro'];
  public publicos: any[] = ['Estudiantes', 'Docentes', 'Administrativos', 'General'];
  public programas: any[] = [
    { value: '1', viewValue: 'Ingeniería en Ciencias de la Computación' },
    { value: '2', viewValue: 'Licenciatura en Ciencias de la Computación' },
    { value: '3', viewValue: 'Ingeniería en Tecnologías de la Información' }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventosService: EventosService,
    private router: Router,
    private location: Location,
    private facadeService: FacadeService
  ) {}

  ngOnInit(): void {
    this.token = this.facadeService.getSessionToken();

    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.editar = true;
      this.idEvento = id;
      this.eventosService.getEventoByID(id).subscribe(
        (resp) => {
          this.evento = resp;
        },
        (error) => {
          alert('Error al cargar datos del evento');
          console.error(error);
        }
      );
    } else {
      this.evento = this.eventosService.esquemaEvento();
    }
  }

  registrar(): void {
    this.errors = this.eventosService.validarEvento(this.evento, false);

    if (!$.isEmptyObject(this.errors)) {
      return;
    }

    this.eventosService.registrarEvento(this.evento).subscribe(
      (resp) => {
        alert('Evento registrado correctamente');
        console.log('Evento registrado:', resp);
        this.router.navigate(['/eventos']);
      },
      (error) => {
        console.error('Error al registrar evento:', error);
        alert('No se pudo registrar el evento');
      }
    );
  }

  actualizar(): void {
    this.errors = this.eventosService.validarEvento(this.evento, true);

    if (!$.isEmptyObject(this.errors)) {
      return;
    }

    this.eventosService.editarEvento(this.idEvento, this.evento).subscribe(
      (resp) => {
        alert('Evento actualizado correctamente');
        console.log('Evento actualizado:', resp);
        this.router.navigate(['/eventos']);
      },
      (error) => {
        console.error('Error al actualizar evento:', error);
        alert('No se pudo actualizar el evento');
      }
    );
  }

  regresar(): void {
    this.location.back();
  }
  revisarPublico(publico: string): boolean {
  return this.evento.publico_objetivo?.includes(publico);
}
changeFechaRealizacion(event: any): void {
  if (event?.value) {
    this.evento.fecha_de_realizacion = event.value;
  }
}

}
