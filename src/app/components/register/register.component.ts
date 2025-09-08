import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  ngOnInit(): void {
  }

  registerForm: FormGroup;
    constructor(private fb: FormBuilder, private router: Router) {
      this.registerForm = this.fb.group({
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(16)
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
          ]
        ]
      });
    }
    // Getters for easy access in template
    get username() {
      return this.registerForm.get('username');
    }
  
    get password() {
      return this.registerForm.get('password');
    }

      onSubmit() {
    if (this.registerForm.valid) {
      console.log('Form Data:', this.registerForm.value);
      alert(`Welcome ${this.username?.value}! 🎉`);
      this.router.navigate(['/login']);
    } else {
      alert('Form is invalid ❌');
    }
  }

}
