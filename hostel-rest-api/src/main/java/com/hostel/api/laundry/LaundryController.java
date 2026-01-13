package com.hostel.api.laundry;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/laundry")
@CrossOrigin
public class LaundryController {

    public LaundryController() {
        // Start workers ONCE
        new Thread(new LaundryWorker("Machine-1")).start();
        new Thread(new LaundryWorker("Machine-2")).start();
    }

    @PostMapping("/request")
    public String requestLaundry(@RequestParam String student,
                                 @RequestParam int clothes) {

        new Thread(new StudentProducer(student, clothes)).start();
        return "Laundry request submitted for " + student;
    }

    @GetMapping("/queue-size")
    public int getQueueSize() {
        return LaundryQueue.queue.size();
    }
}

