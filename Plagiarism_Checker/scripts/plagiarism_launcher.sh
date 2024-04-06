#!/bin/bash

# Define the path to the JSON configuration file
CONFIG_FILE="profiles.json"

stringContain() { case $2 in *$1* ) return 0;; *) return 1;; esac ;}

# Function to check if a file or directory exists
file_exists() {
    if [[ ! -e "$1" ]]; then
        echo "Error: The path $1 does not exist."
        exit 1
    fi
}

# Function to run the plagiarism algorithm
run_plagiarism_check() {
    profile_name=$1

    # Load profile configuration from JSON
    if ! profile_config=$(jq -r '.["'$profile_name'"]' "$CONFIG_FILE"); then
        echo $profile_config
        echo $CONFIG_FILE
        echo "Error: Unable to load profile $profile_name."
        exit 1
    fi

    algorithm_filepath=$(echo "$profile_config" | jq -r '.algorithm_filepath')

    if [ -n "$2" ]; then
        # For testing purposes 
        assignment_directory=$2 
    else
        assignment_directory=$(echo "$profile_config" | jq -r '.assignment_directory')
    fi
   
    output_directory=$(echo "$profile_config" | jq -r '.output_directory')
    previous_submission_directories=$(echo "$profile_config" | jq -r '.previous_submission_directories | join(" ")')
    other_arguments=$(echo "$profile_config" | jq -r '.other_arguments | join(" ")')

    # Check if algorithm file exists
    file_exists "$algorithm_filepath"

    # Create a temporary file for current submissions
    current_submissions_file=$(mktemp)

    # Check if python or c++ detected
    python=false
    cpp=false

    submissions=$(find "$assignment_directory" -name '*.py' -o -name '*.cpp')
    
    if stringContain ".py" "$submissions"; then
        python=true
    fi
    if stringContain ".cpp" "$submissions"; then
        cpp=true
    fi

    # Find program files in the assignment directory and write to the temporary file
    if [[ "$python" == "true" ]]; then
        find "$assignment_directory" -name '*.py' -exec echo {} \; > "$current_submissions_file"
    elif [[ "$cpp" == "true" ]]; then
        find "$assignment_directory" -name '*.cpp' -exec echo {} \; > "$current_submissions_file"
    fi

    # Create a temporary file for previous submissions if necessary
    if [[ "$python" == "true" || "$cpp" == "true" ]]; then
        previous_submissions_file=$(mktemp)
        for dir in $previous_submission_directories; do
            if [[ "$python" == "true" ]]; then
                find "$dir" -name '*.py' -exec echo {} \; >> "$previous_submissions_file"
            elif [[ "$cpp" == "true" ]]; then
                find "$dir" -name '*.cpp' -exec echo {} \; >> "$previous_submissions_file"
            fi
        done
    fi
    
    # Run the plagiarism algorithm with the specified arguments
    python3 "$algorithm_filepath" "$current_submissions_file" "$previous_submissions_file" "$output_directory" $other_arguments

    # Clean up temporary files
    rm "$current_submissions_file"
    rm "$previous_submissions_file"

    # echo "Plagiarism check complete."
}

# Main function
main() {
    if [[ -z $1 ]]; then
        echo "Usage: $0 profile_name"
        exit 1
    fi

    run_plagiarism_check $1 $2
}

# Start the script
main $@
