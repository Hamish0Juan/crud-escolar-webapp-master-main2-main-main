import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EliminarEventoModalComponent } from 'src/app/modals/eliminar-evento-modal/eliminar-evento-modal.component';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-eventos-screen',
  templateUrl: './registro-eventos-screen.component.html',
  styleUrls: ['./registro-eventos-screen.component.scss']
})
export class EventosScreenComponent implements OnInit, AfterViewInit {

  // Datos del usuario
  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  
  // Datos de eventos
  public lista_eventos: any[] = [];
  public dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = [
    'titulo',
    'tipo_de_evento',
    'fecha_de_realizacion',
    'hora_inicio',
    'hora_fin',
    'lugar',
    'publico_objetivo',
    'programa_educativo',
    'responsable_del_evento',
    'descripcion_breve',
    'cupo_max',
    'editar',
    'eliminar'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
element: any;

  constructor(
    private eventosService: EventosService,
    private facadeService: FacadeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.verificarSesion();
    this.obtenerEventos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.initPaginator();
  }

  private verificarSesion(): void {
    this.token = this.facadeService.getSessionToken();
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    if (!this.token) {
      this.router.navigate([""]);
    }
  }

  private initPaginator(): void {
    setTimeout(() => {
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page, pageSize, length) => {
        if (length === 0 || pageSize === 0) return `0 de ${length}`;
        const start = page * pageSize;
        const end = Math.min(start + pageSize, length);
        return `${start + 1} - ${end} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    }, 500);
  }

  public obtenerEventos(): void {
    this.eventosService.obtenerEventos().subscribe(
      (response) => {
        this.lista_eventos = response;
        this.dataSource = new MatTableDataSource(this.lista_eventos);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        alert("No se pudo obtener la lista de eventos");
      }
    );
  }

  public goEditar(idEvento: number): void {
    this.router.navigate(["registro-eventos/" + idEvento]);
  }

  public delete(idEvento: number): void {
    const dialogRef = this.dialog.open(EliminarEventoModalComponent, {
      width: '400px',
      data: { id: idEvento }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.isDelete) {
        this.obtenerEventos(); // solo se recarga si eliminó
        alert("Evento eliminado correctamente.");
      }
    });
  }

}
