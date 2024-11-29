import requests

base_url = "http://localhost:8000"

# params = [("experiment_name", "simplest")]
# params.append(("brain_name", "baby-brain"))
# url = f"{base_url}/brain-data/"

experiment_name = 'simplest'
url = f"{base_url}/experiment/{experiment_name}"

analysis_name = 'assemblies_sizes'
url = f"{base_url}/analysis/{experiment_name}/{analysis_name}"

graph_name = 'assemblies_sizes'
url = f"{base_url}/graphs/{experiment_name}/{analysis_name}/{graph_name}"


try:
    response = requests.get(url)
    response.raise_for_status()  # Raise exception for bad status codes
    r = response.json()
    print(r)
except requests.exceptions.RequestException as e:
    print(f"Error calling API: {e}")



