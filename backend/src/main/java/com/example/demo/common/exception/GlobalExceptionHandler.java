package com.example.demo.common.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiError handleNotFound(
            NotFoundException exception,
            HttpServletRequest request
    ) {
        return new ApiError(
                404,
                "Not Found",
                exception.getMessage(),
                request.getRequestURI(),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiError handleConflict(
            ConflictException exception,
            HttpServletRequest request
    ) {
        return new ApiError(
                409,
                "Conflict",
                exception.getMessage(),
                request.getRequestURI(),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleValidation(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Validation error");

        return new ApiError(
                400,
                "Bad Request",
                message,
                request.getRequestURI(),
                LocalDateTime.now()
        );
    }


        @ExceptionHandler(HttpMessageNotReadableException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ApiError handleInvalidJson(
                HttpMessageNotReadableException exception,
                HttpServletRequest request
        ) {
        return new ApiError(
                400,
                "Bad Request",
                "Invalid JSON request body: " + exception.getMostSpecificCause().getMessage(),
                request.getRequestURI(),
                LocalDateTime.now()
        );
        }


    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiError handleGeneral(
            Exception exception,
            HttpServletRequest request
    ) {
        return new ApiError(
                500,
                "Internal Server Error",
                exception.getMessage(),
                request.getRequestURI(),
                LocalDateTime.now()
        );
    }


        @ExceptionHandler(ForbiddenException.class)
        @ResponseStatus(HttpStatus.FORBIDDEN)
        public ApiError handleForbidden(
                ForbiddenException exception,
                HttpServletRequest request
        ) {
        return new ApiError(
                403,
                "Forbidden",
                exception.getMessage(),
                request.getRequestURI(),
                LocalDateTime.now()
        );
        }


}