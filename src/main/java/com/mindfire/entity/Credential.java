package com.mindfire.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Credential extends AbstractTimestampEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long credentialId;
	@Column(unique = true, nullable = false)
	private Long userId;
	private String password;
	
	public Credential() {}
	
	public Credential(String password) {
		this.password = password;
	}
	public Long getCredentialId() {
		return credentialId;
	}
	public void setCredentialId(Long credentialId) {
		this.credentialId = credentialId;
	}
	
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	@Override
	public String toString() {
		return "UserCredential [credentialId=" + credentialId + ", userId=" + userId + ", password=" + password + "]";
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
}
