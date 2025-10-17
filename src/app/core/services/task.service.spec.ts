import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TaskService } from './task.service';
import { CreateTaskRequest, UpdateTaskRequest, Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with mock data', () => {
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks[0].title).toBe('Welcome to AtomChat');
    });
  });

  it('should create a task', () => {
    const createRequest: CreateTaskRequest = {
      title: 'New Task',
      description: 'New Description'
    };

    service.createTask(createRequest).subscribe(task => {
      expect(task.title).toBe('New Task');
      expect(task.description).toBe('New Description');
      expect(task.completed).toBe(false);
      expect(task.id).toBeDefined();
    });
  });

  it('should update a task', () => {
    // First create a task
    const createRequest: CreateTaskRequest = {
      title: 'Original Task',
      description: 'Original Description'
    };

    service.createTask(createRequest).subscribe(() => {
      const updateRequest: UpdateTaskRequest = {
        id: '1', // Assuming the created task gets id '1'
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true
      };

      service.updateTask(updateRequest).subscribe(updatedTask => {
        expect(updatedTask.title).toBe('Updated Task');
        expect(updatedTask.description).toBe('Updated Description');
        expect(updatedTask.completed).toBe(true);
      });
    });
  });

  it('should delete a task', () => {
    // First create a task
    const createRequest: CreateTaskRequest = {
      title: 'Task to Delete',
      description: 'This will be deleted'
    };

    service.createTask(createRequest).subscribe(() => {
      service.deleteTask('1').subscribe(() => {
        service.getTasks().subscribe(tasks => {
          const deletedTask = tasks.find(task => task.id === '1');
          expect(deletedTask).toBeUndefined();
        });
      });
    });
  });

  it('should toggle task completion', () => {
    // First create a task
    const createRequest: CreateTaskRequest = {
      title: 'Task to Toggle',
      description: 'This will be toggled'
    };

    service.createTask(createRequest).subscribe(() => {
      service.toggleTaskCompletion('1').subscribe(toggledTask => {
        expect(toggledTask.completed).toBe(true);
      });
    });
  });

  it('should handle errors when creating task', () => {
    // Mock localStorage to throw error
    spyOn(localStorage, 'setItem').and.throwError('Storage error');

    const createRequest: CreateTaskRequest = {
      title: 'Failing Task',
      description: 'This will fail'
    };

    service.createTask(createRequest).subscribe({
      next: () => fail('Should have thrown error'),
      error: (error) => {
        expect(error).toBeDefined();
      }
    });
  });

  it('should return loading state', () => {
    service.getIsLoading().subscribe(isLoading => {
      expect(typeof isLoading).toBe('boolean');
    });
  });

  it('should return error state', () => {
    service.getError().subscribe(error => {
      expect(error).toBeNull(); // Initially no error
    });
  });

  it('should persist tasks to localStorage', () => {
    const createRequest: CreateTaskRequest = {
      title: 'Persistent Task',
      description: 'This should persist'
    };

    service.createTask(createRequest).subscribe(() => {
      const storedTasks = localStorage.getItem('atomchat_tasks');
      expect(storedTasks).toBeTruthy();
      
      const parsedTasks = JSON.parse(storedTasks!);
      expect(parsedTasks.length).toBeGreaterThan(0);
    });
  });

  it('should load tasks from localStorage on initialization', () => {
    const mockStoredTasks = [mockTask];
    localStorage.setItem('atomchat_tasks', JSON.stringify(mockStoredTasks));

    // Create new service instance to test initialization
    const newService = new TaskService();
    
    newService.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Test Task');
    });
  });
});

