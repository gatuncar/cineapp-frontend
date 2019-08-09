import { Menu } from './_model/menu';
import { LoginService } from './_service/login.service';
import { Component } from '@angular/core';
import { MenuService } from './_service/menu.service';
import { environment } from 'src/environments/environment';
import { Cliente } from './_model/cliente';
import { PerfilComponent } from './pages/cliente/perfil/perfil.component';
import { MatDialog } from '@angular/material';
import { Usuario } from './_model/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  menus: Menu[];
  
  constructor(public loginService: LoginService, private menuService: MenuService, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.menuService.menuCambio.subscribe(data => {
      this.menus = data;
    });
  }

  openDialogPerfil(usuario?: Usuario) {
    
    let tk = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME));
    //let com = usuario != null ? usuario : new Usuario();
    //com.username = sessionStorage.getItem('carabinero');
    let com = JSON.parse(sessionStorage.getItem('usuario'))
    console.log(com);

    this.dialog.open(PerfilComponent, {
      width: '250px',
      data: com
    });
  }
}
