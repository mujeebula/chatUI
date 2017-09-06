package com.mindfire.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.mindfire.dto.SignupForm;
import com.mindfire.service.SignupService;

/**
 * This controller handles the sign up process.
 * @author
 */
@Controller
public class SignupController extends WebMvcConfigurerAdapter {

	@Autowired
	private SignupService signupService;
	
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/login").setViewName("login");
    }
    
    /**
     * This returns the sign up template.
     * @param signupForm
     * @return
     */
    @GetMapping("/signup")
    public String showSignup(SignupForm signupForm) {
    	return "signup";
    }
    
    /**
     * It handles the sign up form submission.
     * On valid input it redirects the user to login page otherwise show sign up page with 
     * appropriate error.
     * @param signupForm
     * @param bindingResult
     * @return
     */
    @PostMapping("/signup")
    public String checkSignup(@Valid SignupForm signupForm, BindingResult bindingResult) {
    	boolean isFormValid = false;
    	if (bindingResult.hasErrors()) {
            return "signup";
        }
    	isFormValid = signupService.isFormValid(signupForm);
    	if(isFormValid) {
            return "redirect:/login";
    	}else {
    		bindingResult.addError(new FieldError("signForm", "username", "Username already exist."));
            return "signup";
    	}
    }
}
