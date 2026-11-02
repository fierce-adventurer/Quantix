package com.quantix.shared.dto;

public record ApiResponse<T>(
    boolean success,
    T data,
    String message,
    Object error
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, null);
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, data, message, null);
    }

    public static <T> ApiResponse<T> fail(String message, Object error) {
        return new ApiResponse<>(false, null, message, error);
    }

    public static <T> ApiResponse<T> fail(String message) {
        return new ApiResponse<>(false, null, message, null);
    }
}
