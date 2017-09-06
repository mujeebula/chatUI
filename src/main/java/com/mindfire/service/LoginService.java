package com.mindfire.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mindfire.dto.LoginForm;
import com.mindfire.entity.Credential;
import com.mindfire.entity.User;
import com.mindfire.repository.LoginRepository;
import com.mindfire.repository.UserCredentialRepository;

@Service
public class LoginService {

	@Autowired
	private LoginRepository loginRepository;
	
	@Autowired
	private UserCredentialRepository userCredentialRepository;
	
	public boolean isAuthenticated(LoginForm loginForm) {
		Credential userCredential = null;
		User user = null;
		
		user = loginRepository.findByUsername(loginForm.getUsername());
		if(user != null) {
			userCredential = userCredentialRepository.findByUserIdAndPassword(
				user.getUserId(), loginForm.getPassword());
		}
		if (user == null || userCredential == null) {
			return false;
		}
		return true;
	}

}