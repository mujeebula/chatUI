package com.mindfire.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/*
 * SignupForm.java
 * 
 * DTO used for Sign up activity
 */
public class SignupForm {

	@NotNull
	@Size(min = 2, max = 30)
	private String username;

	@NotNull
	@Size(min = 2, max = 15)
	private String password;
	
	@NotNull
	@Size(min = 2, max = 30)
	private String firstName;
	
	@NotNull
	@Size(min = 2, max = 30)
	private String lastName;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
}