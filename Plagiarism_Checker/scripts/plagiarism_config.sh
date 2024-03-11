#!/bin/bash

# Define the path to the JSON file
JSON_FILE="profiles.json"

# Function to check if a file or directory exists
file_exists() {
    if [[ ! -e "$1" ]]; then
        echo "Error: The path $1 does not exist."
        exit 1
    fi
}

# Function to create a new profile
create_profile() {
    profile_name=$1
    algorithm_filepath=$2
    assignment_directory=$3
    output_directory=$4
    has_individual_output=$5
    previous_submission_directories=$6
    other_arguments="${@:7}"

    # Check if the necessary paths exist
    file_exists "$algorithm_filepath"
    file_exists "$assignment_directory"
    if [[ ! -z "$output_directory" ]]; then
        file_exists "$output_directory"
    fi

    # Add profile to the JSON file
    jq --arg profile_name "$profile_name" \
       --arg algorithm_filepath "$algorithm_filepath" \
       --arg assignment_directory "$assignment_directory" \
       --arg output_directory "$output_directory" \
       --arg has_individual_output "$has_individual_output" \
       --arg previous_submission_directories "$previous_submission_directories" \
       --arg other_arguments "$other_arguments" \
       '.[$profile_name] = {"algorithm_filepath": $algorithm_filepath, "assignment_directory": $assignment_directory, "output_directory": $output_directory, "has_individual_output": $has_individual_output, "previous_submission_directories": ($previous_submission_directories | split(" ")), "other_arguments": ($other_arguments | split(" "))}' "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"

    echo "Profile $profile_name created."
}

# Function to update an existing profile
update_profile() {
    profile_name=$1

    # Check if profile exists
    if ! jq 'has("'$profile_name'")' "$JSON_FILE"; then
        echo "Error: Profile $profile_name does not exist."
        exit 1
    fi

    read -p "Enter new algorithm filepath: " algorithm_filepath
    read -p "Enter new assignment directory: " assignment_directory
    read -p "Enter new output directory: " output_directory
    read -p "Has individual output (true/false): " has_individual_output
    read -p "Enter previous submission directories (space-separated): " previous_submission_directories
    read -p "Enter other arguments (space-separated): " other_arguments

    # Update profile in the JSON file
    jq --arg profile_name "$profile_name" \
       --arg algorithm_filepath "$algorithm_filepath" \
       --arg assignment_directory "$assignment_directory" \
       --arg output_directory "$output_directory" \
       --arg has_individual_output "$has_individual_output" \
       --arg previous_submission_directories "$previous_submission_directories" \
       --arg other_arguments "$other_arguments" \
       '.[$profile_name] |= {"algorithm_filepath": $algorithm_filepath, "assignment_directory": $assignment_directory, "output_directory": $output_directory, "has_individual_output": $has_individual_output, "previous_submission_directories": ($previous_submission_directories | split(" ")), "other_arguments": ($other_arguments | split(" "))}' "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"

    echo "Profile $profile_name updated."
}

# Function to delete an existing profile
delete_profile() {
    profile_name=$1

    # Check if profile exists
    if ! jq 'has("'$profile_name'")' "$JSON_FILE"; then
        echo "Error: Profile $profile_name does not exist."
        exit 1
    fi

    # Delete profile from the JSON file
    jq 'del(."'$profile_name'")' "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"

    echo "Profile $profile_name deleted."
}

# Function to view profiles
view_profiles() {
    if [[ $1 == "-s" ]]; then
        profile_name=$2
        if ! jq 'has("'$profile_name'")' "$JSON_FILE"; then
            echo "Error: Profile $profile_name does not exist."
            exit 1
        fi
        jq '."'$profile_name'"' "$JSON_FILE"
    else
        jq '.' "$JSON_FILE"
    fi
}

# Main function to handle command-line arguments
main() {
    if [[ $1 == "-c" ]]; then
        if [[ $2 == "-p" ]]; then
            read -p "Enter profile name: " profile_name
            read -p "Enter algorithm filepath: " algorithm_filepath
            read -p "Enter assignment directory: " assignment_directory
            read -p "Enter output directory: " output_directory
            read -p "Has individual output (true/false): " has_individual_output
            read -p "Enter previous submission directories (space-separated): " previous_submission_directories
            read -p "Enter other arguments (space-separated): " other_arguments
            create_profile "$profile_name" "$algorithm_filepath" "$assignment_directory" "$output_directory" "$has_individual_output" "$previous_submission_directories" $other_arguments
        else
            create_profile $@
        fi
    elif [[ $1 == "-u" ]]; then
        if [[ $2 == "-p" ]]; then
            read -p "Enter profile name: " profile_name
            update_profile "$profile_name"
        else
            update_profile $2
        fi
    elif [[ $1 == "-d" ]]; then
        delete_profile $2
    elif [[ $1 == "-v" ]]; then
        view_profiles $@
    else
        echo "Invalid command. Use -c, -u, -d, or -v."
    fi
}

# Check if JSON file exists, if not create it
if [[ ! -f "$JSON_FILE" ]]; then
    echo "{}" > "$JSON_FILE"
fi

# Start the script
main $@
