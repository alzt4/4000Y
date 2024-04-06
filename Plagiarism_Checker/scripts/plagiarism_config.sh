#!/bin/bash

# Define the path to the JSON file 
JSON_FILE="profiles.json"

# Function to create a new profile
create_profile() {
    profile_name=$2
    algorithm_filepath=$3
    assignment_directory=$4
    output_directory=$5
    # Capture all remaining arguments as an array
    shift 5
    args=("$@")
    
    # Find the index of the ",," separator which separates previous directories and other arguments
    separator_index=-1
    for i in "${!args[@]}"; do
        if [[ "${args[$i]}" == ",," ]]; then
            separator_index=$i
            break
        fi
    done
    
    # Split the arguments into previous submission directories and other arguments
    if [[ $separator_index -ne -1 ]]; then
        previous_submission_directories=("${args[@]:0:separator_index}")
        other_arguments=("${args[@]:((separator_index + 1))}")
    else
        echo "Error: No separator ( ,, ) found between previous submission directories and other arguments."
        exit 1
    fi

    # Convert arrays to strings
    previous_submission_dirs_str="${previous_submission_directories[*]}"
    other_args_str="${other_arguments[*]}"

    # Add profile to the JSON file
    jq --arg profile_name "$profile_name" \
       --arg algorithm_filepath "$algorithm_filepath" \
       --arg assignment_directory "$assignment_directory" \
       --arg output_directory "$output_directory" \
       --arg previous_submission_directories "$previous_submission_dirs_str" \
       --arg other_arguments "$other_args_str" \
       '.[$profile_name] = {"algorithm_filepath": $algorithm_filepath, "assignment_directory": $assignment_directory, "output_directory": $output_directory, "previous_submission_directories": ($previous_submission_directories | split(",")), "other_arguments": ($other_arguments | split(" "))}' "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"

    echo "Profile $profile_name created."
}


# Function to update an existing profile
update_profile() {

    if [[ $2 == "-p" ]]; then

        profile_name=$3

        # Check if profile exists
        current_config=$(jq ".$profile_name" "$JSON_FILE")
        if [ "$current_config" == "null" ] || [ -z "$3" ]; then
            echo "Error: Profile $profile_name does not exist."
            exit 1
        fi

        echo "Updating profile '$profile_name'. Return to keep the current value."
        current_algorithm_filepath=$(jq -r ".$profile_name.algorithm_filepath" "$JSON_FILE")
        read -p "Enter new algorithm filepath [$current_algorithm_filepath]: " algorithm_filepath
        algorithm_filepath=${algorithm_filepath:-$current_algorithm_filepath}

        current_assignment_directory=$(jq -r ".$profile_name.assignment_directory" "$JSON_FILE")
        read -p "Enter new assignment directory [$current_assignment_directory]: " assignment_directory
        assignment_directory=${assignment_directory:-$current_assignment_directory}

        current_output_directory=$(jq -r ".$profile_name.output_directory" "$JSON_FILE")
        read -p "Enter new output directory [$current_output_directory]: " output_directory
        output_directory=${output_directory:-$current_output_directory}

        current_previous_submission_directories=$(jq -r ".$profile_name.previous_submission_directories | join(\",\")" "$JSON_FILE")
        read -p "Enter previous submission directories (comma-separated) [$current_previous_submission_directories]: " previous_submission_directories
        previous_submission_directories=${previous_submission_directories:-$current_previous_submission_directories}

        current_other_arguments=$(jq -r ".$profile_name.other_arguments | join(\" \")" "$JSON_FILE")
        read -p "Enter other arguments (space-separated) [$current_other_arguments]: " other_arguments
        other_arguments=${other_arguments:-$current_other_arguments}

    else

        profile_name=$2

        # Check if profile exists
        current_config=$(jq ".$profile_name" "$JSON_FILE")
        if [ "$current_config" == "null" ]; then
            echo "Error: Profile $profile_name does not exist."
            exit 1
        fi

        algorithm_filepath=$3
        assignment_directory=$4
        output_directory=$5

        shift 5
        args=("$@")

        # Find the index of the ",," separator which separates previous directories and other arguments
        separator_index=-1
        for i in "${!args[@]}"; do
            if [[ "${args[$i]}" == ",," ]]; then
                separator_index=$i
                break
            fi
        done
    
        # Split the arguments into previous submission directories and other arguments
        if [[ $separator_index -ne -1 ]]; then
            previous_submission_directories=("${args[@]:0:separator_index}")
            other_arguments=("${args[@]:((separator_index + 1))}")
        else
            echo "Error: No separator ( ,, ) found between previous submission directories and other arguments."
            exit 1
        fi

        # Convert arrays to strings
        previous_submission_directories="${previous_submission_directories[*]}"
        other_arguments="${other_arguments[*]}"

    fi

    # Update profile in the JSON file
    jq --arg profile_name "$profile_name" \
       --arg algorithm_filepath "$algorithm_filepath" \
       --arg assignment_directory "$assignment_directory" \
       --arg output_directory "$output_directory" \
       --arg previous_submission_directories "$previous_submission_directories" \
       --arg other_arguments "$other_arguments" \
       '.[$profile_name] |= {algorithm_filepath: $algorithm_filepath, assignment_directory: $assignment_directory, output_directory: $output_directory, previous_submission_directories: ($previous_submission_directories | split(",")), other_arguments: ($other_arguments | split(" "))}' "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"

    echo "Profile $profile_name updated."
}



# Function to delete an existing profile
delete_profile() {
    profile_name=$1

    # Check if profile exists
    current_config=$(jq ".$profile_name" "$JSON_FILE")
    if [ "$current_config" == "null" ]; then
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
        # Check if profile exists
        current_config=$(jq ".$profile_name" "$JSON_FILE")
        if [ "$current_config" == "null" ]; then
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
            read -p "Enter previous submission directories (comma-separated): " previous_submission_directories
            read -p "Enter other arguments (space-separated): " other_arguments
            # -c is needed only to shift the arguments by one space (because of how create_profile() handles arguments)
            create_profile -c "$profile_name" "$algorithm_filepath" "$assignment_directory" "$output_directory" "$previous_submission_directories" ,, $other_arguments
        else
            create_profile $@
        fi
    elif [[ $1 == "-u" ]]; then
        update_profile $@
    elif [[ $1 == "-d" ]]; then
        delete_profile $2
    elif [[ $1 == "-v" ]]; then
        view_profiles $2 $3
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
