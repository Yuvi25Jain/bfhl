package com.example.bfhl.controller;

import com.example.bfhl.dto.ProcessRequestDTO;
import com.example.bfhl.dto.ProcessResponseDTO;
import com.example.bfhl.service.DataProcessorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DataProcessorController.class)
public class DataProcessorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DataProcessorService dataProcessorService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testProcessData_Success() throws Exception {
        ProcessRequestDTO request = new ProcessRequestDTO();
        request.setData(Arrays.asList("A", "1"));

        ProcessResponseDTO mockResponse = new ProcessResponseDTO(
                true,
                "john_doe_26052026",
                "john.doe@university.edu",
                "0827IT231154",
                Collections.emptyList(),
                Arrays.asList(1),
                Arrays.asList("A"),
                Collections.emptyList(),
                1,
                "A"
        );

        when(dataProcessorService.processData(any(ProcessRequestDTO.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/process")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.userId").value("john_doe_26052026"))
                .andExpect(jsonPath("$.email").value("john.doe@university.edu"))
                .andExpect(jsonPath("$.rollNumber").value("0827IT231154"))
                .andExpect(jsonPath("$.oddNumbers[0]").value(1))
                .andExpect(jsonPath("$.alphabets[0]").value("A"))
                .andExpect(jsonPath("$.sumOfNumbers").value(1))
                .andExpect(jsonPath("$.reverseAlternatingCaps").value("A"));
    }

    @Test
    void testProcessData_ValidationError_NullData() throws Exception {
        ProcessRequestDTO request = new ProcessRequestDTO();
        request.setData(null);

        mockMvc.perform(post("/api/process")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
