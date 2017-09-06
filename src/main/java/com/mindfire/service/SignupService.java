package com.mindfire.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mindfire.dto.SignupForm;
import com.mindfire.entity.Credential;
import com.mindfire.entity.User;
import com.mindfire.repository.LoginRepository;
import com.mindfire.repository.UserCredentialRepository;

@Service
public class SignupService {

	@Autowired
	private LoginRepository loginRepository;
	
	@Autowired
	private UserCredentialRepository userCredentialRepository;
	
	public boolean isFormValid(SignupForm signupForm) {
		Credential userCredential = null;
		User user = null;
		
    	userCredential = new Credential(signupForm.getPassword());
    	user = new User(signupForm.getUsername(), 
    			signupForm.getFirstName(), signupForm.getLastName());
		user = loginRepository.save(user);
		if(user.getUserId() != 0L) {
			userCredential.setUserId(user.getUserId());
    		userCredentialRepository.save(userCredential);
    		if(userCredential.getCredentialId() != 0L) {
    			return true;
    		}
		}else {
			return false;
		}
		return false;
	}

}
