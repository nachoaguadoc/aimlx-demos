# AIMLX DEMO SERVER
Client-Server Architecture for the AIMLX Swisscom Group Demos

# Installation and deployment
#### 1. Installing dependencies
This application runs with Flask. In order to install all the needed dependencies, please execute the following command:
```
pip install -r requirements.txt
```
#### 2. Configuration file
Sometimes different demos needs to call an address and port to perform the requests. This information should not be public, and therefore needs to be in a file locally. In this repository we provide a template (config_template.py) with the skeleton needed for the config file, but with empty values. First, you have to copy it into the real config file by running:
```
cp config_template.py config.py
```

After that, if you need to test a demo with some specific values, you can update them locally in config.py. Remember that if there are new fields added to the config.py file, they must also be updated (with empty values) in config_template.py

#### 3. Preparing Flask
After installing the dependencies, you must specify the Flask file you want to run. You can do it by running
```
export FLASK_APP=server.py
```
If it's the first time running, you need to compile .scss files into .css files. To do that, you have to run the following commands:
```
cd static/ui-kit/custom/
sass scss/chatbot-layout.scss > css/chatbot-layout.css
sass scss/site-layout.scss > css/site-layout.css
sass scss/basic-io-layout.scss > css/basic-io-layout.css
```
If you modify any of the .scss templates given with the project, you will have to recompile it to make the changes visible in your app. To do that, just repeat the previous step for the files that should be updated.

If you don't have sass installed in your computer, feel follow instructions here: http://sass-lang.com/install 
Once this has been done, you can run the project with

#### 4. Go!
You are ready to run the server.
```
flask run
```
The demo server is now running in the printed address and port.

# Updates and changes
In order to modify the project, you need to make a pull request to the branch "develop". Please, remember:
1. No private addresses, ports or paths should be contained in the repo
2. Test the project before uploading it
3. Remember to update config_template.py if there are changes in the config.py file