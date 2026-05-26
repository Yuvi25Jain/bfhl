package com.example.bfhl.service;

import com.example.bfhl.dto.ProcessRequestDTO;
import com.example.bfhl.dto.ProcessResponseDTO;

public interface DataProcessorService {
    ProcessResponseDTO processData(ProcessRequestDTO request);
}
