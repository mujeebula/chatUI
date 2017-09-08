package com.mindfire.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mindfire.entity.User;

/*
 * LoginRepository.java
 * 
 * Repository for User details
 */
public interface LoginRepository extends JpaRepository<User, Long> {
	User findByUsername(String username);

}
