package com.example.bfhl.dto;

import java.util.List;

public class ProcessResponseDTO {

    private boolean status;
    private String userId;
    private String email;
    private String rollNumber;
    private List<Integer> evenNumbers;
    private List<Integer> oddNumbers;
    private List<String> alphabets;
    private List<String> specialCharacters;
    private int sumOfNumbers;
    private String reverseAlternatingCaps;

    public ProcessResponseDTO() {}

    public ProcessResponseDTO(boolean status, String userId, String email, String rollNumber,
                              List<Integer> evenNumbers, List<Integer> oddNumbers,
                              List<String> alphabets, List<String> specialCharacters,
                              int sumOfNumbers, String reverseAlternatingCaps) {
        this.status = status;
        this.userId = userId;
        this.email = email;
        this.rollNumber = rollNumber;
        this.evenNumbers = evenNumbers;
        this.oddNumbers = oddNumbers;
        this.alphabets = alphabets;
        this.specialCharacters = specialCharacters;
        this.sumOfNumbers = sumOfNumbers;
        this.reverseAlternatingCaps = reverseAlternatingCaps;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public List<Integer> getEvenNumbers() {
        return evenNumbers;
    }

    public void setEvenNumbers(List<Integer> evenNumbers) {
        this.evenNumbers = evenNumbers;
    }

    public List<Integer> getOddNumbers() {
        return oddNumbers;
    }

    public void setOddNumbers(List<Integer> oddNumbers) {
        this.oddNumbers = oddNumbers;
    }

    public List<String> getAlphabets() {
        return alphabets;
    }

    public void setAlphabets(List<String> alphabets) {
        this.alphabets = alphabets;
    }

    public List<String> getSpecialCharacters() {
        return specialCharacters;
    }

    public void setSpecialCharacters(List<String> specialCharacters) {
        this.specialCharacters = specialCharacters;
    }

    public int getSumOfNumbers() {
        return sumOfNumbers;
    }

    public void setSumOfNumbers(int sumOfNumbers) {
        this.sumOfNumbers = sumOfNumbers;
    }

    public String getReverseAlternatingCaps() {
        return reverseAlternatingCaps;
    }

    public void setReverseAlternatingCaps(String reverseAlternatingCaps) {
        this.reverseAlternatingCaps = reverseAlternatingCaps;
    }
}
