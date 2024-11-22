package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/denisenkom/go-mssqldb" // SQL Server driver
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"time"
)

// Task struct (Model)
type Task struct {
	TaskID              int    `json:"taskID"`
	TaskSlug            string `json:"taskSlug"`
	TaskName            string `json:"taskName"`
	TaskDescription     string `json:"taskDescription"`
	TaskPriorityID      int    `json:"taskPriorityID"`
	TaskStatusID        int    `json:"taskStatusID"`
	TaskOwnerUserID     int    `json:"taskOwnerUserID"`
	TaskStartDate       string `json:"taskStartDate"`
	TaskEndDate         string `json:"taskEndDate"`
	TaskCreationDate    string `json:"taskCreationDate"`
	TaskLastUpdateDate  string `json:"taskLastUpdateDate"`
	TaskUpdatedByUserID string `json:"taskUpdatedByUserID"`
	TaskActiveStatus    string `json:"taskActiveStatus"`
	TaskCompletedDate   string `json:"taskCompletedDate"`
}

type Status struct {
	StatusID              int    `json:"statusID"`
	StatusSlug            string `json:"statusSlug"`
	StatusName            string `json:"statusName"`
	StatusDescription     string `json:"statusDescription"`
	StatusCreationDate    string `json:"statusCreationDate"`
	StatusLastUpdateDate  string `json:"statusLastUpdateDate"`
	StatusUpdatedByUserID int    `json:"statusUpdatedByUserID"`
	StatusActiveStatus    bool   `json:"statusActiveStatus"`
	StatusCreatedByUserID int    `json:"statusCreatedByUserID"`
}

type Priority struct {
	PriorityID              int    `json:"priorityID"`
	PrioritySlug            string `json:"prioritySlug"`
	PriorityName            string `json:"priorityName"`
	PriorityLevel           int    `json:"priorityLevel"`
	PriorityDescription     string `json:"priorityDescription"`
	PriorityCreationDate    string `json:"priorityCreationDate"`
	PriorityLastUpdateDate  string `json:"priorityLastUpdateDate"`
	PriorityUpdatedByUserID int    `json:"priorityUpdatedByUserID"`
	PriorityActiveStatus    bool   `json:"priorityActiveStatus"`
	PriorityCreatedByUserID int    `json:"priorityCreatedByUserID"`
}

type TaskAssignment struct {
	TaskAssignmentAssignmentID       int        `json:"taskAssignmentAssignmentID"`
	TaskAssignmentTaskID             int        `json:"taskAssignmentTaskID"`
	TaskAssignmentAssignerUserID     int        `json:"taskAssignmentAssignerUserID"`
	TaskAssignmentAssignerName       string     `json:"taskAssignmentAssignerName"`
	TaskAssignmentAssigneeUserID     int        `json:"taskAssignmentAssigneeUserID"`
	TaskAssignmentAssigneeName       string     `json:"taskAssignmentAssigneeName"`
	TaskAssignmentAssignedAt         time.Time  `json:"taskAssignmentAssignedAt"`
	TaskAssignmentCreationDate       time.Time  `json:"taskAssignmentCreationDate"`
	TaskAssignmentLastUpdateDate     *time.Time `json:"taskAssignmentLastUpdateDate"`
	TaskAssignmentUpdatedByUserID    *int       `json:"taskAssignmentUpdatedByUserID"`
	TaskAssignmentTaskName           string     `json:"taskAssignmentTaskName"`
	TaskAssignmentTaskDescription    string     `json:"taskAssignmentTaskDescription"`
	TaskAssignmentAssignerFullName   string     `json:"taskAssignmentAssignerFullName"`
	TaskAssignmentAssigneeFullName   string     `json:"taskAssignmentAssigneeFullName"`
	TaskAssignmentTaskSlug           string     `json:"taskAssignmentTaskSlug"`
	TaskAssignmentTaskStartDate      *time.Time `json:"taskAssignmentTaskStartDate"`
	TaskAssignmentTaskEndDate        *time.Time `json:"taskAssignmentTaskEndDate"`
	TaskAssignmentTaskCompletedDate  *time.Time `json:"taskAssignmentTaskCompletedDate"`
	TaskAssignmentTaskLastUpdateDate *time.Time `json:"taskAssignmentTaskLastUpdateDate"`
	TaskAssignmentTaskCreationDate   time.Time  `json:"taskAssignmentTaskCreationDate"`
	TaskAssignmentTaskActiveStatus   bool       `json:"taskAssignmentTaskActiveStatus"`
	TaskAssignmentStatusName         string     `json:"taskAssignmentStatusName"`
	TaskAssignmentPriorityName       string     `json:"taskAssignmentPriorityName"`
	TaskAssignmentTaskStatusID       int        `json:"taskAssignmentTaskStatusID"`
	TaskAssignmentTaskPriorityID     int        `json:"taskAssignmentTaskPriorityID"`
}

var db *sql.DB

func connectDB() {
	var err error
	connStr := "server=KIRKPC\\SALEMSERVER;user id=kirk;password=Huestint4;database=dbTaskTribe"
	db, err = sql.Open("sqlserver", connStr)
	if err != nil {
		log.Fatal("Error connecting to the database: ", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Could not ping the database: ", err)
	}

	fmt.Println("Connected to SQL Server!")
}

func createTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var task Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Execute stored procedure to create a new task
	var newID int
	err := db.QueryRow("EXEC AddTask @taskSlug, @taskName, @taskDescription, @taskPriorityID, @taskStatusID, @taskOwnerUserID, @taskStartDate, @taskEndDate",
		sql.Named("taskSlug", task.TaskSlug),
		sql.Named("taskName", task.TaskName),
		sql.Named("taskDescription", task.TaskDescription),
		sql.Named("taskPriorityID", task.TaskPriorityID),
		sql.Named("taskStatusID", task.TaskStatusID),
		sql.Named("taskOwnerUserID", task.TaskOwnerUserID),
		sql.Named("taskStartDate", task.TaskStartDate),
		sql.Named("taskEndDate", task.TaskEndDate),
	).Scan(&newID)

	if err != nil {
		http.Error(w, "Error creating task: "+err.Error(), http.StatusInternalServerError)
		return
	}

	task.TaskID = newID
	if err := json.NewEncoder(w).Encode(task); err != nil {
		writeError(w, "Error creating task: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.Query("EXEC GetTasks")
	if err != nil {
		http.Error(w, "Error fetching tasks: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var task Task
		if err := rows.Scan(
			&task.TaskID,
			&task.TaskSlug,
			&task.TaskName,
			&task.TaskDescription,
			&task.TaskPriorityID,
			&task.TaskStatusID,
			&task.TaskOwnerUserID,
			&task.TaskStartDate,
			&task.TaskEndDate,
			&task.TaskCreationDate,
			&task.TaskLastUpdateDate,
			&task.TaskActiveStatus,
			&task.TaskCompletedDate,
			&task.TaskUpdatedByUserID,
		); err != nil {
			http.Error(w, "Error scanning task: "+err.Error(), http.StatusInternalServerError)
			return
		}
		tasks = append(tasks, task)
	}

	if err := json.NewEncoder(w).Encode(tasks); err != nil {
		http.Error(w, "Error encoding response: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func getStatuses(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.Query("EXEC GetStatuses")
	if err != nil {
		http.Error(w, "Error fetching tasks: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var statuses []Status
	for rows.Next() {
		var status Status
		if err := rows.Scan(
			&status.StatusID,
			&status.StatusSlug,
			&status.StatusName,
			&status.StatusDescription,
			&status.StatusCreationDate,
			&status.StatusLastUpdateDate,
			&status.StatusUpdatedByUserID,
			&status.StatusCreatedByUserID,
		); err != nil {
			http.Error(w, "Error scanning status: "+err.Error(), http.StatusInternalServerError)
			return
		}
		statuses = append(statuses, status)
	}
	if err := json.NewEncoder(w).Encode(statuses); err != nil {
		http.Error(w, "Error encoding response: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func getPriorities(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.Query("EXEC GetPriorities")
	if err != nil {
		http.Error(w, "Error fetching priorities: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var priorities []Priority
	for rows.Next() {
		var priority Priority
		if err := rows.Scan(
			&priority.PriorityID,
			&priority.PrioritySlug,
			&priority.PriorityName,
			&priority.PriorityLevel,
			&priority.PriorityDescription,
			&priority.PriorityCreationDate,
			&priority.PriorityLastUpdateDate,
			&priority.PriorityUpdatedByUserID,
			&priority.PriorityCreatedByUserID,
		); err != nil {
			http.Error(w, "Error scanning priority: "+err.Error(), http.StatusInternalServerError)
			return
		}
		priorities = append(priorities, priority)
	}
	if err := json.NewEncoder(w).Encode(priorities); err != nil {
		http.Error(w, "Error encoding response: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func writeError(w http.ResponseWriter, msg string, code int) {
	w.WriteHeader(code)
	err := json.NewEncoder(w).Encode(map[string]string{"error": msg})
	if err != nil {
		return
	}
}

func getTaskAssignments(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Execute the stored procedure
	rows, err := db.Query("EXEC GetTaskAssignmentDetails")
	if err != nil {
		http.Error(w, "Error fetching task assignments: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var taskAssignments []TaskAssignment

	// Iterate over the result rows
	for rows.Next() {
		var taskAssignment TaskAssignment

		// Scan the row data into the struct fields
		err := rows.Scan(
			&taskAssignment.TaskAssignmentAssignmentID,
			&taskAssignment.TaskAssignmentTaskID,
			&taskAssignment.TaskAssignmentAssignerUserID,
			&taskAssignment.TaskAssignmentAssignerName,
			&taskAssignment.TaskAssignmentAssigneeUserID,
			&taskAssignment.TaskAssignmentAssigneeName,
			&taskAssignment.TaskAssignmentAssignedAt,
			&taskAssignment.TaskAssignmentCreationDate,
			&taskAssignment.TaskAssignmentLastUpdateDate,
			&taskAssignment.TaskAssignmentUpdatedByUserID,
			&taskAssignment.TaskAssignmentTaskName,
			&taskAssignment.TaskAssignmentTaskDescription,
			&taskAssignment.TaskAssignmentAssignerFullName,
			&taskAssignment.TaskAssignmentAssigneeFullName,
			&taskAssignment.TaskAssignmentTaskSlug,
			&taskAssignment.TaskAssignmentTaskStartDate,
			&taskAssignment.TaskAssignmentTaskEndDate,
			&taskAssignment.TaskAssignmentTaskCompletedDate,
			&taskAssignment.TaskAssignmentTaskLastUpdateDate,
			&taskAssignment.TaskAssignmentTaskCreationDate,
			&taskAssignment.TaskAssignmentTaskActiveStatus,
			&taskAssignment.TaskAssignmentStatusName,
			&taskAssignment.TaskAssignmentPriorityName,
			&taskAssignment.TaskAssignmentTaskStatusID,
			&taskAssignment.TaskAssignmentTaskPriorityID,
		)

		if err != nil {
			http.Error(w, "Error scanning task assignments: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Append to the result slice
		taskAssignments = append(taskAssignments, taskAssignment)
	}

	// Return the result as JSON
	if err := json.NewEncoder(w).Encode(taskAssignments); err != nil {
		http.Error(w, "Error encoding task assignments: "+err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	// Initialize router
	r := mux.NewRouter()

	// Connect to SQL Server
	connectDB()

	// API routes
	r.HandleFunc("/api/tasks", getTasks).Methods("GET")
	r.HandleFunc("/api/tasks", createTask).Methods("POST")
	r.HandleFunc("/api/statuses", getStatuses).Methods("GET")
	r.HandleFunc("/api/priorities", getPriorities).Methods("GET")
	r.HandleFunc("/api/taskAssignments", getTaskAssignments).Methods("GET")

	// Start the server
	log.Fatal(http.ListenAndServe(":8000", r))
}
