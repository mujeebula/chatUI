package com.mindfire;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import com.mindfire.entity.User;
import com.mindfire.repository.LoginRepository;


@Controller
public class SignupController extends WebMvcConfigurerAdapter {

	@Autowired
	private LoginRepository loginRepository;
	
	
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/login").setViewName("login");
    }
    
    @GetMapping("/signup")
    public String showSignup(SignupForm signupForm) {
    	return "signup";
    }
    
    @PostMapping("/signup")
    public String checkSignup(@Valid SignupForm signupForm, BindingResult bindingResult) {
    	if (bindingResult.hasErrors()) {
            return "signup";
        }
    	User user = new User(signupForm.getUsername(), signupForm.getPassword());
    	loginRepository.save(user);
        return "redirect:/login";
    }
}
