#!/bin/bash

# Todo List API Test Script
# This script helps you test the API endpoints with automatic token management

BASE_URL="http://localhost:3000"
TOKEN_FILE=".auth_token"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[HEADER]${NC} $1"
}

# Function to save token
save_token() {
    echo "$1" > "$TOKEN_FILE"
    print_status "Token saved to $TOKEN_FILE"
}

# Function to get token
get_token() {
    if [ -f "$TOKEN_FILE" ]; then
        cat "$TOKEN_FILE"
    else
        echo ""
    fi
}

# Function to check if server is running
check_server() {
    if curl -s "$BASE_URL/health" > /dev/null; then
        print_status "Server is running at $BASE_URL"
        return 0
    else
        print_error "Server is not running at $BASE_URL"
        print_warning "Please start the server with: npm start"
        return 1
    fi
}

# Function to register user
register_user() {
    local username=${1:-"testuser"}
    local email=${2:-"test@example.com"}
    local password=${3:-"password123"}
    
    print_header "Registering user: $username"
    
    response=$(curl -s -X POST "$BASE_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"username\": \"$username\",
            \"email\": \"$email\",
            \"password\": \"$password\"
        }")
    
    echo "$response" | jq '.'
    
    # Extract and save token
    token=$(echo "$response" | jq -r '.token // empty')
    if [ ! -z "$token" ] && [ "$token" != "null" ]; then
        save_token "$token"
        print_status "User registered and token saved!"
    fi
}

# Function to login user
login_user() {
    local email=${1:-"test@example.com"}
    local password=${2:-"password123"}
    
    print_header "Logging in user: $email"
    
    response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$email\",
            \"password\": \"$password\"
        }")
    
    echo "$response" | jq '.'
    
    # Extract and save token
    token=$(echo "$response" | jq -r '.token // empty')
    if [ ! -z "$token" ] && [ "$token" != "null" ]; then
        save_token "$token"
        print_status "Login successful and token saved!"
    fi
}

# Function to get user profile
get_profile() {
    local token=$(get_token)
    
    if [ -z "$token" ]; then
        print_error "No token found. Please login first."
        return 1
    fi
    
    print_header "Getting user profile"
    
    response=$(curl -s -X GET "$BASE_URL/api/auth/profile" \
        -H "Authorization: Bearer $token")
    
    echo "$response" | jq '.'
}

# Function to create a list
create_list() {
    local token=$(get_token)
    local title=${1:-"My Test List"}
    local description=${2:-"A test list created via script"}
    
    if [ -z "$token" ]; then
        print_error "No token found. Please login first."
        return 1
    fi
    
    print_header "Creating list: $title"
    
    response=$(curl -s -X POST "$BASE_URL/api/lists" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{
            \"title\": \"$title\",
            \"description\": \"$description\"
        }")
    
    echo "$response" | jq '.'
}

# Function to get all lists
get_lists() {
    local token=$(get_token)
    
    if [ -z "$token" ]; then
        print_error "No token found. Please login first."
        return 1
    fi
    
    print_header "Getting all lists"
    
    response=$(curl -s -X GET "$BASE_URL/api/lists" \
        -H "Authorization: Bearer $token")
    
    echo "$response" | jq '.'
}

# Function to create a task
create_task() {
    local token=$(get_token)
    local list_id=${1:-1}
    local title=${2:-"Test Task"}
    local description=${3:-"A test task created via script"}
    local priority=${4:-"medium"}
    
    if [ -z "$token" ]; then
        print_error "No token found. Please login first."
        return 1
    fi
    
    print_header "Creating task: $title in list $list_id"
    
    response=$(curl -s -X POST "$BASE_URL/api/tasks" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{
            \"listId\": $list_id,
            \"title\": \"$title\",
            \"description\": \"$description\",
            \"priority\": \"$priority\"
        }")
    
    echo "$response" | jq '.'
}

# Function to get tasks by list
get_tasks() {
    local token=$(get_token)
    local list_id=${1:-1}
    
    if [ -z "$token" ]; then
        print_error "No token found. Please login first."
        return 1
    fi
    
    print_header "Getting tasks for list $list_id"
    
    response=$(curl -s -X GET "$BASE_URL/api/tasks/list/$list_id" \
        -H "Authorization: Bearer $token")
    
    echo "$response" | jq '.'
}

# Function to run full test flow
run_full_test() {
    print_header "Running full API test flow"
    
    if ! check_server; then
        return 1
    fi
    
    # Register user
    register_user "testuser" "test@example.com" "password123"
    echo ""
    
    # Login user
    login_user "test@example.com" "password123"
    echo ""
    
    # Get profile
    get_profile
    echo ""
    
    # Create list
    create_list "Work Tasks" "Tasks for work projects"
    echo ""
    
    # Get lists
    get_lists
    echo ""
    
    # Create task
    create_task 1 "Complete API documentation" "Write comprehensive docs" "high"
    echo ""
    
    # Get tasks
    get_tasks 1
    echo ""
    
    print_status "Full test completed!"
}

# Function to show help
show_help() {
    echo "Todo List API Test Script"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  check           - Check if server is running"
    echo "  register        - Register a new user"
    echo "  login           - Login user"
    echo "  profile         - Get user profile"
    echo "  create-list     - Create a new list"
    echo "  get-lists       - Get all lists"
    echo "  create-task     - Create a new task"
    echo "  get-tasks       - Get tasks by list ID"
    echo "  test            - Run full test flow"
    echo "  help            - Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 test                    # Run full test"
    echo "  $0 register john john@test.com pass123"
    echo "  $0 login john@test.com pass123"
    echo "  $0 create-list \"My List\" \"Description\""
    echo "  $0 create-task 1 \"My Task\" \"Description\" high"
}

# Main script logic
case "${1:-help}" in
    "check")
        check_server
        ;;
    "register")
        register_user "$2" "$3" "$4"
        ;;
    "login")
        login_user "$2" "$3"
        ;;
    "profile")
        get_profile
        ;;
    "create-list")
        create_list "$2" "$3"
        ;;
    "get-lists")
        get_lists
        ;;
    "create-task")
        create_task "$2" "$3" "$4" "$5"
        ;;
    "get-tasks")
        get_tasks "$2"
        ;;
    "test")
        run_full_test
        ;;
    "help"|*)
        show_help
        ;;
esac 