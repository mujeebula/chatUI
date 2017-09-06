package com.mindfire.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class LoginForm {
	@NotNull
	@Size(min = 2, max = 30)
	private String username;

	@NotNull
	@Size(min = 1, max = 16)
	private String password;

	@Override
	public String toString() {
		return "LoginForm [username=" + username + ", password=" + password + "]";
	}

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

}
