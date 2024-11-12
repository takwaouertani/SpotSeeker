// spec.js

describe('Angular App', function() {
    it('should have a title', function() {
      // Load the Angular app in the browser
      browser.get('http://localhost:4200');
  
      // Assert that the title of the page is correct
      expect(browser.getTitle()).toEqual('Expected Title');
    });
  
    it('should navigate to the login page', function() {
      // Load the Angular app in the browser
      browser.get('ttp://localhost:4200');
  
      // Find the login button and click on it
      element(by.id('login-button')).click();
  
      // Assert that the current URL matches the expected login page URL
      expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/home/login_admin');
    });
  
    it('should login successfully', function() {
      // Load the Angular app in the browser
      browser.get('http://localhost:4200/home/login_admin');
  
      // Fill in the login form
      element(by.id('username')).sendKeys('your_username');
      element(by.id('password')).sendKeys('your_password');
      element(by.id('login-button')).click();
  
      // Assert that the user is redirected to the home page after successful login
      expect(browser.getCurrentUrl()).toEqual('https://your-angular-app-url.com/home');
    });
  });
  