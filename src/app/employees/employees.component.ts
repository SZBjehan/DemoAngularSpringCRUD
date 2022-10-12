import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EMPLOYEES } from '../mock-employees';
import { EmployeeService } from './employee.service';
import { MessageService } from '../messages/message.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  // employees = EMPLOYEES;
  // 

  // selectedEmployee?: Employee;
  employees: Employee[] = [];
  
  // constructor(private employeeService: EmployeeService, private messageService: MessageService) { }
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private location: Location
  ) {}
  ngOnInit(): void {
    this.getEmployees();
  }
  // onSelect(employee: Employee): void {
  //   this.selectedEmployee = employee;
  //   this.messageService.add(`EmployeesComponent: Selected employee id=${employee.id}`);
  // }
  getEmployees(): void {
    const id= Number(this.route.snapshot.paramMap.get('id'));
    this.employeeService.getEmployees()
        .subscribe(employees => this.employees = employees);
    
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.employeeService.addEmployee({ name } as Employee)
      .subscribe(employee => {
        this.employees.push(employee);
      });
  }

  delete(employee: Employee): void {
    this.employees = this.employees.filter(h => h !== employee);
    this.employeeService.deleteEmployee(employee.id).subscribe();
  }

  

}
