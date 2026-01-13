package com.hostel.api.missing;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class MissingItemStore {

    public static ConcurrentHashMap<Integer, MissingItem> complaints =
            new ConcurrentHashMap<>();

    public static AtomicInteger counter = new AtomicInteger(1);
}
