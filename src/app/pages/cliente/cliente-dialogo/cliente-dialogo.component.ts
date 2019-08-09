import { Component, OnInit, Inject } from '@angular/core';
import { Cliente } from 'src/app/_model/cliente';
import { ClienteService } from 'src/app/_service/cliente.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PasswordValidation } from '../../login/nuevo/match';
import { Usuario } from 'src/app/_model/usuario';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-dialogo',
  templateUrl: './cliente-dialogo.component.html',
  styleUrls: ['./cliente-dialogo.component.css']
})
export class ClienteDialogoComponent implements OnInit {

  cliente: Cliente;
  imagenData: any;
  imagenEstado: boolean = false;
  selectedFiles: FileList;
  currentFileUpload: File;
  labelFile: string;

  constructor(private dialogRef: MatDialogRef<ClienteDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data: Cliente, private clienteService: ClienteService, private matSnackBar: MatSnackBar, private sanitization: DomSanitizer) { }

  ngOnInit() {
    this.cliente = new Cliente();
    this.cliente.idCliente = this.data.idCliente;
    this.cliente.nombres = this.data.nombres;
    this.cliente.apellidos = this.data.apellidos;
    this.cliente.dni = this.data.dni;
    this.cliente.fechaNac = this.data.fechaNac;

    if (this.data.idCliente > 0) {
      this.clienteService.listarPorId(this.data.idCliente).subscribe(data => {
        if (data.size > 0) {
          this.convertir(data);
        }
      });
    }
  }

  convertir(data: any) {
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      let base64 = reader.result;
      this.imagenData = base64;
      this.setear(base64);
    }
  }

  setear(base64: any) {
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(base64);
    this.imagenEstado = true;
  }

  cancelar() {
    this.dialogRef.close();
  }

  selectFile(e: any) {
    this.labelFile = e.target.files[0].name;
    this.selectedFiles = e.target.files;
  }

  operar() {

    if (this.selectedFiles != null) {
      this.currentFileUpload = this.selectedFiles.item(0);
    } else {
      this.currentFileUpload = new File([""], "blanco");
    }

    if (this.cliente != null && this.cliente.idCliente > 0) {
      this.clienteService.modificar(this.cliente, this.currentFileUpload).pipe(switchMap(() => {
        return this.clienteService.listar();
      })).subscribe(data => {
        this.clienteService.clienteCambio.next(data);
        this.clienteService.mensajeCambio.next("Se modificó");
      });

      this.matSnackBar.open('Se modificó', 'INFO', {
        duration: 2000
      });
    } /*else {
      this.clienteService.registrar(this.cliente, this.currentFileUpload).subscribe(data => {
        this.clienteService.listar().subscribe(clientes => {
          this.clienteService.clienteCambio.next(clientes);
          this.clienteService.mensajeCambio.next("Se registró");
        });

        this.matSnackBar.open('Se registró', 'INFO', {
          duration: 2000
        });
      });
    }*/

    this.dialogRef.close();
  }

}
