# MegaBank CRM Project Proposal - Task Management

## Key Tasks / User Stories

### Task 1: Create tasks
- **Description**: Let a representative create a new task from the dashboard.

- **Technical Considerations**:
  - Add a "Create Task" action.
  - Support todo, meeting, and phone call task types.
  - Capture title, description, due date/time, priority, status, assignee(s), and optional contact.
  - Show extra fields by task type: location for meetings, phone/conference info for calls.

- **Follow-up Questions**:
  - Which fields are required for each task type?
  - Can reps create tasks for other reps?

---

### Task 2: Show and update tasks
- **Description**: Let a representative see active tasks, open a task, and edit it.

- **Technical Considerations**:
  - Add a current tasks section to the dashboard.
  - Hide archived tasks from the normal view.
  - Show the main details in the list: title, due date/time, priority, status, type, and primary assignee.
  - Clicking a task should open an edit view.

- **Follow-up Questions**:
  - Should completed tasks stay in the active list?
  - Should managers see their team's tasks?

---

### Task 3: Assign and link tasks
- **Description**: Let tasks be assigned to employees and optionally tied to a contact.

- **Technical Considerations**:
  - Pull assignees from the `users` table.
  - Only allow assignment to people in the representative's department.
  - Allow multiple assignees, but require one primary assignee.
  - If a contact is linked, show the contact name and a link to the contact page.

- **Follow-up Questions**:
  - Can managers assign tasks outside their department?
  - Can one task be linked to more than one contact?

---

### Task 4: Store and archive tasks
- **Description**: Add the backend support to save, list, edit, and archive tasks.

- **Technical Considerations**:
  - Add a task model/table with common fields, task type, status, priority, due date/time, and archive state.
  - Store assignees, primary assignee, creator, department, and optional contact.
  - Add create, update, list active, list archived, and archive endpoints.
  - Check permissions by department and role.

- **Follow-up Questions**:
  - Can archived tasks be restored?
  - Do task changes need an audit log?