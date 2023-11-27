import { Component, computed, signal, effect, Injector, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from './../../models/task.model';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  newTaskCtrol = new FormControl('',{
    nonNullable: true,
    validators:[ Validators.required,]
  });
  cantTasks = 0;
  task=signal([
    {
      id: Date.now(), title: 'Diseño de Base de datos', completed: true, 
      editing: false,
    },
  ]);

  filter=signal<'all'|'pending'|'completed'>('all');
  tasksByFilter = computed(()=>{
    const filter = this.filter();
    const tasks = this.task();
    if(filter === 'pending'){
      return tasks.filter(task => !task.completed)
    }else if(filter === 'completed'){
      return tasks.filter(task => task.completed)
    }
    return tasks;
  });

  injector = inject(Injector);

  ngOnInit(){
    const storage = localStorage.getItem('tasks');
    if(storage){
      const tasks = JSON.parse(storage);
      this.task.set(tasks);
    }
    this.trackTask();
  }

  trackTask(){
    effect(()=>{
      const tasks = this.task();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },{injector: this.injector});
  }

  changeHandler(){
    if(this.newTaskCtrol.valid){
      const value = this.newTaskCtrol.value;
      if(this.newTaskCtrol.value.trim() !== "" && value.length > 3){
        this.addTask(value);
        this.newTaskCtrol.setValue("");
      }
    }
  }

  addTask(title: string){
    const newTask = {
      id: Date.now(),
      title: title,
      completed: false,
      editing: false,
    };
    this.task.update((task) => [...task, newTask]);
  }

  deleteTask(index: number){
    this.task.update((task) => task.filter((task, i)=> i !== index)); // Devuelve los datos que no coincidan con index
  }

  updateTask(index: number){
    this.task.update((task) => {
      return task.map((task, i) =>{
        if(i === index){
          return {
            ...task, completed: !task.completed
          }
        }
        return task;
      })
    })
  }

  stateEdition(index: number){
    this.task.update((task) => {
      return task.map((task, i) =>{
        if(i === index && !task.completed){
          return {
            ...task, editing: true
          }
        }
        return {
          ...task, editing: false
        }
      })
    })
  }

  editionTask(index: number, event: Event){
    const input = event.target as HTMLInputElement;
    this.task.update((task) => {
      return task.map((task, i) =>{
        if(i === index && !task.completed){
          return {
            ...task, title: input.value, editing: false
          }
        }
        return task;
      })
    })
  }

  changeFilter(filter: 'all'|'pending'|'completed'){
    this.filter.set(filter);
  }
}
