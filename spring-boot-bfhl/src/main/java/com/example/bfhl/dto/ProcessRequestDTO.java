package com.example.bfhl.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class ProcessRequestDTO {

    @NotNull(message = "Input data array cannot be null")
    private List<String> data;

    public List<String> getData() {
        return data;
    }

    public void setData(List<String> data) {
        this.data = data;
    }
}
