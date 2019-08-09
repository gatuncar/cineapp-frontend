import { Component, OnInit, Inject } from '@angular/core';
import { Cliente } from 'src/app/_model/cliente';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ClienteDialogoComponent } from '../cliente-dialogo/cliente-dialogo.component';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PasswordValidation } from '../../login/nuevo/match';
import { Usuario } from 'src/app/_model/usuario';
import { ClienteService } from 'src/app/_service/cliente.service';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent implements OnInit {

  cliente: Cliente;
  imagenData: any;
  imagenEstado: boolean = false;
  selectedFiles: FileList;
  currentFileUpload: File;
  labelFile: string;
  form: FormGroup;
  maxFecha: Date;

  constructor(private fb: FormBuilder, private router: Router, private dialogRef: MatDialogRef<NuevoClienteComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: Cliente, private usuarioService: UsuarioService, private clienteService: ClienteService,
              private matSnackBar: MatSnackBar, 
              private sanitization: DomSanitizer) { }

  ngOnInit() {

   this.maxFecha = new Date();

   this.form = this.fb.group({
     'nombres': new FormControl(''),
     'apellidos': new FormControl(''),
     'dni': new FormControl(''),
     'fechaNac': new Date(),
     usuario: new FormControl(''),
     password: [''],
     confirmPassword: ['']
   }, {
       validator: PasswordValidation.MatchPassword
     });

  }

  selectFile(e: any) {
    this.labelFile = e.target.files[0].name;
    this.selectedFiles = e.target.files;
  }

  cancelar() {
    this.dialogRef.close();
  }

  registrar() {
    let usuario = new Usuario();
    let cliente = new Cliente();
    
    cliente.nombres = this.form.value['nombres'];
    cliente.apellidos = this.form.value['apellidos'];
    cliente.dni = this.form.value['dni'];
    cliente.fechaNac = this.form.value['fechaNac'];
    
    if (this.selectedFiles != null) {
      console.log(this.selectFile);
      this.setear(this.selectedFiles);
      cliente._foto = this.imagenData;

      console.log(this.imagenData);      
    } else {
      cliente._foto = new File([""], "blanco");          
    }

    usuario.username = this.form.value['usuario'];
    usuario.password = this.form.value['password'];
    usuario.cliente = cliente;

    console.log(cliente._foto); 
    console.log(usuario); 

    this.usuarioService.registrar(usuario).subscribe(() => {
      this.clienteService.listar().subscribe(clientes => {
        this.clienteService.clienteCambio.next(clientes);
        this.clienteService.mensajeCambio.next("Se registró");
      });
      
      this.matSnackBar.open('Se creó usuario', 'INFO', {
        duration: 2000
      });
      
    });

    this.dialogRef.close();
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

}
