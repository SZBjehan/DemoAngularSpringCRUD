import { Injectable } from '@angular/core';
import { Employee } from './employee';
import { EMPLOYEES } from '../mock-employees';

import { Observable, of, catchError, map, tap } from 'rxjs';
import { MessageService } from '../messages/message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private messageService: MessageService, private http:HttpClient) { }

  private employeesUrl = 'api/employees';  // URL to web api

  // getEmployees(): Observable<Employee[]> {
  //   const employees = of(EMPLOYEES);
  //   // const employees = this.http.get<Employee[]>("http://localhost:8080/employees");
  //   this.messageService.add('EmployeeService: fetched employees');
  //   return employees;
  // }

  // getEmployee(id : number): Observable<Employee> {
  //   // const employees = of(EMPLOYEES);
  //   const employee = EMPLOYEES.find(h => h.id === id)!;
  //   this.messageService.add(`EmployeeService: fetched employees id=${id}`);

  //   return of(employee);
  // }
  // private log(message: string) {
  //   this.messageService.add(`EmployeeService: ${message}`);
  // }
  
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesUrl)
                .pipe(
                  tap(_ => this.log('fetched employees')),
                  catchError(this.handleError<Employee[]>('getEmployees', []))
                );
  }

// 
  getEmployeeNo404<Data>(id: number): Observable<Employee> {
    const url = `${this.employeesUrl}/?id=${id}`;
    return this.http.get<Employee[]>(url)
      .pipe(
        map(employees => employees[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} employee id=${id}`);
        }),
        catchError(this.handleError<Employee>(`getEmployee id=${id}`))
      );
  }
// 

  getEmployee(id : number): Observable<Employee> {
    // const employees = of(EMPLOYEES);
    const url = `${this.employeesUrl}/${id}`;
    return this.http.get<Employee>(url).pipe(
            tap(_ => this.log(`fetched employee id=${id}`)),
            catchError(this.handleError<Employee>(`getEmployee id=${id}`))
    );
  }

  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private log(message: string) {
    this.messageService.add(`EmployeeService: ${message}`);
  }
  


//     /**
//  * Handle Http operation that failed.
//  * Let the app continue.
//  *
//  * @param operation - name of the operation that failed
//  * @param result - optional value to return as the observable result
//  */
    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
  
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
  
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);
  
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }
    
    /* GET employees whose name contains search term */
    searchEmployees(term: string): Observable<Employee[]> {
      if (!term.trim()) {
        // if not search term, return empty employee array.
        return of([]);
      }
      return this.http.get<Employee[]>(`${this.employeesUrl}/?name=${term}`).pipe(
        tap(x => x.length ?
          this.log(`found employees matching "${term}"`) :
          this.log(`no employees matching "${term}"`)),
        catchError(this.handleError<Employee[]>('searchEmployee', []))
      );
    }


    /** POST: add a new employee to the server */
    addEmployee(employee: Employee): Observable<Employee> {
      return this.http.post<Employee>(this.employeesUrl, employee, this.httpOptions).pipe(
              tap((newEmployee: Employee) => this.log(`added employee w/ id=${newEmployee.id}`)),
              catchError(this.handleError<Employee>('addEmployee'))
      );
    }

    /** PUT: update the employee on the server */
    updateEmployee(employee: Employee): Observable<any> {
      return this.http.put(this.employeesUrl, employee, this.httpOptions).pipe(
              tap(_ => this.log(`updated employee id=${employee.id}`)),
              catchError(this.handleError<any>('updateEmployee'))
      );
    }

    /** DELETE: delete the employee from the server */
    deleteEmployee(id: number): Observable<Employee> {
      const url = `${this.employeesUrl}/${id}`;

      return this.http.delete<Employee>(url, this.httpOptions).pipe(
              tap(_ => this.log(`deleted employee id=${id}`)),
              catchError(this.handleError<Employee>('deleteEmployee'))
      );
    }

    
  
}
