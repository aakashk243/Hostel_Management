package com.hostel.api.laundry;


public class StudentProducer implements Runnable {

    private final String studentName;
    private final int clothes;

    public StudentProducer(String studentName, int clothes) {
        this.studentName = studentName;
        this.clothes = clothes;
    }

    @Override
    public void run() {
        try {
            int id = LaundryQueue.counter.getAndIncrement();
            LaundryRequest request =
                    new LaundryRequest(id, studentName, clothes);

            LaundryQueue.queue.put(request);

            System.out.println("🧑‍🎓 Laundry Requested: " + id
                    + " by " + studentName);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
