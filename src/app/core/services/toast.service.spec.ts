import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success message', () => {
    service.showSuccess('Success!', 'Operation completed successfully');
    
    service.messages$.subscribe(messages => {
      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('success');
      expect(messages[0].summary).toBe('Success!');
      expect(messages[0].detail).toBe('Operation completed successfully');
    });
  });

  it('should show error message', () => {
    service.showError('Error!', 'Something went wrong');
    
    service.messages$.subscribe(messages => {
      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].summary).toBe('Error!');
      expect(messages[0].detail).toBe('Something went wrong');
    });
  });

  it('should show info message', () => {
    service.showInfo('Info', 'Here is some information');
    
    service.messages$.subscribe(messages => {
      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('info');
      expect(messages[0].summary).toBe('Info');
      expect(messages[0].detail).toBe('Here is some information');
    });
  });

  it('should show warning message', () => {
    service.showWarning('Warning!', 'Please be careful');
    
    service.messages$.subscribe(messages => {
      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('warn');
      expect(messages[0].summary).toBe('Warning!');
      expect(messages[0].detail).toBe('Please be careful');
    });
  });

  it('should remove specific message', () => {
    service.showSuccess('Message 1');
    service.showError('Message 2');
    
    let messageCount = 0;
    service.messages$.subscribe(messages => {
      messageCount++;
      if (messageCount === 1) {
        // Initial state with 2 messages
        expect(messages.length).toBe(2);
        const messageId = messages[0].id;
        service.removeMessage(messageId);
      } else if (messageCount === 2) {
        // After removal, should have 1 message
        expect(messages.length).toBe(1);
        expect(messages[0].summary).toBe('Message 2');
      }
    });
  });

  it('should clear all messages', () => {
    service.showSuccess('Message 1');
    service.showError('Message 2');
    service.showInfo('Message 3');
    
    let messageCount = 0;
    service.messages$.subscribe(messages => {
      messageCount++;
      if (messageCount === 1) {
        // Initial state with 3 messages
        expect(messages.length).toBe(3);
        service.clearAll();
      } else if (messageCount === 2) {
        // After clearing, should have 0 messages
        expect(messages.length).toBe(0);
      }
    });
  });

  it('should auto-remove message after lifetime', (done) => {
    service.showSuccess('Auto-remove message', '', 100); // 100ms lifetime
    
    service.messages$.subscribe(messages => {
      if (messages.length === 1) {
        // Message is present
        setTimeout(() => {
          service.messages$.subscribe(updatedMessages => {
            expect(updatedMessages.length).toBe(0);
            done();
          });
        }, 150); // Wait longer than lifetime
      }
    });
  });

  it('should generate unique message IDs', () => {
    service.showSuccess('Message 1');
    service.showSuccess('Message 2');
    
    service.messages$.subscribe(messages => {
      expect(messages[0].id).not.toBe(messages[1].id);
    });
  });

  it('should use default lifetime when not specified', () => {
    service.showSuccess('Default lifetime message');
    
    service.messages$.subscribe(messages => {
      expect(messages[0].life).toBe(3000); // Default success lifetime
    });
  });

  it('should use custom lifetime when specified', () => {
    service.showError('Custom lifetime message', '', 5000);
    
    service.messages$.subscribe(messages => {
      expect(messages[0].life).toBe(5000);
    });
  });
});

