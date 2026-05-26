package com.example.bfhl.service;

import com.example.bfhl.dto.ProcessRequestDTO;
import com.example.bfhl.dto.ProcessResponseDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class DataProcessorServiceImpl implements DataProcessorService {

    private static final String USER_ID = "john_doe_26052026";
    private static final String EMAIL = "john.doe@university.edu";
    private static final String ROLL_NUMBER = "0827IT231154";

    @Override
    public ProcessResponseDTO processData(ProcessRequestDTO request) {
        List<String> inputData = request.getData();
        if (inputData == null) {
            inputData = Collections.emptyList();
        }

        List<Integer> evenNumbers = new ArrayList<>();
        List<Integer> oddNumbers = new ArrayList<>();
        List<String> alphabets = new ArrayList<>();
        List<String> specialCharacters = new ArrayList<>();
        int sumOfNumbers = 0;

        // For extracting all alphabetical characters across all input items
        List<Character> allAlphabeticChars = new ArrayList<>();

        for (String item : inputData) {
            if (item == null || item.isEmpty()) {
                continue;
            }

            // 1. Check if the entire item is an integer (supports optional negative sign)
            if (isInteger(item)) {
                int number = Integer.parseInt(item);
                sumOfNumbers += number;
                if (number % 2 == 0) {
                    evenNumbers.add(number);
                } else {
                    oddNumbers.add(number);
                }
            } 
            // 2. Check if the entire item is alphabetic (only a-z, A-Z)
            else if (isAlphabetic(item)) {
                alphabets.add(item.toUpperCase());
                // Collect each individual alphabetical character
                for (char c : item.toCharArray()) {
                    allAlphabeticChars.add(c);
                }
            } 
            // 3. Otherwise, classify as special characters / non-alphanumeric strings
            else {
                specialCharacters.add(item);
                // Even if the string itself contains mixed special characters and letters (e.g. "a$b"),
                // we should extract any individual letters inside it for reverseAlternatingCaps
                for (char c : item.toCharArray()) {
                    if (Character.isLetter(c)) {
                        allAlphabeticChars.add(c);
                    }
                }
            }
        }

        // Compute reverseAlternatingCaps
        // Reverse overall order of alphabetical characters
        Collections.reverse(allAlphabeticChars);

        StringBuilder reverseAlternatingCapsBuilder = new StringBuilder();
        for (int i = 0; i < allAlphabeticChars.size(); i++) {
            char c = allAlphabeticChars.get(i);
            if (i % 2 == 0) {
                reverseAlternatingCapsBuilder.append(Character.toUpperCase(c));
            } else {
                reverseAlternatingCapsBuilder.append(Character.toLowerCase(c));
            }
        }
        String reverseAlternatingCaps = reverseAlternatingCapsBuilder.toString();

        return new ProcessResponseDTO(
                true,
                USER_ID,
                EMAIL,
                ROLL_NUMBER,
                evenNumbers,
                oddNumbers,
                alphabets,
                specialCharacters,
                sumOfNumbers,
                reverseAlternatingCaps
        );
    }

    private boolean isInteger(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        try {
            Integer.parseInt(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean isAlphabetic(String str) {
        return str != null && str.matches("^[a-zA-Z]+$");
    }
}
