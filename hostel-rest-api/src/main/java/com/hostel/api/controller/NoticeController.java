package com.hostel.api.controller;

import com.hostel.api.model.Notice;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "http://localhost:3000")
public class NoticeController {

    private final List<Notice> notices = new ArrayList<>();

    @GetMapping
    public List<Notice> getNotices() {
        return notices;
    }

    @PostMapping
    public void addNotice(@RequestBody Notice notice) {
        notices.add(
            new Notice(
                notice.getTitle(),
                notice.getMessage(),
                LocalDate.now()
            )
        );
    }
}
