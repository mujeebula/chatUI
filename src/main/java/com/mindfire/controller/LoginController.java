package com.mindfire.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.mindfire.entity.User;
import com.mindfire.entity.UserCredential;
import com.mindfire.repository.LoginRepository;
import com.mindfire.repository.UserCredentialRepository;

/**
 * This controller handles the login process
 * @author 
 *
 */

@Controller
public class LoginController extends WebMvcConfigurerAdapter {

	@Autowired
	private LoginRepository loginRepository;

	@Autowired
	private UserCredentialRepository userCredentialRepository;

	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/signup").setViewName("signup");
		registry.addViewController("/home").setViewName("home");
		registry.addViewController("/login").setViewName("login");
	}
	
	/**
	 * It redirects the user to login page.
	 * 
	 * @return
	 */
	@GetMapping("/")
	public String showLoginForm() {
		return "redirect:/login";
	}

	/**
	 * It returns the login template
	 * 
	 * @param loginForm
	 * @return
	 */
	@GetMapping("/login")
	public String showLogin(LoginForm loginForm) {
		return "login";
	}
	
	/**
	 * This method handles the login form submission and user credential validation.
	 * Login success redirects to chat page otherwise show login page with error.
	 * 
	 * @param loginForm
	 * @param bindingResult
	 * @param redirectAttributes
	 * @return
	 */
	@PostMapping("/login")
	public String checkLogin(@Valid LoginForm loginForm, BindingResult bindingResult,
			RedirectAttributes redirectAttributes) {
		if (bindingResult.hasErrors()) {
			return "login";
		}
		try {
			UserCredential userCredential = userCredentialRepository.findByUsernameAndPassword(loginForm.getUsername(),
					loginForm.getPassword());
			if (userCredential == null) {
				bindingResult.addError(new FieldError("loginForm", "password", "Invalid credentials"));
				return "login";
			}
		}catch(Exception e) {
			return "login";
		}
		User user = loginRepository.findByUsername(loginForm.getUsername());
		redirectAttributes.addAttribute("username", user.getUsername());
		return "redirect:/chat";
	}
	
	/**
	 * It returns the chat template.
	 * 
	 * @param username
	 * @return
	 */
	@GetMapping("/chat")
	public String chat(@RequestParam(name = "username") String username) {
		return "chat";
	}
}
