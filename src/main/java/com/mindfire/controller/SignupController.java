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
import com.mindfire.entity.User;
import com.mindfire.entity.UserCredential;
import com.mindfire.repository.LoginRepository;
import com.mindfire.repository.UserCredentialRepository;

/**
 * This controller handles the sign up process.
 * @author
 *
 */
@Controller
public class SignupController extends WebMvcConfigurerAdapter {

	@Autowired
	private LoginRepository loginRepository;
	
	@Autowired
	private UserCredentialRepository userCredentialRepository;
	
	
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/login").setViewName("login");
    }
    
    /**
     * This returns the sign up template.
     * 
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
     * 
     * @param signupForm
     * @param bindingResult
     * @return
     */
    @PostMapping("/signup")
    public String checkSignup(@Valid SignupForm signupForm, BindingResult bindingResult) {
    	if (bindingResult.hasErrors()) {
            return "signup";
        }
    	UserCredential userCredential = new UserCredential(signupForm.getUsername(), signupForm.getPassword());
    	try {
    		userCredential = userCredentialRepository.save(userCredential);
    	}catch(Exception e) {
    		bindingResult.addError(new FieldError("signForm", "username", "Username already exist."));
            return "signup";	
    	}
    	User user = new User(userCredential.getId(), userCredential.getUsername(), 
    			signupForm.getFirstName(), signupForm.getLastName());
    	loginRepository.save(user);
        return "redirect:/login";
    }
}
