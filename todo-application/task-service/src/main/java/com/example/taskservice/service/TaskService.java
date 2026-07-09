package com.example.taskservice.service;

import com.example.taskservice.dto.TaskRequest;
import com.example.taskservice.dto.TaskResponse;
import com.example.taskservice.entity.Task;
import com.example.taskservice.entity.TaskStatus;
import com.example.taskservice.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream().map(this::toResponse).toList();
    }

    public TaskResponse getTaskById(Long id) {
        return taskRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        TaskStatus status = resolveStatus(request);
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .completed(status == TaskStatus.COMPLETED)
                .status(status)
                .build();
        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));

        TaskStatus status = resolveStatus(request);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCompleted(status == TaskStatus.COMPLETED);
        task.setStatus(status);

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new EntityNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    private TaskResponse toResponse(Task task) {
        TaskStatus status = task.getStatus() != null
                ? task.getStatus()
                : (task.isCompleted() ? TaskStatus.COMPLETED : TaskStatus.PENDING);

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .completed(task.isCompleted())
                .status(status)
                .build();
    }

    private TaskStatus resolveStatus(TaskRequest request) {
        if (request.getStatus() != null) {
            return request.getStatus();
        }
        return request.isCompleted() ? TaskStatus.COMPLETED : TaskStatus.PENDING;
    }
}
