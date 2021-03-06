import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Budget } from '../../models/Budget';
import { Customer } from '../../models/Customer';
import { Product } from '../../models/Product';
import {
  faEdit,
  faTrashAlt,
  faCheck,
  faWindowClose,
} from '@fortawesome/free-solid-svg-icons';
import { HttpService } from 'src/app/services/http.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Services } from 'src/app/models/Services';
import { Router } from '@angular/router';
import { budgetStatus } from 'src/app/enums/budgetStatus';
import { Response } from 'src/app/models/Response';
import {
  NgbModal,
  NgbModalConfig,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css', '../icon.css'],
})
export class BudgetsComponent implements OnInit {
  editIcon = faEdit;
  deleteIcon = faTrashAlt;
  checkIcon = faCheck;
  closeIcon = faWindowClose;

  showNewCustomerForm: boolean = false;
  showAddBudgetForm: boolean = false;
  isSelected: boolean = false;
  errorMessage!: string;
  showEditBudgetForm: boolean = false;
  showBudgetProducts: Boolean = false;
  showEditBudgetProductForm: Boolean = false;
  formSubmitted = false;
  generateOrder = false;
  showProductsButton = false;
  showProductsCart = false;
  showHoursInput = false;
  otherServicesSelected = false;
  loading = false;
  resetForm = false;
  officerHours!: number;
  assistantHours!: number;
  updatedBudget!: Budget;
  customer: Customer = {
    customerId: 0,
    name: '',
  };
  newBudget: Budget = {
    budgetName: '',
    budgetStatus: '',
    assistantHours: 0,
    officerHours: 0,
    service: [],
    customer: { customerId: 0, name: '' },
    budgetId: 0,
    productList: [],
  };
  budgets: Budget[] = [
    /*  
   {
      budgetId: 1,
      budgetName: 'abc',
      totalPrice: 546,
      budgetStatus: 'accepted',
      assistantHours: 0,
      officerHours: 0,
      productList: [],
      customer: { customerId: 112, name: 'cus1' },
      service: [],
    }, */
  ];
  products: Product[] = [];
  newBudgetProducts: Product[] = [];
  updatedBudgetProducts: Product[] = [];
  resetToIntialBudgetProducts: Product[] = [];
  customers: Customer[] = [];
  services: Services[] = [];
  productsId!: any[];
  showErrorAlert = false;
  showSuccessAlert = false;
  apiRequestError!: {
    error: { text: string };
    name: string;
    message: string;
    status: 0;
    url: string;
  };
  apiSuccessResponse = '';
  apiErrorResponse: string = '';
  processingNetworkRequest = false;
  public createNewProductModal!: NgbModalRef;
  servicesName: string[] = [];

  private subscriptions = new Subscription();

  constructor(
    private cd: ChangeDetectorRef,
    private budgetService: HttpService,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    this.loading = true;
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.budgetService.getBudget().subscribe({
        next: (response: any) => {
          if (response.data && response.status === 200) {
            console.log(response);
            this.budgets = response.data;
          } else {
            this.showApiErrorResponse(response.message);
          }
          this.loading = false;
        },
        error: (error: any) => {
          this.showApiErrorResponse();
        },
      })
    );
    this.budgetService.getCustomer().subscribe({
      next: (response: any) => {
        if (response.data && response.status === 200) {
          this.customers = response.data.filter(
            (customer: Customer) => customer.name
          );
        }
      },
    });

    this.budgetService.getProduct().subscribe({
      next: (response: Response) => {
        if (response.status === 200) {
          this.products = response.data.map((product: Product) => {
            product.productQuantity = 0;
            product.addedToBudgetCart = false;
            return product;
          });
        }
      },
    });

    this.budgetService.getServices().subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.services = response.data;
        }
      },
    });
  }

  budgetPdfDownload(id: number, budget: Budget): void {
    this.budgetService.getBudgetPdf(id).subscribe({
      next: (data) => {
        this.showApiSuccessResponse();
        this.downloadPdf(data, id);
      },
      error: (err) => {
        const errMessage = 'pdf does not exist';
        this.showApiErrorResponse(errMessage);
      },
    });
    console.log('budget to download with id ', id, 'object ', budget);
  }

  onSubmit(event: any, form: NgForm) {
    event.preventDefault();
    this.errorMessage = '';
    console.log('inside submit', this.newBudget, this.services);
    console.log(
      this.newBudget.budgetName,
      this.newBudget.productList.map((data) => console.log(data))
    );
    if (
      !this.newBudget.budgetName ||
      this.newBudget.budgetName.trim().length === 0 ||
      this.newBudget.assistantHours < 0 ||
      this.newBudget.officerHours < 0
    ) {
      this.errorMessage =
        'Please enter correct fields , All fields are necessary';
    } else if (
      (this.showNewCustomerForm && !this.customer.name) ||
      (!this.newBudget.customer.name && !this.showNewCustomerForm)
    ) {
      this.errorMessage =
        'Please enter new customer name  , All fields are necessary';
    } else if (this.newBudgetProducts.length === 0 && this.showProductsButton) {
      this.errorMessage =
        'please select products correctly or unselect installation';
    } else {
      console.log('saving budget ', this.newBudget.customer, this.customer);
      if (this.showNewCustomerForm) {
        this.newBudget.customer = { ...this.customer };
      }
      if (
        this.newBudgetProducts.length > 0 &&
        this.newBudgetProducts &&
        this.showProductsButton
      ) {
        console.log('added products to budget');
        this.newBudget.productList = [...this.newBudgetProducts];
      }
      let budgetToSave = { ...this.newBudget };
      this.processingNetworkRequest = true;
      budgetToSave.budgetStatus = budgetStatus.pendingAcceptance;
      console.log('final budget is ...', budgetToSave);
      this.budgetService.addBudget(budgetToSave).subscribe({
        next: (response: Response) => {
          if (response.status === 200) {
            console.log(response);
            console.log(budgetToSave);
            if (this.showNewCustomerForm) {
              this.customers.push({ ...response.data.customer });
            }
            budgetToSave = response.data;
            this.budgets.push({ ...budgetToSave });
            this.showApiSuccessResponse(response.message);
            this.formSubmitted = true;
            form.resetForm();
          } else
            this.showApiErrorResponse(response.message.trim().slice(0, 100));
        },
        error: () => {
          this.showApiErrorResponse();
        },
      });
    }
  }

  openCreateAddProductModal(content: any) {
    console.log(this.products);
    this.createNewProductModal = this.modalService.open(content);
  }

  onClickToggleAddBudgetForm() {
    setTimeout(() => {
      this.errorMessage = '';
      this.showAddBudgetForm = !this.showAddBudgetForm;
      this.resetBudgetProducts();
      this.showProductsButton = false;
      this.showProductsCart = false;
      this.showHoursInput = false;

      this.newBudgetProducts = [];
      this.cd.markForCheck();
    }, 200);

    console.log('form submit ', this.formSubmitted);
  }
  onClickToggleEditBudgetForm(updatedBudget: any) {
    console.log('intial ', this.resetToIntialBudgetProducts);
    setTimeout(() => {
      this.errorMessage = '';
      this.showProductsButton = false;
      this.showProductsCart = false;
      if (this.showEditBudgetForm == true) {
        console.log('cancel budget ', updatedBudget);
        this.budgets = this.budgets.map((budget: Budget) => {
          if (budget.budgetId == this.updatedBudget.budgetId) {
            budget.productList = [...this.resetToIntialBudgetProducts];
          }
          return budget;
        });
      }
      this.showEditBudgetForm = !this.showEditBudgetForm;
      console.log(this.budgets);
      this.cd.markForCheck();
    }, 200);
  }
  onEditBudget(id: number, budget: Budget) {
    console.log('budget to be edited', budget);
    console.log('products to be edited', budget.productList);

    this.updatedBudget = { ...budget };
    this.servicesName = this.updatedBudget.service?.map(
      (service: Services) => service.type
    );
    this.resetToIntialBudgetProducts = JSON.parse(
      JSON.stringify(budget.productList)
    );
    this.updatedBudget.productList = [
      ...budget.productList.filter((product) => product.productQuantity > 0),
    ];
    this.updatedBudget.productList.map(
      (product: Product) => (product.addedToBudgetCart = true)
    );
    this.updatedBudgetProducts = [...this.updatedBudget.productList];
    this.productsId = [
      ...this.updatedBudgetProducts.map((p: Product) => p.productId),
    ];
    console.log('product in stock ids', this.productsId);
    this.products.forEach((element, index) => {
      if (this.productsId.indexOf(element.productId) === -1) {
        this.updatedBudget.productList.push({ ...element });
      }
    });

    console.log('all products ', this.updatedBudget.productList);
    console.log('products in stock', this.updatedBudgetProducts);

    if (budget.budgetStatus.trim().toLowerCase() !== 'accepted') {
      this.generateOrder = true;
    }
    setTimeout(() => {
      this.showEditBudgetForm = true;
      this.cd.markForCheck();
    }, 250);
    console.log('edit', id, budget);
  }

  onDeleteBudget(id: number, budget: Budget) {
    this.processingNetworkRequest = true;

    this.budgetService.deleteBudget(id).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showApiSuccessResponse(response.message);
          this.budgets = this.budgets.filter(
            (o) => o.budgetId != budget.budgetId
          );
          this.processingNetworkRequest = false;
        } else {
          this.showApiErrorResponse(response.message);
        }
      },
      error: (error: any) => {
        this.showApiErrorResponse();
      },
    });
  }

  onUpdateBudget(updatedBudget: Budget, event: any) {
    event.preventDefault();
    this.errorMessage = '';
    console.log('update', updatedBudget);
    if (
      !this.updatedBudget.budgetName ||
      this.updatedBudget.budgetName.trim().length === 0
    ) {
      this.errorMessage =
        'Please enter correct fields , All fields are necessary';
      return this.errorMessage;
    }
    console.log('update', updatedBudget);

    console.log(this.processingNetworkRequest, 'network request');
    if (
      updatedBudget.budgetStatus.trim().toLowerCase() === 'accepted' &&
      this.generateOrder
    ) {
      this.processingNetworkRequest = true;
      console.log('generating order');
      if (updatedBudget.budgetId)
        this.budgetService.budgetToOrder(updatedBudget.budgetId).subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              this.showApiSuccessResponse(response.message);
              this.showEditBudgetForm = false;
            } else this.showApiErrorResponse(response.message);
          },
          error: (error: any) => {
            this.showApiErrorResponse();
          },
        });
    } else {
      if (this.showNewCustomerForm) {
        this.updatedBudget.customer = { ...this.customer };
      }
      console.log('added products to budget');
      this.updatedBudget.productList = [...this.updatedBudgetProducts];

      if (!this.showProductsButton) {
        this.updatedBudget.productList = [];
      }

      this.modalService.dismissAll();

      this.processingNetworkRequest = true;
      console.log('final budget', this.updatedBudget);
      this.budgetService.updateBudget(updatedBudget).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            if (this.showNewCustomerForm) {
              this.customers.push({ ...response.data.customer });
            }
            this.budgets = this.budgets.filter(
              (budget: Budget) => budget.budgetId != updatedBudget.budgetId
            );
            this.budgets.push({ ...response.data });
            this.showApiSuccessResponse(response.message);
            this.showEditBudgetForm = false;
            this.processingNetworkRequest = false;
            this.formSubmitted = true;
          } else {
            this.showApiErrorResponse(response.message);
          }
        },
        error: (error: any) => {
          this.showApiErrorResponse();
        },
      });
    }

    return this.errorMessage;
  }
  isInstallationSelected(services: Services[]) {
    let newArr = services?.map((service: Services) =>
      service.type.trim().toLowerCase()
    );

    console.log(services, newArr);

    if (newArr && newArr.length > 0) {
      if (newArr?.includes('installation')) {
        this.showProductsButton = true;
      } else {
        this.showProductsButton = false;
        this.newBudget.productList = [];
      }
      const isLaborOrMaintenanceSelected =
        newArr.includes('Labour') ||
        newArr.includes('labour') ||
        newArr.includes('Maintenance') ||
        newArr.includes('maintenance');

      console.log(newArr);
      if (isLaborOrMaintenanceSelected) {
        this.showHoursInput = true;
      } else {
        this.showHoursInput = false;
        this.newBudget.assistantHours = 0;
        this.newBudget.officerHours = 0;
      }
    }
  }

  showApiErrorResponse(message?: any) {
    if (message) {
      this.apiErrorResponse = message;
    } else {
      this.apiErrorResponse =
        'Error! an error has occurred please try again later';
    }
    this.showErrorAlert = true;
    this.processingNetworkRequest = false;
    setTimeout(() => {
      this.showErrorAlert = false;
      this.loading = false;
    }, 3500);
  }

  showApiSuccessResponse(message?: string) {
    if (message) this.apiSuccessResponse = message;
    else this.apiSuccessResponse = 'Success';
    this.showSuccessAlert = true;
    this.processingNetworkRequest = false;
    this.showAddBudgetForm = false;
    this.showProductsButton = false;
    this.showProductsCart = false;
    this.showHoursInput = false;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3500);
  }

  isNewCustomerSelected(customer: any) {
    console.log('isNewCustomer', customer);
    console.log(this.newBudget.customer);

    if (customer == 'newCustomer') {
      this.showNewCustomerForm = true;
    } else this.showNewCustomerForm = false;

    return customer;
  }

  downloadPdf(data: any, id: any) {
    let blob = new Blob([data], { type: 'application/pdf' });
    let downloadURL = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = downloadURL;
    link.target = '_blank';
    link.download = `budgetId_${id}.pdf`;
    link.click();
  }

  changeEvent(product: any) {
    console.log(this.newBudget.productList, product);
  }

  generateNewOrder(budgetId: any, acceptedBudget: Budget) {
    this.processingNetworkRequest = true;
    console.log('generating order');
    if (budgetId)
      this.budgetService.budgetToOrder(budgetId).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.budgets = this.budgets.map((budget: Budget) => {
              if (budget.budgetId == acceptedBudget.budgetId)
                budget.budgetStatus = budgetStatus.accepted;
              return budget;
            });

            console.log(this.budgets);
            //   this.router.navigate(['/admin/budgets']);
            this.showApiSuccessResponse(response.message);
          } else this.showApiErrorResponse(response.message);
        },
        error: (error: any) => {
          this.showApiErrorResponse();
        },
      });
  }

  onBudgetCreationProductCartChange(
    index: number,
    product: Product,
    event?: any,
    newBudgetProducts?: Boolean
  ) {
    console.log(this.productsId);

    if (newBudgetProducts && product.productQuantity == 0) {
      console.log('newproduct');

      product.productQuantity += 1;
      product.quantityInStock -= 1;

      product.addedToBudgetCart = true;
      this.newBudgetProducts.push(product);
    } else if (event && event.target.checked) {
      console.log('checked', index, product);
      if (product.quantityInStock != 0) {
        product.productQuantity === 0
          ? ((product.productQuantity += 1), (product.quantityInStock -= 1))
          : product.productQuantity;
        product.addedToBudgetCart = true;
        this.newBudgetProducts.push(product);
      } else {
        product.addedToBudgetCart = false;
        alert(' quantity in stock is less than zero');
      }
    } else {
      console.log('unchecked', index, product.productQuantity, event.value);
      product.quantityInStock += product.productQuantity;
      product.productQuantity = 0;
      this.newBudgetProducts = this.newBudgetProducts.filter(
        (p: Product) => p.productId != product.productId
      );
    }

    console.log('budget products', this.newBudgetProducts);
  }

  onBudgetUpdationProductCartChanged(
    index: number,
    product: Product,
    event: any,
    newproduct: Boolean = true
  ) {
    console.log(event ? event : 'not event');
    console.log(this.productsId);

    if (
      this.updatedBudgetProducts &&
      product.productQuantity == 0 &&
      newproduct &&
      !event
    ) {
      console.log('newproduct', product);
      product.productQuantity += 1;
      product.quantityInStock -= 1;
      product.addedToBudgetCart = true;
      this.updatedBudgetProducts.push(product);
      this.productsId.push(product.productId);
      console.log('newproduct pushed', product);
    } else if (event && event.target.checked) {
      console.log('checked', index, product);
      if (product.quantityInStock != 0) {
        console.log('in 1');
        product.productQuantity === 0
          ? ((product.productQuantity += 1), (product.quantityInStock -= 1))
          : product.productQuantity;
        product.addedToBudgetCart = true;
        console.log(this.productsId);
        console.log(this.productsId.indexOf(product.productId) === -1);
        if (this.productsId.indexOf(product.productId) === -1) {
          console.log('true');
          this.updatedBudgetProducts.push(product);
          this.productsId.push(product.productId);
        }
      } else {
        product.addedToBudgetCart = false;
        console.log(product);
        alert(' quantity in stock is less than zero');
      }
    } else {
      console.log('unchecked', index, product.productQuantity, event.value);
      product.quantityInStock += product.productQuantity;
      product.productQuantity = 0;
      this.updatedBudgetProducts = this.updatedBudgetProducts.filter(
        (p: Product) => p.productId != product.productId
      );
      this.productsId = this.productsId.filter(
        (id: any) => id != product.productId
      );
    }

    console.log('budget products', this.updatedBudgetProducts);
  }

  onBudgetCreationChangeProductQuanity(product: any, operation: String) {
    console.log(product.productQuantity, 'change quantity', operation);
    if (operation === 'add') {
      if (product.productQuantity === 0) {
        this.onBudgetCreationProductCartChange(0, product, null, true);
      } else {
        product.productQuantity += 1;
        product.quantityInStock -= 1;
        if (product.quantityInStock < 0) {
          product.quantityInStock = 0;
        }
      }
    } else {
      product.productQuantity -= 1;
      product.quantityInStock += 1;
      console.log('quant', product.productQuantity);
      if (product.productQuantity <= 0) {
        console.log('less than 1');
        this.onBudgetCreationProductCartChange(0, product, 0, false);
      }
    }
  }
  onBudgetUpdationChangeProductQuanity(product: any, operation: String) {
    console.log(product.productQuantity);
    if (operation === 'add') {
      if (product.productQuantity === 0) {
        this.onBudgetUpdationProductCartChanged(0, product, null, true);
      } else {
        product.productQuantity += 1;
        product.quantityInStock -= 1;
        if (product.quantityInStock < 0) {
          product.quantityInStock = 0;
        }
      }
    } else {
      product.productQuantity -= 1;
      product.quantityInStock += 1;
      if (product.productQuantity == 0) {
        this.onBudgetUpdationProductCartChanged(0, product, false, false);
      }
      console.log('qauant', product.productQuantity);
    }

    this.updatedBudgetProducts = this.updatedBudgetProducts.map(
      (p: Product) => {
        if (p.productId === product.productId) {
          p.productQuantity = product.productQuantity;
        }
        return p;
      }
    );

    console.log(this.updatedBudgetProducts);
  }
  resetBudgetProducts() {
    this.products = this.products.map((product: Product) => {
      product.quantityInStock += product.productQuantity;
      product.productQuantity = 0;
      product.addedToBudgetCart = false;
      return product;
    });
  }

  fixDigitsAfterDecimal(value: any) {
    return parseFloat(value?.toFixed(2));
  }

  onClickPreventDefaultEvent(event: any) {
    if (event) {
      event.preventDefault();
      console.log('prevent', event);
    }
  }

  checkSelectedServices(service: Services) {
    console.log('checkSelectedServices', this.servicesName);
    if (this.servicesName.includes(service.type)) return true;
    return false;
  }
}
