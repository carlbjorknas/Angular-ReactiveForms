import { Component, OnInit } from '@angular/core';

import { Customer } from './customer';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

function emailMatcher(c: AbstractControl){
  let emailControl = c.get('email')
  let confirmControl = c.get('confirmEmail')

  // Det här var föreslaget i kursen, men jag tycker det är bättre UX utan
  // ifall nån t ex missar/missuppfattar och bara fyller i confirm email
  // if (emailControl.pristine || confirmControl.pristine){
  //   return null
  // }

  if (emailControl.value == confirmControl.value){
    return null
  }
  return {'match': true}
}

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): {[key: string]: boolean} | null => {
    if (c.value != undefined && (isNaN(c.value) || c.value < min || c.value > max)){
      return {'range': true}
    }
    return null
  }
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
      emailGroup: this.fb.group({
        email:['',[Validators.required, Validators.email]], 
        // Exempel med regex: Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')
        confirmEmail:''
      }, {validator: emailMatcher}),
      phone:'',
      notification:'email',
      sendCatalog:true,
      rating: ['', ratingRange(1, 5)]
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
