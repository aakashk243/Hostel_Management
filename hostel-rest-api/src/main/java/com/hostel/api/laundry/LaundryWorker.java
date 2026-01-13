package com.hostel.api.laundry;


public class LaundryWorker implements Runnable {

    private final String workerName;

    public LaundryWorker(String workerName) {
        this.workerName = workerName;
    }

    @Override
    public void run() {
        try {
            while (true) {
                LaundryRequest request = LaundryQueue.queue.take(); // MUTEX
                request.setStatus("PROCESSING");

                System.out.println("🧺 " + workerName +
                        " washing request " + request.getId());

                Thread.sleep(3000); // washing time

                request.setStatus("COMPLETED");
                System.out.println("✅ " + workerName +
                        " completed request " + request.getId());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
