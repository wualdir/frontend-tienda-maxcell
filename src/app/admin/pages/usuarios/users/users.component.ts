import { Component } from '@angular/core';
import { AdminUsuariosService } from '../../../services/admin-usuarios.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-users',
  imports: [RouterLink,CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
clientes: User[] = [];


  constructor(private usuarioService: AdminUsuariosService) {}

  ngOnInit(): void {
    this.usuarioService.getUsers()
      .subscribe(data => {
        this.clientes = data;
      });
  }
}
