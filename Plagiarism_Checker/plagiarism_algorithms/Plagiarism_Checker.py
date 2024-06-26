import os
import csv
import difflib
import argparse
import json
import base64

# Function to read file paths from a given text file
def read_file_paths(file_path):
    with open(file_path, 'r') as file:
        return [line.strip() for line in file]

# Function to read the contents of files from a list of file paths
def read_files_from_file_paths(file_paths):
    file_contents = {}
    for file_path in file_paths:
        with open(file_path, 'r') as file:
            file_contents[file_path] = file.read()
    return file_contents

# Function to compare two files and return their similarity ratio
def compare_files(file1_content, file2_content):
    similarity = difflib.SequenceMatcher(None, file1_content, file2_content).ratio()
    return similarity

# Main function to detect plagiarism
def detect_plagiarism(student_file_paths, previous_file_paths, threshold):
    student_files = read_files_from_file_paths(student_file_paths)
    previous_files = read_files_from_file_paths(previous_file_paths)

    # Used for csv output
    #plagiarism_cases = []
    plagiarism_cases = {}

    # Comparing each student file with every previous submission
    for student_path, student_content in student_files.items():
        for previous_path, previous_content in previous_files.items():
            if student_path != previous_path:
                similarity = compare_files(student_content, previous_content)
                if similarity >= threshold:

                    # Used for csv output
                    #plagiarism_cases.append((student_path, similarity, previous_path))

                    plagiarism_cases[student_path] = {
                        "similarity_percentage": f"{similarity*100:.2f}%",
                        "plagiarised_file_path": previous_path
                    }

    # Comparing student files with each other
    for i, (student_path1, student_content1) in enumerate(student_files.items()):
        for student_path2, student_content2 in list(student_files.items())[i+1:]:
            similarity = compare_files(student_content1, student_content2)
            if similarity >= threshold:

                # Used for csv output
                #plagiarism_cases.append((student_path1, similarity, student_path2))

                plagiarism_cases[student_path1] = {
                    "similarity_percentage": f"{similarity*100:.2f}%",
                    "plagiarised_file_path": student_path2
                }


    return plagiarism_cases

'''
# Function to write plagiarism cases to a CSV file
def write_to_csv(plagiarism_cases, output_file):
    with open(output_file, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['student_submission_file_path', 'similarity_percentage', 'plagiarised_file_path'])
        for case in plagiarism_cases:
            writer.writerow([case[0], f"{case[1]*100:.2f}%", case[2]])
'''
# Function to write plagiarism cases to a JSON file
def write_to_json(plagiarism_cases, output_directory):
    output_file = os.path.join(output_directory, "report.json") #TODO: maybe allow user to change the name of the JSON file 
    os.makedirs(output_directory, exist_ok=True)

    with open(output_file, 'w') as file:
        json.dump(plagiarism_cases, file, indent=4)

# Main function to handle command-line arguments and run the plagiarism detection
def main():
    parser = argparse.ArgumentParser(description='Detect plagiarism in student submissions.')
    parser.add_argument('student_file', help='Text file containing paths to student submissions')
    parser.add_argument('previous_file', help='Text file containing paths to previous submissions')
    parser.add_argument('output_directory', help='Directory for output JSON file')
    #For CSV
    #parser.add_argument('output_csv', help='File path for output CSV')
    parser.add_argument('--threshold', type=float, default=0.50, help='Threshold for plagiarism detection')

    args = parser.parse_args()

    student_file_paths = read_file_paths(args.student_file)
    previous_file_paths = read_file_paths(args.previous_file)
    threshold = args.threshold

    plagiarism_results = detect_plagiarism(student_file_paths, previous_file_paths, threshold)

    write_to_json(plagiarism_results, args.output_directory)
    # print(f"Plagiarism report generated at {args.output_directory}/report.json")

    # For CSV
    # write_to_csv(plagiarism_results, args.output_csv)
    # print(f"Plagiarism report generated: {args.output_csv}")

    # For testing Purposes ------------------------------------------------------------------
    similarity_percentages = [
        float(value["similarity_percentage"].rstrip('%'))  # Remove '%' and convert to float
        for value in plagiarism_results.values()
    ]

    if similarity_percentages:  # Ensure the list is not empty to avoid max() error
        maxResult = round(max(similarity_percentages), 3)
    else:
        maxResult = 0.0

    print(base64.b64encode(str(maxResult).encode("utf-8")).decode("utf-8"))
    # ---------------------------------------------------------------------------------------


# Entry point for the script
if __name__ == '__main__':
    main()
