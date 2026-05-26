package com.example.bfhl.service;

import com.example.bfhl.dto.ProcessRequestDTO;
import com.example.bfhl.dto.ProcessResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class DataProcessorServiceTest {

    private DataProcessorService dataProcessorService;

    @BeforeEach
    void setUp() {
        dataProcessorService = new DataProcessorServiceImpl();
    }

    @Test
    void testProcessData_MixedInputs() {
        ProcessRequestDTO request = new ProcessRequestDTO();
        request.setData(Arrays.asList("A", "1", "334", "4", "R", "$", "bc"));

        ProcessResponseDTO response = dataProcessorService.processData(request);

        assertTrue(response.isStatus());
        assertEquals("john_doe_26052026", response.getUserId());
        assertEquals("john.doe@university.edu", response.getEmail());
        assertEquals("0827IT231154", response.getRollNumber());

        // Numbers: 1, 334, 4
        // Even: 334, 4
        // Odd: 1
        // Sum: 339
        assertEquals(Arrays.asList(334, 4), response.getEvenNumbers());
        assertEquals(Arrays.asList(1), response.getOddNumbers());
        assertEquals(339, response.getSumOfNumbers());

        // Alphabets: "A", "R", "bc" -> "A", "R", "BC"
        assertEquals(Arrays.asList("A", "R", "BC"), response.getAlphabets());

        // Special characters: "$"
        assertEquals(Arrays.asList("$"), response.getSpecialCharacters());

        // Alphabetic characters: A, R, b, c
        // Reversed: c, b, R, A
        // Alternating Case: C, b, R, a
        assertEquals("CbRa", response.getReverseAlternatingCaps());
    }

    @Test
    void testProcessData_EmptyData() {
        ProcessRequestDTO request = new ProcessRequestDTO();
        request.setData(Collections.emptyList());

        ProcessResponseDTO response = dataProcessorService.processData(request);

        assertTrue(response.isStatus());
        assertTrue(response.getEvenNumbers().isEmpty());
        assertTrue(response.getOddNumbers().isEmpty());
        assertTrue(response.getAlphabets().isEmpty());
        assertTrue(response.getSpecialCharacters().isEmpty());
        assertEquals(0, response.getSumOfNumbers());
        assertEquals("", response.getReverseAlternatingCaps());
    }

    @Test
    void testProcessData_NumbersOnly() {
        ProcessRequestDTO request = new ProcessRequestDTO();
        request.setData(Arrays.asList("12", "-3", "0", "9"));

        ProcessResponseDTO response = dataProcessorService.processData(request);

        assertTrue(response.isStatus());
        assertEquals(Arrays.asList(12, 0), response.getEvenNumbers());
        assertEquals(Arrays.asList(-3, 9), response.getOddNumbers());
        assertEquals(18, response.getSumOfNumbers());
        assertTrue(response.getAlphabets().isEmpty());
        assertTrue(response.getSpecialCharacters().isEmpty());
        assertEquals("", response.getReverseAlternatingCaps());
    }

    @Test
    void testProcessData_AlphabetsOnly() {
        ProcessRequestDTO request = new ProcessRequestDTO();
        request.setData(Arrays.asList("x", "Y", "Z", "ab"));

        ProcessResponseDTO response = dataProcessorService.processData(request);

        assertTrue(response.isStatus());
        assertTrue(response.getEvenNumbers().isEmpty());
        assertTrue(response.getOddNumbers().isEmpty());
        assertEquals(0, response.getSumOfNumbers());
        assertEquals(Arrays.asList("X", "Y", "Z", "AB"), response.getAlphabets());
        assertTrue(response.getSpecialCharacters().isEmpty());

        // Alphabetic characters: x, Y, Z, a, b
        // Reversed: b, a, Z, Y, x
        // Alternating: B, a, Z, y, X
        assertEquals("BaZyX", response.getReverseAlternatingCaps());
    }

    @Test
    void testProcessData_SpecialCharactersOnly() {
        ProcessRequestDTO request = new ProcessRequestDTO();
        request.setData(Arrays.asList("@", "#", "$", "*"));

        ProcessResponseDTO response = dataProcessorService.processData(request);

        assertTrue(response.isStatus());
        assertTrue(response.getEvenNumbers().isEmpty());
        assertTrue(response.getOddNumbers().isEmpty());
        assertEquals(0, response.getSumOfNumbers());
        assertTrue(response.getAlphabets().isEmpty());
        assertEquals(Arrays.asList("@", "#", "$", "*"), response.getSpecialCharacters());
        assertEquals("", response.getReverseAlternatingCaps());
    }
}
