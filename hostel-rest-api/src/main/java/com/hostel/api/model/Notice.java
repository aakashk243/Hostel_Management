package com.hostel.api.model;

import java.time.LocalDate;

public class Notice {
    private String title;
    private String message;
    private LocalDate date;

    public Notice(String title, String message, LocalDate date) {
        this.title = title;
        this.message = message;
        this.date = date;
    }

    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public LocalDate getDate() { return date; }
}
