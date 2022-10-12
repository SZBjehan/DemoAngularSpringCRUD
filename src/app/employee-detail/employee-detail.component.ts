import { Component, OnInit, Input } from '@angular/core';
import { Employee } from '../employees/employee';
import { EmployeeService } from '../employees/employee.service';
import { getLocaleEraNames, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

  // @Input() employee?: Employee;
  employee: Employee | undefined;


  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getEmployee();
  }
  getEmployee(): void{
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.employeeService.getEmployee(id)
        .subscribe(employee => this.employee = employee);
  }
  save(): void {
    if (this.employee) {
      this.employeeService.updateEmployee(this.employee)
        .subscribe(() => this.goBack());
    }
  }
  
  goBack(): void {
    this.location.back();
  }

}
