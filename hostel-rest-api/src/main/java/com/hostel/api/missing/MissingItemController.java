package com.hostel.api.missing;


import org.springframework.web.bind.annotation.*;
import java.util.Collection;

@RestController
@RequestMapping("/missing")
@CrossOrigin
public class MissingItemController {

    @PostMapping("/report")
    public String reportMissingItem(
            @RequestParam String student,
            @RequestParam String item,
            @RequestParam String location) {

        int id = MissingItemStore.counter.getAndIncrement();

        MissingItem complaint =
                new MissingItem(id, student, item, location);

        MissingItemStore.complaints.put(id, complaint);

        return "Missing item complaint registered with ID " + id;
    }

    @GetMapping("/all")
    public Collection<MissingItem> getAllComplaints() {
        return MissingItemStore.complaints.values();
    }

    @PostMapping("/resolve")
    public String resolveComplaint(@RequestParam int id) {
        MissingItem item = MissingItemStore.complaints.get(id);
        if (item != null) {
            item.setStatus("RESOLVED");
            return "Complaint resolved";
        }
        return "Complaint not found";
    }
}
