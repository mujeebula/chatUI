package com.mindfire;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.mindfire.entity.User;
import com.mindfire.repository.LoginRepository;


@Controller
public class LoginController extends WebMvcConfigurerAdapter {

	@Autowired
	private LoginRepository loginRepository;
	
	
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/signup").setViewName("signup");
        registry.addViewController("/home").setViewName("home");
        registry.addViewController("/login").setViewName("login");
    }

    @GetMapping("/")
    public String showLoginForm() {
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String showLogin(LoginForm loginForm) {
    	return "login";
    }
    
    @PostMapping("/login")
    public String checkLogin(@Valid LoginForm loginForm, BindingResult bindingResult, 
    		RedirectAttributes redirectAttributes) {
    	if (bindingResult.hasErrors()) {
            return "login";
        }
    	User user = loginRepository.findByUsernameAndPassword(loginForm.getUsername(), loginForm.getPassword());
    	if(user == null) {
    		return "login";
    	}
    	redirectAttributes.addAttribute("username", user.getUsername());
        return "redirect:/chat";// + user.getUsername();
    }
    
    @GetMapping("/chat")
    public String chat(@RequestParam(name="username") String username) {
    	System.out.println(username);
    	return "chat";
    }
}
