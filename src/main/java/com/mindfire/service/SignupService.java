package com.mindfire.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mindfire.dto.SignupForm;
import com.mindfire.entity.Credential;
import com.mindfire.entity.User;
import com.mindfire.repository.LoginRepository;
import com.mindfire.repository.UserCredentialRepository;

/*
 * SignupService.java
 * 
 * Service for Sign up process
 */
@Service
public class SignupService {

	@Autowired
	private LoginRepository loginRepository;

	@Autowired
	private UserCredentialRepository userCredentialRepository;

	/**
	 * Method checks weather the form has valid values or not.
	 * 
	 * @param signupForm
	 * @return true if form is valid else return false
	 */
	public boolean isFormValid(SignupForm signupForm) {
		Credential userCredential = new Credential(signupForm.getPassword());
		User user = new User(signupForm.getUsername(), signupForm.getFirstName(), signupForm.getLastName());
		try {
			user = loginRepository.save(user);
			if (user.getUserId() != 0L) {
				userCredential.setUserId(user.getUserId());
				userCredentialRepository.save(userCredential);
				if (userCredential.getCredentialId() != 0L) {
					return true;
				}
			} else {
				return false;
			}
		} catch (Exception ex) {
			throw ex;
		}
		return false;
	}

}
