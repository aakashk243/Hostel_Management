package com.hostel.api.laundry;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.atomic.AtomicInteger;

public class LaundryQueue {

    public static BlockingQueue<LaundryRequest> queue =
            new LinkedBlockingQueue<>();

    public static AtomicInteger counter = new AtomicInteger(1);
}
