import { Component, OnInit } from '@angular/core';
import { Employee } from '../employees/employee';
import { EmployeeService } from '../employees/employee.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.employeeService.getEmployees()
        .subscribe(employees => this.employees = employees.slice(0, 5));
  }
}