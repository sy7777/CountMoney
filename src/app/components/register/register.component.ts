import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UserFilter } from '../user-account/user-account.component';
import { v4 as uuidv4 } from 'uuid';
import { ToastService } from 'ng-zorro-antd-mobile';
import { Router } from '@angular/router';
import { TransmitService } from 'src/app/services/transmit.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isError: boolean = false;

  onFocus: object = {
    focus: false,
  };

  formErrors: any = {
    username: '',
    password: '',
  };

  formData: any = {
    username: '',
    password: '',
  };

  validationMessage: any = {
    username: {
      minlength: 'At least four characters for account',
      maxlength: 'At most ten characters for account',
      required: 'username requied',
    },
    password: {},
  };
  flag = true;
  index = 0;
  registerUser: UserFilter;
  constructor(
    private firebase: FirebaseService,
    private _toast: ToastService,
    private router: Router,
    private service: TransmitService
  ) {}

  ngOnInit() {
    this.buildForm();
  }
  onChange(item) {}

  onTabClick(item) {}

  selectCard(e) {}

  changeIndex() {
    this.index = 0;
  }

  onClick() {}

  buildForm(): void {
    this.registerForm = new FormGroup({
      username: new FormControl(this.formData.username, [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(5),
      ]),
      password: new FormControl(this.formData.password, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });

    this.registerForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.registerForm) {
      return;
    }
    const form = this.registerForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessage[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + '\n';
        }
      }
    }
  }

  beforeSubmit() {
    const form = this.registerForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && !control.valid) {
        const messages = this.validationMessage[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + '\n';
          if (field === 'username') {
            this.onFocus = {
              focus: true,
            };
          }
        }
        return false;
      } else {
        return true;
      }
    }
  }

  onSubmit() {
    if (this.beforeSubmit()) {
      this.registerUser = this.registerForm.value;
      this.registerUser.userId = uuidv4();
      this.firebase.registerUser(this.registerUser).then((res) => {
        if (res) {
          this.onReset();
          this.index = 1;
        }
      });
    } else {
      this._toast.offline('You should enter something...', 3000);
    }
  }

  async loginSubmit(user) {
    const res = await this.firebase.checkUserAuth(user);
    if (!res.empty) {
      this._toast.success('Log in successfully', 3000);

      res.forEach((doc) => {
        this.service.setTrans('users', doc.data());
      });

      this.router.navigate(['/user-account']);
    } else {
      this._toast.offline('Wrong name our password.', 3000);
    }
  }
  onReset() {
    this.registerForm.reset();
    this.formData = {
      ...{
        username: '',
        password: '',
      },
    };
    this.isError = false;
  }

  afterChange(event) {}

  inputErrorClick(e) {
    alert('At least four charactors for account');
  }

  inputChange(e) {
    if (e.replace(/\s/g, '').length < 5 && e.replace(/\s/g, '').length > 0) {
      this.isError = true;
    } else {
      this.isError = false;
    }
    this.formData.username = e;
  }
}
