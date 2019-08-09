import { Component, OnInit, ViewChild } from '@angular/core';
import { Cliente } from 'src/app/_model/cliente';
import { ClienteService } from 'src/app/_service/cliente.service';
import { MatDialog, MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Usuario } from 'src/app/_model/usuario';
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { ClienteDialogoComponent } from './cliente-dialogo/cliente-dialogo.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  cantidad: number;
  dataSource: MatTableDataSource<Cliente>;
  displayedColumns = ['idCliente', 'dni', 'nombres', 'apellidos', 'acciones'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(private clienteService: ClienteService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.clienteService.clienteCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.clienteService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  /*
  openDialog(cliente ?: Cliente) {
    let com = cliente != null ? cliente : new Cliente();
    this.dialog.open(ClienteDialogoComponent, {
      width: '250px',
      data: com
    });
  }
  */

 eliminar(idCliente: number) {

  console.log('idCliente: ' + idCliente);
  
  this.clienteService.eliminar(idCliente).subscribe(() => {
    this.clienteService.listar().subscribe(data => {
      this.clienteService.clienteCambio.next(data);
      this.clienteService.mensajeCambio.next('Se eliminó');
    });
  });
  
  this.applyFilter("");

  this.snackBar.open('Se eliminó', 'INFO', {
    duration: 2000
  });
}


  openDialogNuevo(usuario ?: Usuario) {
    let com = usuario != null ? usuario : new Usuario();
    this.dialog.open(NuevoClienteComponent, {
      width: '600px',
      data: com
    });
  }

    openDialogEditar(cliente ?: Cliente) {
    let com = cliente != null ? cliente : new Cliente();
    this.dialog.open(ClienteDialogoComponent, {
      width: '250px',
      data: com
    });
  }

}
