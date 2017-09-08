package com.mindfire.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mindfire.entity.Credential;

/*
 * UserCredentialRepository.java
 * 
 * Repository for User credentials
 */
public interface UserCredentialRepository extends JpaRepository<Credential, Long> {

	Credential findByUserIdAndPassword(Long userId, String password);

}
