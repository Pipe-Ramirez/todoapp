import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  title = signal('Bienvenido');
  nombre = signal('Felipe');
  task=[
    'Diseño de Base de datos', 'Crear base de datos','Diseño de App'
  ];

  colorCtrol = new FormControl();
  widthCtrol = new FormControl(50, {nonNullable: true});

  nameCtrol = new FormControl('Felipe',{
    nonNullable: true,
    validators:[
      Validators.required,
      Validators.minLength(3),
    ]
  });

  constructor(){
    this.colorCtrol.valueChanges.subscribe(value => console.log(value))
  }

  person={
    name: 'Felipe Ramírez',
    age: 32,
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Sm4cKahg0n1HuoOoQzMtYkAtppvX_W5FQjyn_NUB9g&s'
  }

  btnAction(){
    alert('Llego');
  }

  changeInput(event: Event){
    console.log(event);
  }

  pressKey(event: Event){
    const input = event.target as HTMLInputElement; // Captura la propiedad HTML de donde se está generando el evento
    this.title.set(input.value);
  }
}
