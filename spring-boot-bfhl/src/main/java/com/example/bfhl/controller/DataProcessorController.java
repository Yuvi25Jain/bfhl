package com.example.bfhl.controller;

import com.example.bfhl.dto.ProcessRequestDTO;
import com.example.bfhl.dto.ProcessResponseDTO;
import com.example.bfhl.service.DataProcessorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/process")
@CrossOrigin(origins = "*")
public class DataProcessorController {

    private final DataProcessorService dataProcessorService;

    public DataProcessorController(DataProcessorService dataProcessorService) {
        this.dataProcessorService = dataProcessorService;
    }

    @PostMapping
    public ResponseEntity<ProcessResponseDTO> processData(@Valid @RequestBody ProcessRequestDTO request) {
        ProcessResponseDTO response = dataProcessorService.processData(request);
        return ResponseEntity.ok(response);
    }
}
