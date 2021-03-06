import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget } from '../models/Budget';
import { Customer } from '../models/Customer';
import { Employee } from '../models/Employee';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Supplier } from '../models/Supplier';
import { WorkLog } from '../models/WorkLog';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SupplierPurchasedHistory } from '../models/SupplierPurchasedHistory';
import { SupplierProducts } from '../models/SupplierProducts';
import { Response } from '../models/Response';
import { WageHoursPrice } from '../models/WageHoursPrice';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  //http://localhost:8080
  //https://hidden-bastion-05543.herokuapp.com

  private budgetApiUrl = 'https://hidden-bastion-05543.herokuapp.com/Budget';
  private customerApiUrl =
    'https://hidden-bastion-05543.herokuapp.com/Customer';
  private employeeApiUrl =
    'https://hidden-bastion-05543.herokuapp.com/Employee';
  private orderApiUrl = 'https://hidden-bastion-05543.herokuapp.com/Order';
  private productApiUrl = 'https://hidden-bastion-05543.herokuapp.com/Product';
  private supplierApiUrl =
    'https://hidden-bastion-05543.herokuapp.com/Supplier';
  private workLogApiUrl = 'https://hidden-bastion-05543.herokuapp.com//WorkLog';
  private supplierPurchasedHistoryApiUrl =
    'https://hidden-bastion-05543.herokuapp.com/supplierPurchasedHistory';
  private servicesApiUrl =
    ' https://hidden-bastion-05543.herokuapp.com/services';

  private firebaseAdmin =
    'https://hidden-bastion-05543.herokuapp.com//firebase';

  private supplierProductApiUrl =
    'https://hidden-bastion-05543.herokuapp.com/SupplierProduct';

  private wageHoursPriceApiUrl =
    ' https://hidden-bastion-05543.herokuapp.com/WageHoursPrice';

  constructor(private http: HttpClient) {}

  getBudget(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.budgetApiUrl}/list`);
  }
  getBudgetById(id: number): Observable<Budget> {
    return this.http.get<Budget>(`${this.budgetApiUrl}`, {
      params: { Id: id },
    });
  }
  addBudget(Budget: Budget): Observable<Response> {
    return this.http.post<Response>(`${this.budgetApiUrl}/add`, Budget);
  }
  updateBudget(Budget: Budget): Observable<Budget> {
    return this.http.put<any>(
      `${this.budgetApiUrl}/update`,
      Budget,
      httpOptions
    );
  }
  deleteBudget(id: number): Observable<Budget> {
    return this.http.delete<Budget>(`${this.budgetApiUrl}/delete`, {
      params: { Id: id },
    });
  }
  getBudgetPdf(id: number) {
    return this.http.get<any>(`${this.budgetApiUrl}/downloadFile`, {
      headers: new HttpHeaders({
        'Content-type': 'application/pdf',
        accept: 'application/pdf',
      }),
      params: { budgetId: id },
      responseType: 'blob' as 'json',
    });
  }

  getCustomer(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.customerApiUrl}/list`);
  }
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.customerApiUrl}`, {
      params: { Id: id },
    });
  }
  addCustomer(Customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.customerApiUrl}/add`, Customer);
  }
  updateCustomer(Customer: Customer): Observable<Customer> {
    return this.http.put<any>(
      `${this.customerApiUrl}/update`,
      Customer,
      httpOptions
    );
  }
  deleteCustomer(id: number): Observable<Customer> {
    return this.http.delete<Customer>(`${this.customerApiUrl}/delete`, {
      params: { Id: id },
    });
  }
  /*   getCustomerPdf(id: number) {
    return this.http
      .get<any>(`${this.customerApiUrl}/downloadFile`, {
        headers: new HttpHeaders({
          'Content-type': 'application/pdf',
          accept: 'application/pdf',
        }),
        params: { orderId: id },
        responseType: 'blob' as 'json',
      })
      .subscribe({
        next: (data) => {
          let blob = new Blob([data], { type: 'application/pdf' });
          let downloadURL = window.URL.createObjectURL(blob);
          let link = document.createElement('a');
          link.href = downloadURL;
          link.target = '_blank';
          link.click();
        },
        error: (err) => {
          console.log(err);
        },
      });
  } */

  getOrder(): Observable<any> {
    return this.http.get<any>(`${this.orderApiUrl}/list`);
  }
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.orderApiUrl}`, {
      params: { Id: id },
    });
  }
  addOrder(Order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.orderApiUrl}/add`, Order);
  }
  updateOrder(Order: Order): Observable<Order> {
    return this.http.put<any>(`${this.orderApiUrl}/update`, Order, httpOptions);
  }
  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.orderApiUrl}/delete`, {
      params: { Id: id },
    });
  }
  getOrderPdf(id: number): Observable<any> {
    return this.http.get<any>(`${this.orderApiUrl}/downloadFile`, {
      headers: new HttpHeaders({
        'Content-type': 'application/pdf',
        accept: 'application/pdf',
      }),
      params: { orderId: id },
      responseType: 'blob' as 'json',
    });
  }
  budgetToOrder(id: number) {
    return this.http.get<any>(`${this.orderApiUrl}/budgetToOrder`, {
      params: { Id: id },
    });
  }

  getEmployee(): Observable<any> {
    return this.http.get<any>(`${this.employeeApiUrl}/list`);
  }
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeeApiUrl}/getByID`, {
      params: { Id: id },
    });
  }
  addEmployee(Employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.employeeApiUrl}/add`, Employee);
  }
  updateEmployee(Employee: Employee): Observable<Employee> {
    return this.http.put<any>(
      `${this.employeeApiUrl}/update`,
      Employee,
      httpOptions
    );
  }
  deleteEmployee(id: number): Observable<any> {
    const httpOptions: Object = {
      params: { Id: id },
    };
    return this.http.delete<any>(`${this.employeeApiUrl}/delete`, httpOptions);
  }
  getEmployeePdf(id: number): Observable<any> {
    return this.http.get<any>(`${this.employeeApiUrl}/exportToPDF`);
  }

  getProduct(): Observable<any> {
    return this.http.get<any>(`${this.productApiUrl}/list`);
  }
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productApiUrl}`, {
      params: { Id: id },
    });
  }
  addProduct(Product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.productApiUrl}/add`, Product);
  }
  updateProduct(Product: Product): Observable<Product> {
    return this.http.put<any>(
      `${this.productApiUrl}/update`,
      Product,
      httpOptions
    );
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.productApiUrl}/delete`, {
      params: { Id: id },
    });
  }
  getProductPdf(id: number): Observable<any> {
    return this.http.get<any>(`${this.productApiUrl}/exportToPDF`);
  }

  getSupplierPurchasedHistory(): Observable<any> {
    return this.http.get<any>(`${this.supplierPurchasedHistoryApiUrl}/list`);
  }
  getSupplierPurchasedHistoryById(
    id: number
  ): Observable<SupplierPurchasedHistory> {
    return this.http.get<SupplierPurchasedHistory>(
      `${this.supplierPurchasedHistoryApiUrl}`,
      {
        params: { Id: id },
      }
    );
  }
  addSupplierPurchasedHistory(
    supplierPurchasedHistory: SupplierPurchasedHistory
  ): Observable<SupplierPurchasedHistory> {
    return this.http.post<SupplierPurchasedHistory>(
      `${this.supplierPurchasedHistoryApiUrl}/add`,
      supplierPurchasedHistory
    );
  }
  updateSupplierPurchasedHistory(
    supplierPurchasedHistory: SupplierPurchasedHistory
  ): Observable<SupplierPurchasedHistory> {
    return this.http.put<any>(
      `${this.supplierPurchasedHistoryApiUrl}/update`,
      supplierPurchasedHistory,
      httpOptions
    );
  }
  deleteSupplierPurchasedHistory(
    id: number
  ): Observable<SupplierPurchasedHistory> {
    const httpOptions: Object = {
      params: { id: id },
    };
    return this.http.delete<SupplierPurchasedHistory>(
      `${this.supplierPurchasedHistoryApiUrl}/delete`,
      httpOptions
    );
  }
  getSupplierPurchasedHistoryPdf(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.supplierPurchasedHistoryApiUrl}/downloadFile`,
      {
        params: { supplierBudgetId: id },
        responseType: 'blob' as 'json',
      }
    );
  }

  getWorkLog(email: string): Observable<WorkLog[]> {
    return this.http.get<WorkLog[]>(
      `${this.employeeApiUrl}/GetWorkLogByEmail`,
      { params: { email: email } }
    );
  }
  getWorkLogById(id: number): Observable<WorkLog> {
    return this.http.get<WorkLog>(`${this.workLogApiUrl}`, {
      params: { Id: id },
    });
  }
  addWorkLog(WorkLog: WorkLog, email: string): Observable<Response> {
    return this.http.post<Response>(
      `${this.employeeApiUrl}/addWorkLog`,
      WorkLog,
      { params: { email: email } }
    );
  }
  updateWorkLog(WorkLog: WorkLog): Observable<Response> {
    return this.http.put<Response>(
      `${this.workLogApiUrl}/update`,
      WorkLog,
      httpOptions
    );
  }
  deleteWorkLog(id: any): Observable<Response> {
    const httpOptions: Object = {
      params: { Id: id },
    };
    return this.http.delete<Response>(
      `${this.workLogApiUrl}/delete`,
      httpOptions
    );
  }
  getWorkLogPdf(id: number): Observable<Response> {
    return this.http.get<any>(`${this.workLogApiUrl}/exportToPDF`, {
      params: { Id: id },
    });
  }

  getSupplier(): Observable<any> {
    return this.http.get<any>(`${this.supplierApiUrl}/list`);
  }
  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.supplierApiUrl}`, {
      params: { Id: id },
    });
  }
  addSupplier(Supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.supplierApiUrl}/add`, Supplier);
  }
  updateSupplier(Supplier: Supplier): Observable<Supplier> {
    return this.http.put<any>(
      `${this.supplierApiUrl}/update`,
      Supplier,
      httpOptions
    );
  }
  deleteSupplier(id: number): Observable<Supplier> {
    const httpOptions: Object = {
      params: { Id: id },
    };
    return this.http.delete<Supplier>(
      `${this.supplierApiUrl}/delete`,
      httpOptions
    );
  }
  getSupplierPdf(id: number): Observable<any> {
    return this.http.get<any>(`${this.supplierApiUrl}/exportToPDF`, {
      params: { Id: id },
      responseType: 'blob' as 'json',
    });
  }
  buySupplierProducts(
    productId: number,
    quantity: number
  ): Observable<Supplier> {
    return this.http.post<Supplier>(
      `${this.supplierApiUrl}/buyProductFromSupplier`,
      null,
      { params: { product: productId, quantity: quantity } }
    );
  }

  addSupplierProducts(
    SupplierProducts: SupplierProducts,
    id: number
  ): Observable<Supplier> {
    return this.http.post<Supplier>(
      `${this.supplierApiUrl}/addSingleProductInSupplier`,
      SupplierProducts,
      { params: { supplierId: id } }
    );
  }

  getSupplierProduct(): Observable<any> {
    return this.http.get<any>(`${this.supplierProductApiUrl}/list`);
  }
  getSupplierProductById(id: number): Observable<SupplierProducts> {
    return this.http.get<SupplierProducts>(`${this.supplierProductApiUrl}`, {
      params: { Id: id },
    });
  }
  addSupplierProduct(
    SupplierProduct: SupplierProducts
  ): Observable<SupplierProducts> {
    return this.http.post<SupplierProducts>(
      `${this.supplierProductApiUrl}/add`,
      SupplierProduct
    );
  }
  updateSupplierProduct(
    SupplierProduct: SupplierProducts
  ): Observable<SupplierProducts> {
    return this.http.put<any>(
      `${this.supplierProductApiUrl}/update`,
      SupplierProduct,
      httpOptions
    );
  }
  deleteSupplierProduct(
    productId: number,
    supplierId: number
  ): Observable<SupplierProducts> {
    const httpOptions: Object = {
      params: { productId, supplierId },
    };
    return this.http.delete<SupplierProducts>(
      `${this.supplierProductApiUrl}/delete`,
      httpOptions
    );
  }

  getServices(): Observable<any> {
    return this.http.get<any>(`${this.servicesApiUrl}/list`);
  }
  createEmployeeInFirebase(email: string, password: string) {
    return this.http.get<any>(`${this.firebaseAdmin}/createEmployee`, {
      params: { email: email, password: password },
    });
  }
  deleteEmployeeInFirebase(uid: string) {
    return this.http.delete<any>(`${this.firebaseAdmin}/deleteEmployee`, {
      params: { uid: uid },
    });
  }
  getUserUid(email: string) {
    return this.http.get<any>(`${this.firebaseAdmin}/getUserUid`, {
      params: { email: email },
    });
  }

  getWageHoursPrice(): Observable<WageHoursPrice> {
    return this.http.get<WageHoursPrice>(`${this.wageHoursPriceApiUrl}/list`);
  }

  addWageHoursPrice(
    WageHoursPrice: WageHoursPrice
  ): Observable<WageHoursPrice> {
    return this.http.post<WageHoursPrice>(
      `${this.wageHoursPriceApiUrl}/add`,
      WageHoursPrice
    );
  }
}
