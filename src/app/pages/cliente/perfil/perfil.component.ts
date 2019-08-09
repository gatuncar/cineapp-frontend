import { Component, OnInit, Inject } from '@angular/core';
import { Rol } from 'src/app/_model/rol';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Usuario } from 'src/app/_model/usuario';
import { DomSanitizer } from '@angular/platform-browser';
import { ClienteService } from 'src/app/_service/cliente.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario;
  imagenData: any;
  imagenEstado: boolean = false;
  roles: Rol[];
  labelFile: string;
  selectedFiles: FileList;

  constructor(private dialogRef: MatDialogRef<PerfilComponent>, @Inject(MAT_DIALOG_DATA) public data: Usuario, private clienteService: ClienteService, private sanitization: DomSanitizer) { }

  ngOnInit() {
    this.usuario = new Usuario();
    this.usuario.idUsuario = this.data.idUsuario;
    this.usuario.username = this.data.username;
    //this.usuario.cliente.nombres = this.data.cliente.nombres;
    //this.usuario.cliente.apellidos = this.data.cliente.apellidos;
    this.roles = this.data.roles;

    if (this.data.cliente.idCliente > 0) {
      this.clienteService.listarPorId(this.data.cliente.idCliente).subscribe(data => {
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

}
