package com.mindfire.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mindfire.dto.LoginForm;
import com.mindfire.entity.Credential;
import com.mindfire.entity.User;
import com.mindfire.repository.LoginRepository;
import com.mindfire.repository.UserCredentialRepository;

/*
 * LoginService.java
 * 
 * Service for Login process
 */
@Service
public class LoginService {

	@Autowired
	private LoginRepository loginRepository;

	@Autowired
	private UserCredentialRepository userCredentialRepository;

	/**
	 * A method to check weather the given login details are correct or not. return
	 * true if details exist in database else return false
	 * 
	 * @param loginForm
	 * @return
	 */
	public boolean isAuthenticated(LoginForm loginForm) {
		Credential userCredential = null;
		try {
			User user = loginRepository.findByUsername(loginForm.getUsername());
			if (user != null) {
				userCredential = userCredentialRepository.findByUserIdAndPassword(user.getUserId(),
						loginForm.getPassword());
			}
			if (user == null || userCredential == null) {
				return false;
			}
		} catch (Exception ex) {
			throw ex;
		} finally {
		}
		return true;
	}

}