package com.example.taskservice.service;

import com.example.taskservice.dto.TaskRequest;
import com.example.taskservice.dto.TaskResponse;
import com.example.taskservice.entity.Task;
import com.example.taskservice.entity.TaskStatus;
import com.example.taskservice.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void getAllTasks_ShouldReturnMappedResponses_WhenTasksExist() {
        Task completedTask = Task.builder()
                .id(1L)
                .title("Done")
                .description("Completed task")
                .completed(true)
                .status(null)
                .build();
        Task pendingTask = Task.builder()
                .id(2L)
                .title("Pending")
                .description("Pending task")
                .completed(false)
                .status(TaskStatus.PENDING)
                .build();
        when(taskRepository.findAll()).thenReturn(List.of(completedTask, pendingTask));

        List<TaskResponse> responses = taskService.getAllTasks();

        assertThat(responses).hasSize(2);
        assertThat(responses)
                .extracting(TaskResponse::getStatus)
                .containsExactlyInAnyOrder(TaskStatus.COMPLETED, TaskStatus.PENDING);
    }

    @Test
    void getTaskById_ShouldReturnTask_WhenTaskExists() {
        Task task = Task.builder()
                .id(10L)
                .title("Task")
                .description("Details")
                .completed(false)
                .status(TaskStatus.PENDING)
                .build();
        when(taskRepository.findById(10L)).thenReturn(Optional.of(task));

        TaskResponse response = taskService.getTaskById(10L);

        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getTitle()).isEqualTo("Task");
        assertThat(response.getStatus()).isEqualTo(TaskStatus.PENDING);
    }

    @Test
    void getTaskById_ShouldThrowEntityNotFoundException_WhenTaskDoesNotExist() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Task not found with id: 99");
    }

    @Test
    void createTask_ShouldUseExplicitStatus_WhenStatusProvided() {
        TaskRequest request = TaskRequest.builder()
                .title("Task")
                .description("Desc")
                .completed(true)
                .status(TaskStatus.PENDING)
                .build();
        Task savedTask = Task.builder()
                .id(20L)
                .title("Task")
                .description("Desc")
                .completed(false)
                .status(TaskStatus.PENDING)
                .build();
        when(taskRepository.save(org.mockito.ArgumentMatchers.any(Task.class))).thenReturn(savedTask);

        TaskResponse response = taskService.createTask(request);

        assertThat(response.getId()).isEqualTo(20L);
        assertThat(response.isCompleted()).isFalse();
        assertThat(response.getStatus()).isEqualTo(TaskStatus.PENDING);
    }

    @Test
    void createTask_ShouldResolveStatusFromCompletedFlag_WhenStatusMissing() {
        TaskRequest request = TaskRequest.builder()
                .title("Task")
                .description("Desc")
                .completed(true)
                .status(null)
                .build();
        Task savedTask = Task.builder()
                .id(21L)
                .title("Task")
                .description("Desc")
                .completed(true)
                .status(TaskStatus.COMPLETED)
                .build();
        when(taskRepository.save(org.mockito.ArgumentMatchers.any(Task.class))).thenReturn(savedTask);

        TaskResponse response = taskService.createTask(request);

        assertThat(response.isCompleted()).isTrue();
        assertThat(response.getStatus()).isEqualTo(TaskStatus.COMPLETED);
    }

    @Test
    void createTask_ShouldThrowNullPointerException_WhenRequestIsNull() {
        assertThatThrownBy(() -> taskService.createTask(null))
                .isInstanceOf(NullPointerException.class);
    }

    @Test
    void updateTask_ShouldUpdateTask_WhenTaskExists() {
        Task existingTask = Task.builder()
                .id(30L)
                .title("Old")
                .description("Old desc")
                .completed(false)
                .status(TaskStatus.PENDING)
                .build();
        TaskRequest request = TaskRequest.builder()
                .title("New")
                .description("New desc")
                .completed(true)
                .status(TaskStatus.COMPLETED)
                .build();
        when(taskRepository.findById(30L)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(existingTask)).thenReturn(existingTask);

        TaskResponse response = taskService.updateTask(30L, request);

        assertThat(existingTask.getTitle()).isEqualTo("New");
        assertThat(existingTask.getDescription()).isEqualTo("New desc");
        assertThat(existingTask.isCompleted()).isTrue();
        assertThat(existingTask.getStatus()).isEqualTo(TaskStatus.COMPLETED);
        assertThat(response.getStatus()).isEqualTo(TaskStatus.COMPLETED);
    }

    @Test
    void updateTask_ShouldThrowEntityNotFoundException_WhenTaskDoesNotExist() {
        TaskRequest request = TaskRequest.builder()
                .title("New")
                .description("Desc")
                .build();
        when(taskRepository.findById(44L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTask(44L, request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Task not found with id: 44");
    }

    @Test
    void deleteTask_ShouldDeleteTask_WhenTaskExists() {
        when(taskRepository.existsById(50L)).thenReturn(true);

        taskService.deleteTask(50L);

        verify(taskRepository).deleteById(50L);
    }

    @Test
    void deleteTask_ShouldThrowEntityNotFoundException_WhenTaskDoesNotExist() {
        when(taskRepository.existsById(51L)).thenReturn(false);

        assertThatThrownBy(() -> taskService.deleteTask(51L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Task not found with id: 51");
    }
}
