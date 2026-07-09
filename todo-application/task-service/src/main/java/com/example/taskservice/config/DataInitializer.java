package com.example.taskservice.config;

import com.example.taskservice.entity.Task;
import com.example.taskservice.entity.TaskStatus;
import com.example.taskservice.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    private final TaskRepository taskRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (taskRepository.count() == 0) {
                taskRepository.save(
                        Task.builder()
                                .title("Buy milk")
                                .description("Pick up milk and eggs")
                                .completed(false)
                                .status(TaskStatus.PENDING)
                                .build());
                taskRepository.save(Task.builder().title("Write report").description("Finish the weekly report")
                        .completed(true)
                        .status(TaskStatus.COMPLETED)
                        .build());
                taskRepository.save(Task.builder().title("Call dentist").description("Schedule an appointment")
                        .completed(false)
                        .status(TaskStatus.PENDING)
                        .build());
            }
        };
    }
}
