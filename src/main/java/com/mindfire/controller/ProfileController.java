package com.mindfire.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

/**
 * This controller handles the profile updation process.
 * @author
 *
 */
@Controller
public class ProfileController {

	/**
     * This returns the profile template.
     * 
     * @param signupForm
     * @return
     */
    @PostMapping("/updateProfile")
    public String showProfile(SignupForm signupForm) {
    	return "signup";
    }
}
