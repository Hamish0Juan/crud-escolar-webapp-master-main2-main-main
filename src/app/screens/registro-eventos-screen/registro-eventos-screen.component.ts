import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-registro-eventos-screen',
  templateUrl: './registro-eventos-screen.component.html',
  styleUrls: ['./registro-eventos-screen.component.scss']
})
export class EventosScreenComponent implements OnInit {

  public tipo: string = "registro-eventos";

  public evento: any = {};

  public isAdmin: boolean = false;
  public isAlumno: boolean = false;
  public isMaestro: boolean = false;
  public editar: boolean = false;
  public tipo_user: string = "";

  public idEvento: number = 0;
  public rol: string = "";

  constructor(
    public activatedRoute: ActivatedRoute,
    private eventosService: EventosService
  ) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['rol'] != undefined) {
      this.rol = this.activatedRoute.snapshot.params['rol'];
      console.log("Rol detectado: ", this.rol);
    }

    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idEvento = this.activatedRoute.snapshot.params['id'];
      console.log("ID Evento: ", this.idEvento);
      this.obtenerEventoByID();
    }
  }

  public obtenerEventoByID() {
    this.eventosService.getEventoByID(this.idEvento).subscribe(
      (response) => {
        this.evento = response;
        // Mapear los campos si fuera necesario
        console.log("Datos del evento: ", this.evento);
      },
      (error) => {
        alert("No se pudieron obtener los datos del evento para editar");
      }
    );
  }

}
