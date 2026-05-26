# Implementation Plan - Spring Boot Data Processor REST API

This document details the design and implementation steps for building a production-ready Spring Boot REST API with Java 17, adhering to Clean Architecture principles. The application exposes a single POST endpoint at `/api/process` to clean, parse, and analyze mixed input data arrays.

## Proposed Architecture & Directory Structure

We will place the project in `c:\Users\yuvan\.gemini\antigravity\scratch\spring-boot-bfhl`.

```
spring-boot-bfhl/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/
    │   │       └── example/
    │   │           └── bfhl/
    │   │               ├── BfhlApplication.java
    │   │               ├── controller/
    │   │               │   └── DataProcessorController.java
    │   │               ├── dto/
    │   │               │   ├── ProcessRequestDTO.java
    │   │               │   └── ProcessResponseDTO.java
    │   │               └── service/
    │   │                   ├── DataProcessorService.java
    │   │                   └── DataProcessorServiceImpl.java
    │   └── resources/
    │       └── application.properties
    └── src/test/
        └── java/
            └── com/
                └── example/
                    └── bfhl/
                        ├── controller/
                        │   └── DataProcessorControllerTest.java
                        └── service/
                            └── DataProcessorServiceTest.java
```

---

## Proposed Component Details

### 1. Build File (`pom.xml`)
We will use Spring Boot version `3.2.5` (or latest stable) and Java `17`.
Dependencies will include:
- `spring-boot-starter-web` (for REST endpoints)
- `spring-boot-starter-validation` (for validating request data)
- `spring-boot-starter-test` (for JUnit 5, MockMvc, and AssertJ tests)

### 2. Request & Response DTOs
- **`ProcessRequestDTO`**:
  Contains a `List<String> data` field. We will add validation constraints to ensure the input list is not null.
- **`ProcessResponseDTO`**:
  Contains the following fields:
  ```java
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
  ```

### 3. Service Layer (`DataProcessorService`)
Defines the core business interface:
```java
public interface DataProcessorService {
    ProcessResponseDTO processData(ProcessRequestDTO request);
}
```

The concrete implementation **`DataProcessorServiceImpl`** handles the logic:
- **`status`**: Set to `true` on successful parsing.
- **`userId`**: Formatted as `"john_doe_26052026"` (placeholder using user_name + current date).
- **`email`**: Formatted as `"john.doe@university.edu"`.
- **`rollNumber`**: Formatted as `"0827IT231154"`.
- **Number Extraction (`evenNumbers`, `oddNumbers`, `sumOfNumbers`)**:
  - Filter strings that represent integers (e.g., matching `^-?\\d+$`).
  - Parse them to `Integer`.
  - Add to `evenNumbers` if divisible by 2, else `oddNumbers`.
  - Sum their parsed values into `sumOfNumbers`.
- **Alphabet Extraction (`alphabets`)**:
  - Filter strings that contain only letters (matching `^[a-zA-Z]+$`).
  - Convert to UPPERCASE and add to the `alphabets` list.
- **Special Character Extraction (`specialCharacters`)**:
  - Filter strings that represent special characters or non-alphanumeric content.
  - Criteria: Strings that do not match `^-?\\d+$` (not an integer) and do not match `^[a-zA-Z]+$` (not purely alphabetic).
- **`reverseAlternatingCaps`**:
  - Iterate through all input elements and extract all individual characters matching `[a-zA-Z]`.
  - Reverse the overall sequence of characters.
  - Alternating caps styling: E.g., characters at even indices (0, 2, 4...) become UPPERCASE, characters at odd indices (1, 3, 5...) become lowercase.

### 4. Controller Layer (`DataProcessorController`)
- Annotate with `@RestController` and mapping `/api/process`.
- Expose a single `POST` mapping accepting `@RequestBody @Valid ProcessRequestDTO`.
- Delegates the request to the `DataProcessorService` and returns `HttpStatus.OK`.

---

## Verification Plan

### Automated Tests
1. **`DataProcessorServiceTest`** (JUnit 5 / Mockito):
   - **Edge Cases**: Empty input array, inputs with no numbers, inputs with no alphabets.
   - **Mixed Inputs**: Correctly parses `["A", "1", "334", "4", "R", "$", "bc"]`.
   - **Alternating Caps**: Verify correct reversed order and casing for various character combinations.
2. **`DataProcessorControllerTest`** (Spring Boot `@WebMvcTest`):
   - Verify that POSTing a valid request payload returns HTTP 200 and correctly-structured JSON responses.
   - Verify that invalid payload structures receive appropriate handling.

### Manual Verification
- We will start the Spring Boot application and test it using PowerShell curl or similar commands.
- Example request:
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:8080/api/process" -Method Post -Body '{"data": ["A", "1", "334", "4", "R", "$", "bc"]}' -ContentType "application/json"
  ```
- Verify exact output format and values.
