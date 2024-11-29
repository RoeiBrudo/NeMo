import os


def write_files_to_output(input_folder, output_file):
    """
    Reads all files from the input folder and writes their contents to a single output file
    with a specific format.

    Args:
        input_folder (str): Path to the input folder containing files to read
        output_file (str): Path to the output text file where contents will be written
    """
    try:
        # Create output file
        with open(output_file, 'w', encoding='utf-8') as outfile:
            # Walk through all files in the input folder
            for root, _, files in os.walk(input_folder):
                for filename in files:
                    file_path = os.path.join(root, filename)

                    try:
                        # Read each file
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            content = infile.read()

                            # Write to output file with the specified format
                            outfile.write(f"// {filename} path: {os.path.relpath(file_path, input_folder)}\n")
                            outfile.write(content)
                            outfile.write("\n\n")  # Add spacing between files

                    except Exception as e:
                        print(f"Error reading file {file_path}: {str(e)}")

        print(f"Successfully wrote contents to {output_file}")

    except Exception as e:
        print(f"Error: {str(e)}")


if __name__ == "__main__":
    # Get input from user
    input_folder = "C:\\Users\\brudo\\Desktop\\projects\\Brain\\Nemo-app\\brains-app\\src"
    output_file = "C:\\Users\\brudo\\Desktop\\nemo_app.txt"

    # Check if input folder exists
    if not os.path.exists(input_folder):
        print("Error: Input folder does not exist!")
    else:
        write_files_to_output(input_folder, output_file)
