import { Component, OnInit } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrl: './formulaire.component.css'
})
export class FormulaireComponent implements OnInit{
  $body: any;
  $progressBar: any;
  $animContainer: any;
  value: number = 0;
  transitionEnd: string = 'webkitTransitionEnd transitionend';

  constructor() { }

  ngOnInit(): void {
    this.$body = $('body');
    this.$progressBar = $('progress');
    this.$animContainer = $('.animation-container');
    this.formReset();
    this.setupFloatLabels();
    this.setupClickHandlers();
  }

  formReset(): void {
    this.value = 0;
    this.$progressBar.val(this.value);
    $('form input').not('button').val('').removeClass('hasInput');
    $('.js-form-step').removeClass('left leaving');
    $('.js-form-step').not('.js-form-step[data-step="1"]').addClass('hidden waiting');
    $('.js-form-step[data-step="1"]').removeClass('hidden');
    $('.form-progress-indicator').not('.one').removeClass('active');

    console.warn('Form reset.');
  }

  setupClickHandlers(): void {
    $('button[type="submit"]').on('click', (event) => {
      event.preventDefault();
      const $currentForm = $(event.target).parents('.js-form-step');
      this.showNextForm($currentForm);
    });

    $('.js-reset').on('click', () => {
      this.formReset();
    });
  }

  showNextForm($currentForm: any): void {
    const currentFormStep = parseInt($currentForm.attr('data-step'), 10) || 0; // Default to 0 if parseInt returns NaN
    const $nextForm = $('.js-form-step[data-step="' + (currentFormStep + 1) + '"]');
  
    console.log('Current step is ' + currentFormStep);
    console.log('The next form is # ' + $nextForm.attr('data-step'));
  
    this.$body.addClass('freeze');
  
    $('html, body').animate({
      scrollTop: this.$progressBar.offset().top
    }, 'fast');
  
    $currentForm.addClass('leaving');
    setTimeout(() => {
      $currentForm.addClass('hidden');
    }, 500);
  
    this.$animContainer.css({
      'paddingBottom': $nextForm.height() + 'px'
    });
  
    $nextForm.removeClass('hidden')
      .addClass('coming')
      .one(this.transitionEnd, () => {
        $nextForm.removeClass('coming waiting');
      });
  
    this.value += 33;
  
    if (this.value >= 100) {
      this.formReset();
    } else {
      $('.form-progress')
        .find('.form-progress-indicator.active')
        .next('.form-progress-indicator')
        .addClass('active');
  
      this.$progressBar.prop('value', this.value); // Use .prop('value') to set the value
    }
  
    $('.js-form-progress-completion').html(this.$progressBar.prop('value') + '% complete'); // Use .prop('value') to get the value
  
    this.$body.removeClass('freeze');
  }
  
  setupFloatLabels(): void {
    $('form input').not('button').on('blur', (event) => { // Use arrow function to preserve 'this' context
      const inputElement = event.target as HTMLInputElement; // Cast event.target to HTMLInputElement
      switch (inputElement.tagName) {
        case 'SELECT':
          if (inputElement.value > '0') { // Compare with string '0'
            inputElement.className = 'hasInput';
          } else {
            inputElement.className = '';
          }
          break;
  
        case 'INPUT':
          if (inputElement.value !== '') {
            inputElement.className = 'hasInput';
          } else {
            inputElement.className = '';
          }
          break;
  
        default:
          break;
      }
    });
  }
  
  
}
