#!/bin/bash

# Define the path to the JSON configuration file
CONFIG_FILE="/home/osboxes/Desktop/4000Y/4000Y/Plagiarism_Checker/scripts/profiles.json"

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
    assignment_directory=$2    
    output_directory=$(echo "$profile_config" | jq -r '.output_directory')
    previous_submission_directories=$(echo "$profile_config" | jq -r '.previous_submission_directories | join(" ")')
    other_arguments=$(echo "$profile_config" | jq -r '.other_arguments | join(" ")')

    # Check if algorithm file exists
    file_exists "$algorithm_filepath"

    # Create a temporary file for current submissions
    current_submissions_file=$(mktemp)
    # Find program files in the assignment directory and write to the temporary file
    find "$assignment_directory" -name '*.py' -exec echo {} \; > "$current_submissions_file"
    
    # Create a temporary file for previous submissions
    previous_submissions_file=$(mktemp)
    # Iterate over each previous submission directory and write program files to the temporary file
    for dir in $previous_submission_directories; do
        find "$dir" -name '*.py' -exec echo {} \; >> "$previous_submissions_file"
    done

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
