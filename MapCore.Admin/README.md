# MapCore

Steps to update a national map

### 0. Prerequisites
- You need the following csv files for the following maps 
- Be sure to specify the main attribute in the toolcongif.json
  You will need to make sure the id/names matches with the ToolConfig.json in MapAdmin Json Input 


### 1. MapCore.Admin
- Open Program.cs and change mapId for the map you are running the update for
- Copy over the csv files to MapCore.Admin/json-input
- Run the project and check if the json-output folder is populated
- Open the Markers.json files to make sure values are populated (if not column header in csv and json-input/Toolconfig.json column name may be different)

### 2. Push Json Files to AWS
- It includes 3 different pushes depending on what you are updating
	- App: Use "Publish Docker Application Image" section
	- Marker/Infobox Files: Use "Publish Private JSON Files" section
	- Excel files for download: Use "Publish Public Static Files"
