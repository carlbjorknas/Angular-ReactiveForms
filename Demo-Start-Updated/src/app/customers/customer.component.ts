import { Component, OnInit } from '@angular/core';

import { Customer } from './customer';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

function ratingRange(c: AbstractControl): {[key: string]: boolean} | null {
  if (c.value != undefined && (isNaN(c.value) || c.value < 1 || c.value > 5)){
    return {'range': true}
  }
  return null
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup
  customer = new Customer();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName:['', [Validators.required, Validators.minLength(3)]],
      lastName:['',[Validators.required, Validators.maxLength(50)]],
      email:['',[Validators.required, Validators.email]], 
      // Exempel med regex: Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')
      phone:'',
      notification:'email',
      sendCatalog:true,
      rating: ['', ratingRange]
    })
  }

  populateTestData() {
    // Use setValue when setting ALL values in the form
    // this.customerForm.setValue({
    //   firstName: 'Jack',
    //   lastName: 'Harkness',
    //   email: 'jack@torchwood.com',
    //   sendCatalog: false
    // })

    // Use patchValue when setting a subset of the values in a form
    this.customerForm.patchValue({
      firstName: 'Jack',
      sendCatalog: false
    })
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone')
    if (notifyVia == 'text'){
      phoneControl.setValidators(Validators.required)
    } else {
      phoneControl.clearValidators()
    }
    phoneControl.updateValueAndValidity()
  }
}
