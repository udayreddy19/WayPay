package com.waypay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class WayPayApplication {

    public static void main(String[] args) {
        SpringApplication.run(WayPayApplication.class, args);
    }
}
