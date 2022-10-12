import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { Employee } from '../employees/employee';
import { EmployeeService } from '../employees/employee.service';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

@Component({
  selector: 'app-employee-search',
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.css']
})
export class EmployeeSearchComponent implements OnInit {

  employees$!: Observable<Employee[]>;
  private searchTerms = new Subject<string>();

  constructor(private employeeService: EmployeeService) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.employees$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.employeeService.searchEmployees(term)),
    );
  }

}
