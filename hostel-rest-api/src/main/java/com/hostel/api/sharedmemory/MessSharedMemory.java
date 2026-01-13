package com.hostel.api.sharedmemory;

import java.time.DayOfWeek;
import java.util.*;

public class MessSharedMemory {

    public static class Feedback {
        public int good = 0;
        public int average = 0;
        public int poor = 0;
    }

    public static class DayMenu {
        public List<String> items;
        public Map<String, Feedback> itemFeedback = new HashMap<>();
        public Feedback overall = new Feedback();
    }

    // 👉 SHARED MEMORY (Singleton)
    private static final Map<DayOfWeek, DayMenu> WEEK_DATA = new EnumMap<>(DayOfWeek.class);

    static {
        initMenu();
    }

    private static void initMenu() {
        add(DayOfWeek.MONDAY, "Idli", "Sambar", "Rice", "Dal", "Chapati");
        add(DayOfWeek.TUESDAY, "Dosa", "Chutney", "Rice", "Rajma", "Chicken");
        add(DayOfWeek.WEDNESDAY, "Pongal", "Vada", "Rice", "Sambar", "Chapati");
        add(DayOfWeek.THURSDAY, "Poori", "Kurma", "Rice", "Dal Fry", "Paneer");
        add(DayOfWeek.FRIDAY, "Uttapam", "Chutney", "Rice", "Chole", "Paratha");
        add(DayOfWeek.SATURDAY, "Upma", "Kesari", "Veg Biryani", "Raita", "Sweet");
        add(DayOfWeek.SUNDAY, "Masala Dosa", "Chutney", "Fried Rice", "Manchurian", "Ice Cream");
    }

    private static void add(DayOfWeek day, String... items) {
        DayMenu menu = new DayMenu();
        menu.items = Arrays.asList(items);
        for (String item : items) {
            menu.itemFeedback.put(item, new Feedback());
        }
        WEEK_DATA.put(day, menu);
    }

    // 🟢 MUTEX SIMULATION
    public synchronized static DayMenu getTodayMenu() {
        return WEEK_DATA.get(DayOfWeek.from(java.time.LocalDate.now()));
    }

    public synchronized static void giveItemFeedback(String item, String type) {
        Feedback f = getTodayMenu().itemFeedback.get(item);
        update(f, type);
    }

    public synchronized static void giveOverallFeedback(String type) {
        update(getTodayMenu().overall, type);
    }

    private static void update(Feedback f, String type) {
        switch (type) {
            case "good": f.good++; break;
            case "average": f.average++; break;
            case "poor": f.poor++; break;
        }
    }
}
