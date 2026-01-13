package com.hostel.api.controller;

import com.hostel.api.sharedmemory.MessSharedMemory;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/mess")
public class MessFeedbackController {

    @GetMapping("/today")
    public Object getTodayMenu() {
        return MessSharedMemory.getTodayMenu();
    }

    @PostMapping("/feedback/item")
    public void itemFeedback(@RequestParam String item,
                             @RequestParam String type) {
        MessSharedMemory.giveItemFeedback(item, type);
    }

    @PostMapping("/feedback/overall")
    public void overallFeedback(@RequestParam String type) {
        MessSharedMemory.giveOverallFeedback(type);
    }
}
