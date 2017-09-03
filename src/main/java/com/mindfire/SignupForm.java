package com.mindfire;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class SignupForm {

	@NotNull
	@Size(min = 2, max = 30)
	private String username;

	@NotNull
	private String password;

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

	@Override
	public String toString() {
		return "SignupForm [username=" + username + ", password=" + password + "]";
	}
}
